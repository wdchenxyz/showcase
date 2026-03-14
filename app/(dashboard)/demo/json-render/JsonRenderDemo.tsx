"use client";

import * as React from "react";
import Link from "next/link";
import { JSONUIProvider, Renderer } from "@json-render/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { catalogBlueprint } from "./catalog";
import { demoPresets } from "./presets";
import { registry } from "./registry";

const useCaseCards = [
  {
    title: "Internal copilots",
    detail:
      "Let AI assemble dashboards, summaries, and workflow panels without leaving your design system.",
  },
  {
    title: "Guided forms",
    detail:
      "Return bound inputs, next-step cards, and simple actions instead of markdown instructions.",
  },
  {
    title: "Structured outputs",
    detail:
      "Keep the UI spec predictable so the same content can later feed email, PDF, or other renderers.",
  },
] as const;

const useItWhen = [
  "You want AI to compose UI, but only from approved components and prop schemas.",
  "Teams ask for many dashboard or workflow variations that follow the same design rules.",
  "An assistant should answer with a usable interface instead of static prose.",
];

const skipItWhen = [
  "You are handcrafting one hero page with bespoke animation and no reuse pressure.",
  "A simple markdown response or one fixed template already solves the problem.",
  "The model is expected to invent arbitrary components instead of using guardrails.",
];

export function JsonRenderDemo() {
  const [selectedId, setSelectedId] = React.useState(demoPresets[0]?.id ?? "dashboard");
  const [renderVersion, setRenderVersion] = React.useState(0);

  const selectedPreset = React.useMemo(
    () =>
      demoPresets.find((preset) => preset.id === selectedId) ?? demoPresets[0],
    [selectedId]
  );

  const specJson = React.useMemo(
    () => JSON.stringify(selectedPreset.spec, null, 2),
    [selectedPreset]
  );

  if (!selectedPreset) {
    return null;
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent_40%),radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--color-chart-2)_12%,transparent),transparent_35%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6 md:p-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-sm md:p-8">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative space-y-5">
            <Badge variant="outline" className="bg-background/80">
              Inspired by Vercel Labs json-render
            </Badge>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Json Render
              </h1>
              <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
                Think of it as prompt to JSON spec to trusted UI. You define the
                catalog, the model stays inside those guardrails, and the renderer
                turns the result into real interactive components.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {useCaseCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm"
                >
                  <p className="text-sm font-medium tracking-tight">{card.title}</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link
                  href="https://github.com/vercel-labs/json-render"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source repo
                </Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setRenderVersion((value) => value + 1)}
              >
                Reset current preset
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">
                  Preset prompts
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  This demo uses fixed prompts and specs so you can inspect the
                  runtime pattern without wiring an LLM call.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {demoPresets.map((preset) => {
                    const isActive = preset.id === selectedPreset.id;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(preset.id);
                          setRenderVersion(0);
                        }}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-colors",
                          isActive
                            ? "border-primary/40 bg-primary/5 shadow-sm"
                            : "border-border/70 bg-background/60 hover:bg-accent"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium tracking-tight">
                              {preset.name}
                            </p>
                            <p className="text-muted-foreground mt-2 text-sm leading-6">
                              {preset.prompt}
                            </p>
                          </div>
                          {isActive ? <Badge>Active</Badge> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-medium tracking-tight">Use case</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {selectedPreset.useCase}
                  </p>

                  <p className="mt-4 text-sm font-medium tracking-tight">
                    Why json-render helps here
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {selectedPreset.whyItWorks}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedPreset.proofPoints.map((point) => (
                      <Badge key={point} variant="outline">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">
                  Allowed catalog
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  This is the guardrail. The model can compose only these building
                  blocks, and catalog.prompt() turns them into a machine-readable
                  contract.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {catalogBlueprint.map((component) => (
                  <div
                    key={component.name}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium tracking-tight">
                        {component.name}
                      </p>
                      <Badge variant="outline">{component.props.length} props</Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {component.description}
                    </p>
                    <p className="text-muted-foreground mt-3 text-xs leading-5">
                      {component.props.join(" | ")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">
                  When to use it
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  The win is controlled flexibility: AI gets room to compose UI,
                  but not room to break your product surface.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-medium tracking-tight">Good fit</p>
                  <div className="mt-3 space-y-3">
                    {useItWhen.map((item) => (
                      <p key={item} className="text-muted-foreground text-sm leading-6">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-medium tracking-tight">Probably overkill</p>
                  <div className="mt-3 space-y-3">
                    {skipItWhen.map((item) => (
                      <p key={item} className="text-muted-foreground text-sm leading-6">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">
                  JSON spec
                </CardTitle>
                <CardDescription className="text-sm leading-6">
                  This is the structured output the renderer consumes. It stays
                  predictable because the model is composing schema-backed JSON,
                  not writing JSX.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.16em]">
                    Prompt
                  </p>
                  <p className="mt-2 text-sm leading-6">{selectedPreset.prompt}</p>
                </div>
                <pre className="max-h-[34rem] overflow-auto rounded-2xl border border-border/70 bg-zinc-950 p-4 text-xs leading-6 text-zinc-100 shadow-inner">
                  <code>{specJson}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">
                  Live rendered result
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">@json-render/react</Badge>
                </CardAction>
                <CardDescription className="text-sm leading-6">
                  The same JSON becomes a working interface. Try the buttons and
                  fields to see state changes happen inside the rendered tree.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/80 p-4 md:p-6">
                  <JSONUIProvider
                    key={`${selectedPreset.id}-${renderVersion}`}
                    registry={registry}
                    initialState={selectedPreset.spec.state ?? {}}
                  >
                    <Renderer spec={selectedPreset.spec} registry={registry} />
                  </JSONUIProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
