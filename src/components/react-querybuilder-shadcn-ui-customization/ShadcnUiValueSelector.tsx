import {
  useState,
  useEffect,
  type ComponentPropsWithoutRef,
  useCallback,
} from "react"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OptionList, VersatileSelectorProps } from "react-querybuilder"
import { MultiSelect } from "./custom-value-editors/MultiSelect"
import { toSelectOptions } from "./utils"
import { ComboBox } from "./custom-value-editors/ComboBox"
import { debounce, isEmpty } from "lodash"
import { useRemoteOptions } from "./hooks/use-remote-options"

export type ShadcnUiValueSelectorProps = VersatileSelectorProps &
  ComponentPropsWithoutRef<typeof Select> & {
    combobox?: boolean
  }

const fetchMockOptions = (query: string) => {
  const options = [
    { name: "Accessories", label: "Accessories" },
    {
      name: "Accounting, Audit and Tax Services (B2B)",
      label: "Accounting, Audit and Tax Services (B2B)",
    },
    {
      name: "Accounting, Audit and Tax Services (B2C)",
      label: "Accounting, Audit and Tax Services (B2C)",
    },
    { name: "Aerospace and Defense", label: "Aerospace and Defense" },
    { name: "Agricultural Chemicals", label: "Agricultural Chemicals" },
    { name: "Air", label: "Air" },
    {
      name: "Alternative Energy Equipment",
      label: "Alternative Energy Equipment",
    },
    { name: "Aluminum Mining", label: "Aluminum Mining" },
    { name: "Animal Husbandry", label: "Animal Husbandry" },
  ].map((i) => ({ ...i, value: i.name }))

  return new Promise((resolve) => {
    setTimeout(() => {
      const _query = query.trim()

      const selectedOptions = options.filter((option) => {
        return option.label.toLowerCase().includes(_query.toLowerCase())
      })

      resolve(selectedOptions)
    }, Math.random() * 200)
  })
}

export const ShadcnUiValueSelector = ({
  handleOnChange,
  options: _options,
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
  combobox: _combobox = true,
  listsAsArrays: _listsAsArrays,
  schema: _schema,
  ...extraProps
}: ShadcnUiValueSelectorProps) => {
  const { options, onQueryChange } = _options.fetchValues
    ? useRemoteOptions({
        value,
        fetchValues: _options.fetchValues,
        multiple: _multiple,
        initialOptions: _options,
      })
    : { options: _options, onQueryChange: () => {} }

  return _multiple ? (
    _combobox ? (
      <ComboBox
        multiselect
        options={options}
        value={value as unknown as string[]}
        disabled={disabled}
        onValueChange={handleOnChange}
        onQueryChange={onQueryChange}
        {...extraProps}
      />
    ) : (
      <MultiSelect
        options={options}
        value={value as unknown as string[]}
        onValueChange={handleOnChange}
      />
    )
  ) : _combobox ? (
    <ComboBox
      options={options}
      value={value}
      disabled={disabled}
      onValueChange={handleOnChange}
      onQueryChange={onQueryChange}
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
