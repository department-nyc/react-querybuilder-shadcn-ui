import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import clsx from "clsx"
import { Input } from "@/components/ui/input"

type MultiInputTestValue = {
  value: string,
  na: boolean,
  selectedTime: string
}

export interface InputWithToggleProps {
  value: MultiInputTestValue;
  className?: string
  onValueChange: (value: MultiInputTestValue) => void
};
/**
 * @see {@link https://react-querybuilder.js.org/docs/components/valueeditor#showcase}
 * Value editors should store multiple values as csv
 * TODO: separate the raw component from value editor
 */
export default function InputWithToggle(props: InputWithToggleProps) {
  const {
    value='',
    na=false,
    selectedTime,
  }: MultiInputTestValue = props.value;

  /**
   * TODO: use useValueEditor multiValueHandler
   */
  const naIsChecked = !!na

  return (
    <>

      <div className="flex items-center max-w-44 relative">
        <Input
          type="text" 
          className="text-sm px-3 py-2 border rounded-md"
          defaultValue={value} 
          onChange={(e) => { 
            props.onValueChange?.({
              ...props.value,
              value: e.target.value,
            })
          }}
        />

        <div className="flex items-center ml-auto space-x-2 absolute right-2 top-0 bottom-0">
          <Switch id={'toggle'}
            className={clsx(
              /**
               * Make match designs; TODO: move to default variant in Switch
               */
              "data-[state=checked]:bg-green-500",
              "h-3",
              "w-6",
              "[&>span]:dark:bg-white [&>span]:h-2 [&>span]:w-2 [&>span]:data-[state=checked]:translate-x-3",
            )} 
            checked={naIsChecked}
            onCheckedChange={(checked) => {          
              props.onValueChange?.({
                ...props.value,
                na: checked
              })
            }}
          />
          <Label htmlFor={'toggle'}
            className={clsx(
              "text-muted-foreground",
              /**
               * NOTE: this _has_ to be at end to not conflict with text-muted
               * TODO: twMerge not working as expected
               */
              "text-xxs",
            )}
          >
            + N/A
          </Label>
        </div>
      </div>
      {/* <div className="text-xxs">
        {JSON.stringify(props)}
      </div>} */}
    </>
  )
}