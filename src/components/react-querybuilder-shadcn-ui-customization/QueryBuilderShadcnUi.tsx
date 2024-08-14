import {
  X,
  Copy,
  Unlock,
  Lock,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import type {
  Classnames,
  Controls,
  FullField,
  Translations,
} from "react-querybuilder";
import { getCompatContextProvider } from "react-querybuilder";
import { ShadcnUiActionElement } from "./ShadcnUiActionElement";
import { ShadcnUiActionElementIcon } from "./ShadcnUiActionElementIcon";
import { ShadcnUiValueEditor } from "./ShadcnUiValueEditor";
import { ShadcnUiValueSelector } from "./ShadcnUiValueSelector";
import { ShadcnUiNotToggle } from "./ShadcnUiNotToggle";
import { ShadcnUiDragHandle } from "./ShadcnUiDragHandle";

import "./styles.css";

export * from "./ShadcnUiActionElement";
export * from "./ShadcnUiValueSelector";

export const shadcnUiControlClassnames = {
  ruleGroup: "rule-group rounded-lg shadow-sm border bg-background",
} satisfies Partial<Classnames>;

export const shadcnUiControlElements = {
  actionElement: ShadcnUiActionElement,
  removeGroupAction: ShadcnUiActionElementIcon,
  removeRuleAction: ShadcnUiActionElementIcon,
  valueSelector: ShadcnUiValueSelector,
  valueEditor: ShadcnUiValueEditor,
  notToggle: ShadcnUiNotToggle,
  dragHandle: ShadcnUiDragHandle,
  
  // addGroupAction: (props) => (
  //   <ShadcnUiActionElement {...props}>
  //     <Plus className="w-4 h-4 mr-2" />
  //     Add group
  //   </ShadcnUiActionElement>
  // ),
} satisfies Partial<Controls<FullField, string>>;

export const shadcnUiTranslations = {
  addRule: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Condition
      </>
    ),
  },
  addGroup: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Condition Group
      </>
    ),
  },
  removeGroup: { label: <Trash2 className="w-4 h-4" /> },
  removeRule: { label: <Trash2 className="w-4 h-4" /> },
  cloneRuleGroup: { label: <Copy className="w-4 h-4" /> },
  cloneRule: { label: <Copy className="w-4 h-4" /> },
  lockGroup: { label: <Unlock className="w-4 h-4" /> },
  lockRule: { label: <Unlock className="w-4 h-4" /> },
  lockGroupDisabled: { label: <Lock className="w-4 h-4" /> },
  lockRuleDisabled: { label: <Lock className="w-4 h-4" /> },
  shiftActionDown: { label: <ChevronDown className="w-4 h-4" /> },
  shiftActionUp: { label: <ChevronUp className="w-4 h-4" /> },
} satisfies Partial<Translations>;

export const QueryBuilderShadcnUi = getCompatContextProvider({
  // key: "shadcn/ui",
  // debugMode: true,
  controlClassnames: shadcnUiControlClassnames,
  controlElements: shadcnUiControlElements,
  translations: shadcnUiTranslations,
  enableDragAndDrop: true,
});
