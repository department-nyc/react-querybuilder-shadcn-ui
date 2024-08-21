import { Check, ChevronsUpDown } from "lucide-react"
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
import { useOptionsRemoteOptions } from "./use-remote-options"
import { useCallback, useMemo, useState } from "react"

export type ComboBoxProps = {
  multiselect?: boolean
  options?: OptionList
  value: string | string[] | undefined
  disabled?: boolean
  onValueChange?: (value: string | string[] | undefined) => void
  onQueryChange?: (query: string) => void
}

type ComboBoxInternalOption = { 
  label: string
  name: string
  value?: string
}

export function ComboBox({
  multiselect = false,
  options: options_ = [],
  disabled = false,
  value: _value,
  onValueChange: _onValueChange = () => {},
  onQueryChange: _onQueryChange = () => {},
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)
  
  const { options, onQueryChange } = useOptionsRemoteOptions(options_, multiselect, _value)

  const value = useMemo(() => {
    return (
      Array.isArray(_value) && multiselect ? _value : [_value]
    ) as string[]
  }, [_value, multiselect])

  const onValueChange = useCallback(
    (value: string[]) => {
      const newValue = multiselect ? value : value[0]
      _onValueChange(newValue)
    },
    [_onValueChange, multiselect]
  )

  if (isOptionGroupArray(options_)) {
    return <div>Option group array</div>
  }

  /**
   * Very confusing, but value is optional in most option types.
   * name is equivalent to value, except when name can't be duplicated?
   */
  const getNameOrValueFromOption = (option: ComboBoxInternalOption) => {
    return option.value || option.name 
  }

  const MAX_ITEMS = 3
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] flex gap-1 hover:bg-accent-foreground/15 items-center justify-start truncate"
          disabled={disabled}
        >
          {multiselect ? (
            /**
             * Is a multiselect, render up to N items as badges, and "+N" if there are more
             */
             value?.length > 0 ? (
              <>
                {[...value].slice(0, MAX_ITEMS).map((it) => (
                    <div key={it} className="bg-accent px-2 py-1 rounded-sm text-sm truncate shrink-0 max-w-32 leading-normal">
                      {it}
                    </div>
                  ))}
                  {value.length > MAX_ITEMS && (
                    <div className="bg-accent px-2 py-1 rounded-sm text-sm">
                      +{value.length - MAX_ITEMS}
                    </div>
                  )}
              </>
            ) : "Select options..."
          ) : (
              /**
               * Not a multiselect; therefore render either the single value or "Select options..."
               */
              value ? value: "Select options..."
            )
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
              {options.map((option_) => {
                if (isOptionGroupArray(option_)) {
                  return "TBD: option group array -- though this should never be done, since opt groups aren't sorted well"
                } 
                const option = option_ as ComboBoxInternalOption
                const nameOrValue = getNameOrValueFromOption(option);
                const checked = value.includes(nameOrValue)
                return (
                  <CommandItem
                    key={nameOrValue}
                    value={nameOrValue}
                    onSelect={(currentValue) => {
                      let newValue: string[] = value
                      if (!multiselect) {
                        newValue = [nameOrValue]
                      } else {
                        if (currentValue === nameOrValue) {
                          const included = value.includes(currentValue)
                          newValue = included
                            ? value.filter((v) => v !== currentValue)
                            : value.concat(currentValue)
                        }
                      }
                      console.log("On value change", newValue)
                      // setOpen(false)
                      onValueChange(newValue)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        checked  ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
