import type { ComponentPropsWithoutRef } from "react"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { VersatileSelectorProps } from "react-querybuilder"
import { MultiSelect } from "./custom-value-editors/MultiSelect"
import { toSelectOptions } from "./utils"
import { ComboBox } from "./custom-value-editors/ComboBox"

export type ShadcnUiValueSelectorProps = VersatileSelectorProps &
  ComponentPropsWithoutRef<typeof Select>

export const ShadcnUiValueSelector = ({
  handleOnChange,
  options,
  value,
  title,
  disabled,
  // Props that should not be in extraProps
  testID: _testID,
  rule: _rule,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  field: _field,
  fieldData: _fieldData,
  multiple: _multiple,
  listsAsArrays: _listsAsArrays,
  schema: _schema,
  ...extraProps
}: ShadcnUiValueSelectorProps) => {
  const useComboBox = true

  return _multiple ? (
    <MultiSelect
      options={options}
      value={value as unknown as string[]}
      onValueChange={handleOnChange}
    />
  ) : useComboBox ? (
    <ComboBox
      options={options}
      value={value}
      disabled={disabled}
      onValueChange={handleOnChange}
      {...extraProps}
    />
  ) : (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={handleOnChange}
      {...extraProps}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>{toSelectOptions(options)}</SelectContent>
    </Select>
  )
}

ShadcnUiValueSelector.displayName = "ShadcnUiValueSelector"
