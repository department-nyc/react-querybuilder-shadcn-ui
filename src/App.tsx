import { useState } from "react"

import { QueryBuilderDnD } from "@react-querybuilder/dnd"
import * as ReactDnD from "react-dnd"
import * as ReactDndHtml5Backend from "react-dnd-html5-backend"
import {
  add,
  defaultOperators,
  Field,
  formatQuery,
  QueryBuilder,
} from "react-querybuilder"

const values = [
  { name: "option1", label: "New York City" },
  { name: "option2", label: "Chicago" },
  { name: "option3", label: "Seattle" },
  { name: "option4", label: "Portland" },
]

const timeValues = [
  { name: "LM", label: "Last month" },
  { name: "L3M", label: "Last 3 months" },
  { name: "L6M", label: "Last 6 months" },
]

const fields: Field[] = [
  { name: "city", label: "City", valueEditorType: "select", values },
  { name: "cities", label: "Cities", valueEditorType: "multiselect", values },
  { name: "totalRaised", label: "Total Raised", inputType: "text" },
  { name: "text", label: "Text", inputType: "text" },
  { name: "checkbox", label: "checkbox", valueEditorType: "checkbox" },
  { name: "radio", label: "radio", valueEditorType: "radio", values },
  { name: "textarea", label: "textarea", valueEditorType: "textarea" },
  {
    name: "multiselect",
    label: "multiselect",
    valueEditorType: "multiselect",
    values,
  },
  { name: "date", label: "date", inputType: "date" },
  {
    name: "datetime-local",
    label: "datetime-local",
    inputType: "datetime-local",
  },
  { name: "time", label: "time", inputType: "time" },
  {
    name: "multiValueSources",
    label: "Multi Value Sources",
    valueSources: ["value", "field"],
  },
  {
    name: "webTrafficGrowth",
    label: "Web Traffic Growth",
    // TODO: TS
    valueEditorType: "multiInputTest" as any,
    values: timeValues,
  },
]

const operators = [...defaultOperators]

const defaultQuery = {
  combinator: "and",
  rules: [
    { field: "city", operator: "=", value: "option1" },
    { field: "totalRaised", operator: "between", value: "50M,100M" },
    { field: "multiValueSources", operator: "in", value: "" },
    {
      combinator: "or",
      rules: [
        { field: "city", operator: "=", value: "option1" },
        { field: "totalRaised", operator: "between", value: "1000000,5000000" },
        {
          combinator: "and",
          rules: [
            { field: "date", operator: "=", value: "2023-01-01" },
            { field: "time", operator: "=", value: "09:00" },
          ],
        },
      ],
    },
    // { field: "date", operator: "=", value: "" },
    // { field: "datetime-local", operator: "=", value: "" },
    // { field: "time", operator: "=", value: "" },
    { field: "field", operator: "between", value: "A,Z" },
    // { field: "select", operator: "between", value: "option2,option4" },
    // { field: "field", operator: "=", value: "text", valueSource: "field" },
  ],
}

/**
 * Example of matching original designs using
 * - 1st tier +condition/group to bottom via grid
 * - 2nd tier Popups on sub queries to add a rule or group (but note it takes 2 clicks to add )
 * - Takes much more customization
 * - Consider reviewing other layouts (design-dev collaboration to get highest bang for buck/maintainability etc)
 */
export const WithLeftAlign = () => {
  /**
   * @see {@link https://react-querybuilder.js.org/docs/tips/external-controls}
   * External controls vs sticking with default;
   * This would allow us to match designs (where the Add rule buttons are at the bottom)
   */
  return (
    <div>
      <QueryBuilderShadcnUi>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            controlClassnames={{ queryBuilder: "queryBuilderWithLeftAlign" }}
            fields={fields}
            operators={operators}
            combinators={[
              { name: "and", label: "AND" },
              { name: "or", label: "OR" },
            ]}
            addRuleToNewGroups
            showCombinatorsBetweenRules
            controlElements={{
              /**
               * Prevent condition groups beyond 2 levels deep
               */
              addGroupAction: (props) => {
                const { level } = props
                const MAX_GROUP_DEPTH = 3
                if (level >= MAX_GROUP_DEPTH) {
                  return null
                }
                if (level >= 1) {
                  return <ShadcnUiActionElementGroupPopup {...props} />
                }
                return <ShadcnUiActionElement {...props} />
              },
            }}
            defaultQuery={defaultQuery}
          />
        </QueryBuilderDnD>
      </QueryBuilderShadcnUi>
    </div>
  )
}

