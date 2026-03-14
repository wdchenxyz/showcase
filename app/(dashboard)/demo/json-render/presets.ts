import type { Spec } from "@json-render/core";

export type DemoPreset = {
  id: string;
  name: string;
  prompt: string;
  useCase: string;
  whyItWorks: string;
  proofPoints: string[];
  spec: Spec;
};

const executiveDashboardSpec: Spec = {
  root: "executive-root",
  state: {
    lens: "finance",
  },
  elements: {
    "executive-root": {
      type: "Section",
      props: {
        eyebrow: "Prompt result",
        title: "Executive pulse board",
        description:
          "A safe component catalog lets AI reshuffle the same dashboard into a finance or operations view without inventing new UI.",
        tone: "accent",
      },
      children: [
        "executive-lead",
        "executive-controls",
        "finance-grid",
        "ops-grid",
        "executive-note",
      ],
    },
    "executive-lead": {
      type: "Copy",
      props: {
        content:
          "Use json-render when stakeholders keep asking for a slightly different dashboard. The model can rearrange approved blocks while your design system stays intact.",
      },
      children: [],
    },
    "executive-controls": {
      type: "Stack",
      props: {
        direction: "horizontal",
        gap: "sm",
        wrap: true,
      },
      children: ["finance-button", "ops-button"],
    },
    "finance-button": {
      type: "ActionButton",
      props: {
        label: "Finance lens",
        variant: "default",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/lens",
            value: "finance",
          },
        },
      },
      children: [],
    },
    "ops-button": {
      type: "ActionButton",
      props: {
        label: "Ops lens",
        variant: "outline",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/lens",
            value: "ops",
          },
        },
      },
      children: [],
    },
    "finance-grid": {
      type: "Grid",
      props: {
        columns: 3,
        gap: "sm",
      },
      visible: [
        {
          $state: "/lens",
          eq: "finance",
        },
      ],
      children: ["arr-metric", "margin-metric", "forecast-metric"],
    },
    "arr-metric": {
      type: "Metric",
      props: {
        label: "ARR at risk",
        value: "$1.8M",
        helper: "12 renewals need review this week.",
        tone: "warning",
      },
      children: [],
    },
    "margin-metric": {
      type: "Metric",
      props: {
        label: "Gross margin",
        value: "74.2%",
        helper: "Up 1.6 points after the latest pricing update.",
        tone: "success",
      },
      children: [],
    },
    "forecast-metric": {
      type: "Metric",
      props: {
        label: "Forecast confidence",
        value: "High",
        helper: "Pipeline coverage stays above the target ratio.",
      },
      children: [],
    },
    "ops-grid": {
      type: "Grid",
      props: {
        columns: 3,
        gap: "sm",
      },
      visible: [
        {
          $state: "/lens",
          eq: "ops",
        },
      ],
      children: ["sla-metric", "handoff-metric", "backlog-metric"],
    },
    "sla-metric": {
      type: "Metric",
      props: {
        label: "SLA health",
        value: "96%",
        helper: "Coverage recovered after queue routing updates.",
        tone: "success",
      },
      children: [],
    },
    "handoff-metric": {
      type: "Metric",
      props: {
        label: "Cross-team handoffs",
        value: "34",
        helper: "High enough to justify a workflow redesign.",
        tone: "warning",
      },
      children: [],
    },
    "backlog-metric": {
      type: "Metric",
      props: {
        label: "Backlog age",
        value: "2.1 days",
        helper: "Within target after adding triage automation.",
      },
      children: [],
    },
    "executive-note": {
      type: "StatusNotice",
      props: {
        title: "What the interaction proves",
        message: {
          $template:
            "Current view: ${/lens}. The prompt can ask for a different lens, but the renderer still stays inside your approved component catalog.",
        },
      },
      children: [],
    },
  },
};

