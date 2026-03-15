import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const gapSchema = z.enum(["sm", "md", "lg"]);
const directionSchema = z.enum(["vertical", "horizontal"]);
const buttonVariantSchema = z.enum(["default", "outline"]);

export const demoModelId = "anthropic/claude-sonnet-4.5";

export const jsonRenderCatalog = defineCatalog(schema, {
  components: {
    Stack: {
      props: z.object({
        direction: directionSchema.optional(),
        gap: gapSchema.optional(),
      }),
      slots: ["default"],
      description:
        "Layout container that stacks children vertically or horizontally.",
    },
    Card: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
      }),
      slots: ["default"],
      description:
        "Card container with a title, optional description, and nested content.",
    },
    Text: {
      props: z.object({
        content: z.string(),
      }),
      description:
        "Plain supporting text or a short paragraph.",
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: buttonVariantSchema.nullable().optional(),
      }),
      description:
        "Clickable button. Add an `on.press` action when the UI needs interactivity.",
    },
  },
  actions: {
    show_message: {
      params: z.object({
        message: z.string(),
      }),
      description: "Show a short confirmation message below the generated UI.",
    },
  },
});

export const systemPrompt = jsonRenderCatalog.prompt({
  system: "You generate compact UI specs for a simple json-render demo page.",
  customRules: [
    "Return only json-render patch lines. No prose, no markdown fences, no explanations.",
    "Keep the UI compact and practical.",
    "Prefer one root Stack with one or two Cards.",
    "Use short titles and concise copy.",
    "When you include a Button, wire `on.press` to `show_message` with a short message.",
    "Do not invent components, props, or actions outside this catalog.",
  ],
});

export const examplePrompts = [
  "Create a compact launch card with a short summary and one primary button.",
  "Build a simple two-card event layout with details and an RSVP action.",
  "Make a tiny onboarding panel with three short text steps and a continue button.",
] as const;