/**
 * This is an example of react-querybuilder OOTB alternate layout
 * that may be of interest/more intuitive
 *
 * @see {@link https://react-querybuilder.js.org/}
 */
export const AlternateLayout = () => {
  /**
   * @see {@link https://react-querybuilder.js.org/docs/tips/external-controls}
   * External controls vs sticking with default;
   * This would allow us to match designs (where the Add rule buttons are at the bottom)
   */

  return (
    <div>
      <QueryBuilderShadcnUi>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            controlClassnames={{
              queryBuilder: [
                "queryBuilderWithAlternateLayout",
                "queryBuilder-branches",
                "with-branch-lines",
              ],
            }}
            showCloneButtons
            fields={fields}
            operators={operators}
            defaultQuery={defaultQuery}
          />
        </QueryBuilderDnD>
      </QueryBuilderShadcnUi>
    </div>
  )
}

/**
 * This story is intended to showcase features of react-querybuilder for future use/ideation for the team.
 * Shows examples of:
 * - clone button
 * - lock button
 * - not toggle
 * - shift actions (up/down arrows)
 */
export const ShowQueryBuilderMoreFeatures = () => {
  /**
   * @see {@link https://react-querybuilder.js.org/docs/tips/external-controls}
   * External controls vs sticking with default;
   * This would allow us to match designs (where the Add rule buttons are at the bottom)
   */

  return (
    <div>
      <QueryBuilderShadcnUi>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            controlClassnames={{
              queryBuilder: [
                "queryBuilderWithAlternateLayout",
                "queryBuilder-branches",
                "with-branch-lines",
              ],
            }}
            showCloneButtons
            showLockButtons
            showNotToggle
            showShiftActions
            fields={fields}
            operators={operators}
            defaultQuery={defaultQuery}
          />
        </QueryBuilderDnD>
      </QueryBuilderShadcnUi>
    </div>
  )
}

const fieldsForBen: Field[] = [
  {
    name: "name",
    label: "Name",
    valueEditorType: "text",

    operators: [
      {
        name: "=",
        label: "is",
      },
    ],

    validator: (q) => ({
      valid: q.value !== "invalid",
      reasons: ['text must not be "invalid"'],
    }),
  },
  {
    name: "domain",
    label: "Domain",
    valueEditorType: "text",
    operators: [
      { name: "=", label: "is" },
      { name: "!=", label: "is not" },
    ],
  },
  {
    name: "isPortfolio",
    label: "Is Portfolio",
    valueEditorType: "select",
    values: [
      { name: "True", label: "True" },
      { name: "False", label: "False" },
    ],
    operators: [
      { name: "=", label: "is" },
      { name: "!=", label: "is not" },
    ],
  },
  {
    name: "description",
    label: "Description",
    valueEditorType: "text",
    operators: [
      { name: "contains", label: "contains" },
      { name: "doesNotContain", label: "does not contain" },
    ],
  },
  {
    name: "industrySector",
    label: "Industry Sector",
    valueEditorType: "multiselect",
    values: [
      {
        name: "Business Products and Services (B2B)",
        label: "Business Products and Services (B2B)",
      },
      {
        name: "Consumer Products and Services (B2C)",
        label: "Consumer Products and Services (B2C)",
      },
      { name: "Energy", label: "Energy" },
    ],
    operators: [
      { name: "=", label: "is" },
      { name: "!=", label: "is not" },
    ],
  },
  {
    name: "industryGroup",
    label: "Industry Group",
    valueEditorType: "multiselect",
    values: {
      fetchValues: async (query: string) => {
        const response = await fetch(
          `http://universities.hipolabs.com/search?name=${query}`
        )
        const data = await response.json()
        return data.map((i: any) => ({ ...i, value: i.name, label: i.name }))
      },
    },
    operators: [
      { name: "=", label: "is" },
      { name: "!=", label: "is not" },
    ],
  },
  {
    name: "industryCode",
    label: "Industry Code",
    valueEditorType: "multiselect",
    values: [
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
    ],
    operators: [
      { name: "=", label: "is" },
      { name: "!=", label: "is not" },
    ],
  },
  {
    name: "foundingYear",
    label: "Founding Year",
    inputType: "number",
    operators: [
      { name: "<", label: "less than" },
      { name: "between", label: "between" },
      { name: ">", label: "greater than" },
    ],
    validator: (q) => {
      console.log("Validating", q)

      const years = q.value
        .split(",")
        .map((year: string) => Number(year.trim()))
      if (years.some((year: number) => year < 1500)) {
        return {
          valid: false,
          reasons: ["that's way too old", "second reason"],
        }
      }
      return {
        valid: true,
      }
    },
  },
  {
    name: "webTrafficGrowth",
    label: "Web Traffic Growth",
    // TODO: TS
    valueEditorType: "multiInputTest" as any,
    values: timeValues,
  },
]