const intakeAssistantSpec: Spec = {
  root: "intake-root",
  state: {
    intake: {
      team: "Customer success",
      request: "renewal risk dashboard",
    },
    ready: false,
  },
  elements: {
    "intake-root": {
      type: "Section",
      props: {
        eyebrow: "Prompt result",
        title: "AI-assisted intake flow",
        description:
          "This is the support and onboarding story: the assistant returns a real, stateful form instead of a markdown answer.",
        tone: "success",
      },
      children: [
        "intake-copy",
        "intake-form",
        "intake-actions",
        "intake-next-step",
      ],
    },
    "intake-copy": {
      type: "Copy",
      props: {
        content:
          "Use this pattern when an in-app copilot needs to collect a few details, keep the flow on-brand, and then drive the next action from structured state.",
      },
      children: [],
    },
    "intake-form": {
      type: "Stack",
      props: {
        direction: "vertical",
        gap: "md",
      },
      children: ["team-field", "request-field", "live-summary"],
    },
    "team-field": {
      type: "InputField",
      props: {
        label: "Requesting team",
        value: {
          $bindState: "/intake/team",
        },
        placeholder: "Growth, success, finance...",
        helper: "Bound state means the generated UI can stay interactive.",
      },
      children: [],
    },
    "request-field": {
      type: "InputField",
      props: {
        label: "What should the assistant produce?",
        value: {
          $bindState: "/intake/request",
        },
        placeholder: "Describe the dashboard, checklist, or workflow you need.",
        helper: "Multiline input mirrors a real intake or support flow.",
        multiline: true,
      },
      children: [],
    },
    "live-summary": {
      type: "StatusNotice",
      props: {
        title: "Live summary",
        message: {
          $template:
            "If ${/intake/team} asks for ${/intake/request}, json-render can answer with a safe UI instead of raw prose.",
        },
        tone: "accent",
      },
      children: [],
    },
    "intake-actions": {
      type: "Stack",
      props: {
        direction: "horizontal",
        gap: "sm",
        wrap: true,
      },
      children: ["prepare-button", "reset-button"],
    },
    "prepare-button": {
      type: "ActionButton",
      props: {
        label: "Prepare follow-up UI",
        variant: "default",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/ready",
            value: true,
          },
        },
      },
      children: [],
    },
    "reset-button": {
      type: "ActionButton",
      props: {
        label: "Hide next step",
        variant: "outline",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/ready",
            value: false,
          },
        },
      },
      children: [],
    },
    "intake-next-step": {
      type: "StatusNotice",
      visible: [
        {
          $state: "/ready",
        },
      ],
      props: {
        title: "Next step",
        message: {
          $template:
            "Generate a catalog-constrained interface for ${/intake/team} and keep the flow inside your product instead of bouncing the user into a ticket form.",
        },
        tone: "success",
      },
      children: [],
    },
  },
};

