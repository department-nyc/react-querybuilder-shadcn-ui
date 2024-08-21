import { debounce, isEmpty } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { OptionList } from "react-querybuilder"

export const useOptionsRemoteOptions = (_options: any, _multiple: boolean, value: any) => {
    const [options, setOptions] = useState<OptionList>([])

    useEffect(() => {
      setOptions(_options.fetchValues ? [] : _options)
    }, [_options])

    const onQueryChange = useCallback(
      debounce(async (query: string) => {
        const { fetchValues } = _options as any
        if (fetchValues) {
          const newOptions = isEmpty(query)
            ? []
            : ((await fetchValues(query)) as OptionList)

          if (_multiple) {
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
      [_options, options]
    )

    return { options, onQueryChange }
  }