export const WithRealisticDataForBen = ({}) => {
  const [query, setQuery] = useState({})

  const handleQueryChange = (query: any) => {
    setQuery(query)
    console.log("Query:", query)
  }

  return (
    <QueryBuilderShadcnUi>
      <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
        <QueryBuilder
          controlClassnames={{
            queryBuilder: [
              "queryBuilderWithAlternateLayout",
              "queryBuilder-branches",
              "with-branch-lines",
            ],
          }}
          fields={fieldsForBen}
          // operators={operators}
          onQueryChange={handleQueryChange}
          addRuleToNewGroups
          showCloneButtons
          defaultQuery={{
            combinator: "and",
            rules: [
              {
                field: "webTrafficGrowth",
                operator: ">",
                value: {
                  value: "30%",
                  na: true,
                  selectedTime: "L3M",
                },
                timeValues,
              },
              { field: "name", label: "Name", operator: "=", value: "invalid" },
              {
                field: "isPortfolio",
                label: "Is Portfolio",
                operator: "=",
                value: "True",
              },
              {
                combinator: "and",
                rules: [
                  { field: "name", operator: "=", value: "Acme Corporation" },
                  { field: "domain", operator: "!=", value: "example.com" },
                  { field: "isPortfolio", operator: "=", value: "True" },
                  {
                    field: "description",
                    operator: "contains",
                    value: "innovative technology",
                  },
                  {
                    field: "industrySector",
                    operator: "=",
                    value: ["Business Products and Services (B2B)", "Energy"],
                  },
                  {
                    field: "industryGroup",
                    operator: "!=",
                    value: ["Agriculture", "Capital Markets/Institutions"],
                  },
                  {
                    field: "industryCode",
                    operator: "=",
                    value: [
                      "Aerospace and Defense",
                      "Alternative Energy Equipment",
                    ],
                  },
                  {
                    field: "foundingYear",
                    operator: "between",
                    value: "2000,2010",
                  },
                  {
                    field: "webTrafficGrowth",
                    operator: ">",
                    value: {
                      value: "25%",
                      na: false,
                      selectedTime: "L6M",
                    },
                  },
                ],
              },
            ],
          }}
        />

        <div className="prose my-20">
          {["json_without_ids", "jsonlogic", "parameterized"].map((format) => {
            return (
              <div key={format}>
                <h3>Formatted query: {format}</h3>
                <pre className="text-xs">
                  {renderFormattedJson(query, format)}
                </pre>
              </div>
            )
          })}
        </div>
      </QueryBuilderDnD>
    </QueryBuilderShadcnUi>
  )
}

