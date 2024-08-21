import { debounce, isEmpty } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { OptionList } from "react-querybuilder"

interface UseRemoteOptionsParams {
  fetchValues?: (query: string) => Promise<OptionList>
  multiple?: boolean
  initialOptions?: OptionList
}

export const useRemoteOptions = ({
  fetchValues,
  value,
  multiple = false,
  initialOptions = [],
}: UseRemoteOptionsParams) => {
  const [options, setOptions] = useState<OptionList>([])

  const onQueryChange = useCallback(
    debounce(async (query: string) => {
      if (fetchValues) {
        const newOptions = isEmpty(query)
          ? []
          : ((await fetchValues(query)) as OptionList)

        if (multiple) {
          const values = value as string[]
          // Keep old selected options
          const oldOptions = options
          const oldSelectedOptions = oldOptions.filter((option) => {
            return values.includes(option.value)
          })

          const newOptionsDict = newOptions.reduce((acc, option) => {
            acc[option.value] = option
            return acc
          }, {})

          const newAndOldOptions = [
            ...newOptions,
            ...oldSelectedOptions.filter((option) => {
              return isEmpty(newOptionsDict[option.value])
            }),
          ]

          console.log("newAndOldOptions", {
            values,
            oldOptions,
            oldSelectedOptions,
            newOptions,
            newAndOldOptions,
          })

          setOptions(newAndOldOptions)
        } else {
          setOptions(newOptions)
        }
      } else {
        setOptions(_options)
      }
    }, 100),
    [fetchValues, options]
  )

  return {
    options,
    onQueryChange,
  }
}