const multiChannelSpec: Spec = {
  root: "multichannel-root",
  state: {
    audience: "sales",
  },
  elements: {
    "multichannel-root": {
      type: "Section",
      props: {
        eyebrow: "Prompt result",
        title: "Launch brief for multiple audiences",
        description:
          "Once content is structured, the same approach can serve web UI today and later feed email, PDF, or other renderers.",
        tone: "warning",
      },
      children: [
        "multichannel-copy",
        "audience-buttons",
        "audience-summary",
        "multichannel-metrics",
        "sales-note",
        "support-note",
        "marketing-note",
      ],
    },
    "multichannel-copy": {
      type: "Copy",
      props: {
        content:
          "Reach for json-render when one prompt should produce structured content for several teams. The shape stays predictable, so you can reuse it across channels later.",
      },
      children: [],
    },
    "audience-buttons": {
      type: "Stack",
      props: {
        direction: "horizontal",
        gap: "sm",
        wrap: true,
      },
      children: ["sales-button", "support-button", "marketing-button"],
    },
    "sales-button": {
      type: "ActionButton",
      props: {
        label: "Sales",
        variant: "default",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/audience",
            value: "sales",
          },
        },
      },
      children: [],
    },
    "support-button": {
      type: "ActionButton",
      props: {
        label: "Support",
        variant: "outline",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/audience",
            value: "support",
          },
        },
      },
      children: [],
    },
    "marketing-button": {
      type: "ActionButton",
      props: {
        label: "Marketing",
        variant: "secondary",
      },
      on: {
        press: {
          action: "setState",
          params: {
            statePath: "/audience",
            value: "marketing",
          },
        },
      },
      children: [],
    },
    "audience-summary": {
      type: "StatusNotice",
      props: {
        title: "Audience currently selected",
        message: {
          $template:
            "Current audience: ${/audience}. The prompt changes, but the JSON stays structured enough to reuse for other renderers later.",
        },
        tone: "accent",
      },
      children: [],
    },
    "multichannel-metrics": {
      type: "Grid",
      props: {
        columns: 3,
        gap: "sm",
      },
      children: ["catalog-count", "audience-count", "output-count"],
    },
    "catalog-count": {
      type: "Metric",
      props: {
        label: "Catalogs to maintain",
        value: "1",
        helper: "One component contract keeps every generated layout aligned.",
      },
      children: [],
    },
    "audience-count": {
      type: "Metric",
      props: {
        label: "Audience views",
        value: "3",
        helper: "Swap the narrative angle without rebuilding the UI stack.",
        tone: "accent",
      },
      children: [],
    },
    "output-count": {
      type: "Metric",
      props: {
        label: "Future outputs",
        value: "Web, email, PDF",
        helper: "Structured specs travel better than ad-hoc markdown.",
        tone: "success",
      },
      children: [],
    },
    "sales-note": {
      type: "StatusNotice",
      visible: [
        {
          $state: "/audience",
          eq: "sales",
        },
      ],
      props: {
        title: "Sales angle",
        message:
          "Ask AI for a pricing comparison, objection-handling card, or expansion prompt that still uses your approved content blocks.",
        tone: "warning",
      },
      children: [],
    },
    "support-note": {
      type: "StatusNotice",
      visible: [
        {
          $state: "/audience",
          eq: "support",
        },
      ],
      props: {
        title: "Support angle",
        message:
          "Use the same spec pattern to generate rollout FAQs, incident summaries, or guided troubleshooting flows.",
        tone: "success",
      },
      children: [],
    },
    "marketing-note": {
      type: "StatusNotice",
      visible: [
        {
          $state: "/audience",
          eq: "marketing",
        },
      ],
      props: {
        title: "Marketing angle",
        message:
          "Turn launch prompts into consistent hero sections, proof blocks, and CTA stacks without hand-authoring every variation.",
        tone: "accent",
      },
      children: [],
    },
  },
};

export const demoPresets: DemoPreset[] = [
  {
    id: "dashboard",
    name: "Executive dashboard",
    prompt:
      "Create an executive pulse board with a finance view and an operations view for the same leadership team.",
    useCase:
      "Best for internal copilots, BI assistants, and fast-changing dashboards that still need to look native to your product.",
    whyItWorks:
      "The catalog fixes the allowed layout blocks, so AI can vary the composition without inventing unsafe components.",
    proofPoints: [
      "Guardrailed component reuse",
      "State-driven variations",
      "No freeform JSX generation",
    ],
    spec: executiveDashboardSpec,
  },
  {
    id: "intake",
    name: "Support intake",
    prompt:
      "Generate a small assistant flow that collects a team name and the workflow they need, then suggests the next step.",
    useCase:
      "Best for support, onboarding, and ops assistants that should return real UI instead of markdown forms or ticket links.",
    whyItWorks:
      "Bound state and built-in actions make the response interactive while keeping every field inside a schema you control.",
    proofPoints: [
      "Two-way input binding",
      "Built-in state actions",
      "Inline next-step guidance",
    ],
    spec: intakeAssistantSpec,
  },
  {
    id: "multichannel",
    name: "Launch brief",
    prompt:
      "Draft a launch brief that can be framed for sales, support, or marketing without changing the underlying component system.",
    useCase:
      "Best when one prompt should feed several downstream experiences, like web UI now and email or PDF later.",
    whyItWorks:
      "Structured JSON travels better than ad-hoc prose, so the same intent can be reused across teams and renderers.",
    proofPoints: [
      "Reusable structured output",
      "Audience-specific views",
      "Cross-channel potential",
    ],
    spec: multiChannelSpec,
  },
];