export const MultiInputTest = ({}) => {
  const [query, setQuery] = useState({})

  const handleQueryChange = (query: any) => {
    setQuery(query)
    console.log("Query:", query)
  }

  return (
    <QueryBuilderShadcnUi>
      <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
        <QueryBuilder
          controlClassnames={{
            queryBuilder: [
              "queryBuilderWithAlternateLayout",
              "queryBuilder-branches",
              "with-branch-lines",
            ],
          }}
          fields={fields}
          operators={operators}
          onQueryChange={handleQueryChange}
          defaultQuery={{
            combinator: "and",
            rules: [
              {
                field: "text",
                label: "City",
                operator: "=",
                value: "New York City",
              },
              {
                combinator: "and",
                rules: [
                  {
                    field: "webTrafficGrowth",
                    operator: ">",
                    value: {
                      value: "30%",
                      na: true,
                      selectedTime: "LM",
                    },
                    timeValues,
                  },
                  {
                    field: "webTrafficGrowth",
                    operator: ">",
                    value: {
                      value: "0%",
                      na: false,
                      selectedTime: "LM",
                    },
                    timeValues,
                  },
                ],
              },
            ],
          }}
        />

        <div className="prose my-20">
          {["json_without_ids", "jsonlogic", "parameterized"].map((format) => {
            return (
              <div key={format}>
                <h3>Formatted query: {format}</h3>
                <pre className="text-xxs">
                  {renderFormattedJson(query, format)}
                </pre>
              </div>
            )
          })}
        </div>
      </QueryBuilderDnD>
    </QueryBuilderShadcnUi>
  )
}

function renderFormattedJson(query: any, format: string) {
  if (isEmpty(query)) {
    return null
  }
  const formatted = formatQuery(query, format as any)
  // sometimes formatter returns strings
  const json = typeof formatted === "string" ? JSON.parse(formatted) : formatted
  return JSON.stringify(json, null, 2)
}

/**
 * Test Popup
 */
import { Button } from "@/components/ui/button"
import type { ActionWithRulesAndAddersProps } from "react-querybuilder"

import { ModeToggle } from "@/components/mode-toggle"
import { QueryBuilderShadcnUi } from "@/components/react-querybuilder-shadcn-ui-customization/QueryBuilderShadcnUi"
import { ShadcnUiActionElement } from "@/components/react-querybuilder-shadcn-ui-customization/ShadcnUiActionElement"
import { ThemeProvider } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from "clsx"
import { isEmpty } from "lodash"
import { CirclePlus } from "lucide-react"

export type ShadcnUiActionProps = ActionWithRulesAndAddersProps

const ShadcnUiActionElementGroupPopup = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Props that should not be in extraProps
  // testID: _testID,
  // rules: _rules,
  // level: _level,
  // path: _path,
  // context: _context,
  // validation: _validation,
  // ruleOrGroup: _ruleOrGroup,
  // schema: _schema,
  ...props
}: ShadcnUiActionProps) => {
  const handleAddGroup = (e: Event) => {
    handleOnClick(e as any) // this expects a react event but DropDownEvent expects Event
  }

  const handleAddRule = (e: Event) => {
    props.schema.dispatchQuery(
      add(
        props.schema.getQuery() as any,
        { field: "", operator: "=", value: "" },
        props.path
      )
    )
  }

  const isAnd = () => {}
  // const helperText = ? 'Any of the following are true...' : 'All of the following are false...'
  return (
    <>
      <div className="text-grey-dark">Any of the following are true...</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className={clsx(className, "ml-auto")}>
            <CirclePlus className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleAddGroup}>
            {disabledTranslation && disabled
              ? disabledTranslation.label
              : "Add Condition Group"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleAddRule}>
            Add Condition
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

ShadcnUiActionElement.displayName = "ShadcnUiActionElement"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="m-12 space-y-8">
        <ModeToggle />
        <div className="flex flex-col gap-20">
          {/* <WithLeftAlign /> */}
          <WithRealisticDataForBen />
        </div>
      </div>
    </ThemeProvider>
  )
}
