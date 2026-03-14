import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const toneSchema = z.enum(["neutral", "accent", "success", "warning"]);
const gapSchema = z.enum(["sm", "md", "lg"]);
const directionSchema = z.enum(["vertical", "horizontal"]);
const buttonVariantSchema = z.enum(["default", "outline", "secondary", "ghost"]);
const emphasisSchema = z.enum(["default", "strong", "muted"]);

export const jsonRenderCatalog = defineCatalog(schema, {
  components: {
    Section: {
      props: z.object({
        eyebrow: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        tone: toneSchema.optional(),
      }),
      slots: ["default"],
      description:
        "A framed section for a generated dashboard block, form block, or summary block.",
    },
    Stack: {
      props: z.object({
        direction: directionSchema.optional(),
        gap: gapSchema.optional(),
        wrap: z.boolean().optional(),
      }),
      slots: ["default"],
      description:
        "A layout wrapper for arranging children vertically or horizontally with consistent spacing.",
    },
    Grid: {
      props: z.object({
        columns: z.number().int().min(1).max(3).optional(),
        gap: gapSchema.optional(),
      }),
      slots: ["default"],
      description:
        "A responsive grid for metrics, option cards, or grouped callouts.",
    },
    Metric: {
      props: z.object({
        label: z.string(),
        value: z.string(),
        helper: z.string().optional(),
        tone: toneSchema.optional(),
      }),
      description:
        "Displays a key metric with a label, main value, and optional supporting note.",
    },
    Copy: {
      props: z.object({
        content: z.string(),
        emphasis: emphasisSchema.optional(),
      }),
      description:
        "Short explanatory copy, summaries, or dynamic text created from state.",
    },
    ActionButton: {
      props: z.object({
        label: z.string(),
        variant: buttonVariantSchema.optional(),
      }),
      description:
        "A button that emits a press event so the spec can trigger built-in actions like setState.",
    },
    InputField: {
      props: z.object({
        label: z.string(),
        value: z.string().optional(),
        placeholder: z.string().optional(),
        helper: z.string().optional(),
        multiline: z.boolean().optional(),
      }),
      description:
        "An input field that supports two-way state binding through $bindState.",
    },
    StatusNotice: {
      props: z.object({
        title: z.string(),
        message: z.string(),
        tone: toneSchema.optional(),
      }),
      description:
        "A compact callout for guidance, confirmation, or contextual next steps.",
    },
  },
  actions: {},
});

export const catalogBlueprint = [
  {
    name: "Section",
    description: "Framed content block for dashboards, forms, or summaries.",
    props: ["title", "description", "tone"],
  },
  {
    name: "Stack",
    description: "Simple layout primitive that keeps spacing and direction consistent.",
    props: ["direction", "gap", "wrap"],
  },
  {
    name: "Grid",
    description: "Responsive grid for grouped metrics or option cards.",
    props: ["columns", "gap"],
  },
  {
    name: "Metric",
    description: "Single KPI tile with value, label, and helper text.",
    props: ["label", "value", "helper"],
  },
  {
    name: "Copy",
    description: "Narrative text that can use templates or state-driven content.",
    props: ["content", "emphasis"],
  },
  {
    name: "ActionButton",
    description: "Interactive control that fires a named event into the spec.",
    props: ["label", "variant"],
  },
  {
    name: "InputField",
    description: "Bound text field for assistant-led intake or onboarding flows.",
    props: ["label", "value", "multiline"],
  },
  {
    name: "StatusNotice",
    description: "Inline callout for confirmation, warnings, or follow-up guidance.",
    props: ["title", "message", "tone"],
  },
] as const;
