import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { isOptionGroupArray, Option, OptionGroup } from "react-querybuilder"

import { cn } from "@/lib/utils"
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
import { OptionList } from "react-querybuilder"

export type ComboBoxProps = {
  options?: OptionList
  value: string | undefined
  disabled?: boolean
  onValueChange: (value: string | undefined) => void
}

type ComboBoxInternalOption = { label: string; value: string }

export function ComboBox({
  options: optionList = [],
  disabled = false,
  value,
  onValueChange,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  console.log({ optionList })

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
      return {
        value: _option.value,
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
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select options..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue
                    setOpen(false)
                    onValueChange(newValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
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
