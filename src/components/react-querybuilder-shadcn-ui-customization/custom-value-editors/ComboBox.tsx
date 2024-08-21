import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { isOptionGroupArray } from "react-querybuilder"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { OptionList } from "react-querybuilder"

export type ComboBoxProps = {
  multiselect?: boolean
  options?: OptionList
  value: string | string[] | undefined
  disabled?: boolean
  onValueChange?: (value: string | string[] | undefined) => void
  onQueryChange?: (query: string) => void
}

type ComboBoxInternalOption = { label: string; value: string; name: string }

export function ComboBox({
  multiselect = false,
  options: optionList = [],
  disabled = false,
  value: _value,
  onValueChange: _onValueChange = () => {},
  onQueryChange = () => {},
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  const value = React.useMemo(() => {
    return (
      Array.isArray(_value) && multiselect ? _value : [_value]
    ) as string[]
  }, [_value, multiselect])

  const onValueChange = React.useCallback(
    (value: string[]) => {
      const newValue = multiselect ? value : value[0]
      _onValueChange(newValue)
    },
    [_onValueChange, multiselect]
  )

  // TODO: Allow Option Groups within combobox
  // Right now we are flatenning everything into a simple array of options
  const options: Array<ComboBoxInternalOption> = React.useMemo(() => {
    return (
      isOptionGroupArray(optionList)
        ? optionList.flatMap((og) => og.options)
        : Array.isArray(optionList)
        ? optionList
        : []
    ).map((option) => {
      // TODO: Find out how to properly type this
      const _option = option as ComboBoxInternalOption

      const nameOrValue = _option.value || _option.label

      return {
        name: _option.name || nameOrValue,
        value: _option.value || nameOrValue,
        label: _option.label,
      }
    })
  }, [optionList])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] flex gap-1 hover:bg-accent-foreground/15"
          disabled={disabled}
        >
          {(multiselect && value?.length > 0) ? (
            <>
              {[...value].slice(0, 2).map((it) => (
                  <div key={it} className="bg-accent px-3 py-1 rounded-sm text-sm truncate">
                    {it}
                  </div>
                ))}
                {value.length > 2 && (
                  <div className="bg-accent px-3 py-1 rounded-sm text-sm">
                    +{value.length - 2}
                  </div>
                )}
            </>
          ) : (
            // not multiselect
            value.length > 0 ? options.find((option) => option.value === value[0])?.label : "Select options...")
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search options..."
            onValueChange={(query) => {
              onQueryChange(query);
              console.log("Query change", query);
            }}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    let newValue: string[] = value
                    if (!multiselect) {
                      newValue = [option.value]
                    } else {
                      if (currentValue === option.value) {
                        const included = value.includes(currentValue)
                        newValue = included
                          ? value.filter((v) => v !== currentValue)
                          : value.concat(currentValue)
                      }
                    }

                    // setOpen(false)
                    onValueChange(newValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
