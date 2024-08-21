import { Check, ChevronsUpDown } from "lucide-react"
import { isOptionGroupArray, Option, OptionGroup, ValueEditorProps } from "react-querybuilder"

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
import clsx from "clsx"
import { useCallback, useMemo, useState } from "react"
import { useRemoteOptions } from "../hooks/use-remote-options"

export type ComboBoxMultiProps = {
  options?: OptionList
  value: string | undefined
  disabled?: boolean
  searchPlaceholder?: string
  onValueChange: (value: string | string[]) => void
  className?: string
  fieldData?: ValueEditorProps['fieldData'] & {
    fetchValues?: (values: any) => any;
    allowMultipleValues?: boolean
  },

  allowMultipleValues?: boolean
}

type ComboBoxMultiInternalOption = { 
  label: string; 
  value: string;
  group?: string;
}

/**
 * 
 * Consider downshift or react-select for alternative ComboBoxMulti 
 * https://github.com/birobirobiro/awesome-shadcn-ui?tab=readme-ov-file
 * 
 */
export function ComboBoxMulti({
  options: _options,
  disabled = false,
  value: _value,
  onValueChange: _onValueChange = () => {},
  searchPlaceholder,
  className,
  fieldData,
}: ComboBoxMultiProps) {
  const {
    fetchValues,
    allowMultipleValues
  } = fieldData ?? {}
  const remoteOptions = useRemoteOptions({
    value: _value,
    fetchValues: fetchValues,
    multiple: true, // select only one or multiple
  });
  const localOptions = { options: _options, onQueryChange: () => {} };
  const { options: _optionsPossiblyRemote, onQueryChange } = fieldData?.fetchValues ? remoteOptions : localOptions;

  const [open, setOpen] = useState(false)

  const value = useMemo(() => {
    return (
      Array.isArray(_value) && allowMultipleValues ? _value : [_value]
    ) as string[]
  }, [_value, allowMultipleValues])

  const onValueChange = useCallback(
    (value: string[]) => {
      const newValue = allowMultipleValues ? value : value[0]
      _onValueChange(newValue)
    },
    [_onValueChange, allowMultipleValues]
  )
  const options: Array<ComboBoxMultiInternalOption> = (
      isOptionGroupArray(_optionsPossiblyRemote)
        ? _optionsPossiblyRemote.flatMap((og) => og.options)
        : Array.isArray(_optionsPossiblyRemote)
        ? _optionsPossiblyRemote
        : []
    ).map((option) => {
    // TODO: Find out how to properly type this
    const _option = option as ComboBoxMultiInternalOption
    return {
      value: _option.value,
      label: _option.group ? `${_option.group} - ${_option.label}` : _option.label,
      group: _option.group,
    }
  })

  console.log("Rendering ComboBoxMulti", {
    _optionsPossiblyRemote,
    onQueryChange,
    options,
    value,
  })

  const groups = options.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, ComboBoxMultiInternalOption[]>);

  const MAX_VALUES = 4
  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen} 
      // popover must be a modal to capture inputs if embedded inside of a Dialog
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="ComboBoxMulti"
            aria-expanded={open}
            className={clsx("max-w-[375px] justify-between", className)}
            disabled={disabled}
          >
          {Array.isArray(value) ? 
            (
              value.length > 0 ? 
                <>
                  {[...value].slice(0, MAX_VALUES).map((it) => (
                      <div key={it} className="bg-accent px-3 py-1 rounded-sm text-sm truncate">
                        {it}
                      </div>
                    ))}
                    {value.length > MAX_VALUES && (
                      <div className="bg-accent px-3 py-1 rounded-sm text-sm">
                        +{value.length - MAX_VALUES}
                      </div>
                    )}
                </>
                : options.find((option) => option.value === value?.[0])?.label ?? "Choose..."
            )
          : (
            // not array, i.e. a string value like the field selector
            value ? options.find((option) => option.value === value)?.label : "Select..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {/* <Button
          variant="outline"
          role="ComboBoxMulti"
          aria-expanded={open}
          className={clsx("max-w-[375px] justify-between", className)}
          disabled={disabled}
        >
          <div className="flex-1 truncate text-ellipsis text-left">
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select options..."}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button> */}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0 tw" 
        align="start"
        unselectable="off"
        // sideOffset={-35} // to overlap with above      
      >
        <Command className="text-black" 
          filter={(value, search, keywords=[]) => {
            const searchLower = search.toLowerCase();
            const searchArray = searchLower.split(' ')
            if (searchArray.every(searchTerm => keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))) {
              return 1;
            }
            return 0
          }}
        >
          <CommandInput 
            className="text-muted-foreground" 
            placeholder={searchPlaceholder || "Search..."}  
            onValueChange={(search) => {
              console.log("Search changed", search);
              onQueryChange(search);
            }}
          />
          <CommandList>
            <CommandEmpty className="text-muted-foreground p-4 text-sm">No filters found.</CommandEmpty>
            {Object.keys(groups).map((group) => {
              const optionsInGroup = groups[group];
              return (
                <CommandGroup key={group} heading={group}>
                  {optionsInGroup.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        /**
                         * by default, Command searches by value not label
                         * Add label to search keywords list
                         */
                        keywords={[group, option.label]} 
                        onSelect={(currentValue: any) => {
                          let newValue = value as any; // this can be string | string[]
                          const isArray = (value: any): value is any[] => Array.isArray(value);
                          console.log("foo", {value, currentValue})
                          if (!allowMultipleValues) {
                            newValue = option.value
                            console.log("Not allowing multiple")
                          } else {
                            if (currentValue === option.value) {
                              const included = value.includes(currentValue)
                              newValue = included
                                ? value.filter((v) => v !== currentValue)
                                : value.concat(currentValue);

                              console.log("Allowing multiple", currentValue, included, newValue);
                            }
                          }

                          /**
                           * Don't close if multi values for ux
                           */
                          if (!allowMultipleValues) {
                            setOpen(false);
                          }
                          
                          console.log("Setting new value to", newValue);
                          onValueChange(newValue.map);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-sm",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label.replace(group + ' -', '')}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}

            {/* 
              Support arbitrary nested optionGroups in future.
            */}
            {/* {isOptionGroupArray(options) ? (
              options.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.options.map((option) => (
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
              ))
            ) :
             Array.isArray(options) ? (
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
            ) 
            : null
          } */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
