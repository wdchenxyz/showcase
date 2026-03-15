"use client";

import * as React from "react";
import {
  ActionProvider,
  Renderer,
  StateProvider,
  useUIStream,
  ValidationProvider,
  VisibilityProvider,
} from "@json-render/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { demoModelId, examplePrompts } from "./catalog";
import { registry } from "./registry";

export function JsonRenderDemo() {
  const [prompt, setPrompt] = React.useState<string>(examplePrompts[0]);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  const { spec, send, error, isStreaming, clear } = useUIStream({
    api: "/api/json-render",
    onError(streamError) {
      console.error(streamError);
    },
  });

  const handlers = React.useMemo(
    () => ({
      show_message: (params: Record<string, unknown>) => {
        const message =
          typeof params.message === "string"
            ? params.message
            : "Action clicked.";

        setActionMessage(message);
      },
    }),
    []
  );

  const hasSpec = Boolean(
    spec?.root && Object.keys(spec?.elements ?? {}).length > 0
  );
  const specJson = React.useMemo(
    () => (hasSpec ? JSON.stringify(spec, null, 2) : null),
    [hasSpec, spec]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    setActionMessage(null);
    void send(trimmedPrompt);
  }

  function handleClear() {
    setActionMessage(null);
    clear();
  }

  return (
    <StateProvider initialState={{}}>
      <VisibilityProvider>
        <ActionProvider handlers={handlers}>
          <ValidationProvider>
            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6 md:p-8">
              <div className="space-y-2">
                <Badge variant="outline">Quick start</Badge>
                <h1 className="text-3xl font-semibold tracking-tight">
                  json-render Demo
                </h1>
                <p className="text-muted-foreground max-w-2xl text-sm leading-6 md:text-base">
                  Prompt a small UI, stream the spec, and preview the result.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold tracking-tight">
                      Prompt
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">
                      Keep it simple: ask for a card, CTA, teaser, or tiny layout.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="json-render-prompt">Describe the UI</FieldLabel>
                          <Textarea
                            id="json-render-prompt"
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            className="min-h-32"
                            placeholder="Create a compact pricing teaser with one card and a button."
                          />
                          <FieldDescription>
                            Server needs `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`.
                          </FieldDescription>
                        </Field>
                      </FieldGroup>

                      <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((examplePrompt, index) => (
                          <Button
                            key={examplePrompt}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setPrompt(examplePrompt)}
                          >
                            Example {index + 1}
                          </Button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="submit"
                          disabled={isStreaming || prompt.trim().length === 0}
                        >
                          {isStreaming ? "Generating..." : "Generate UI"}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClear}>
                          Clear
                        </Button>
                        <Badge variant="outline">{demoModelId}</Badge>
                      </div>
                    </form>

                    {error ? (
                      <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error.message}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold tracking-tight">
                      Preview
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">
                      Generated from the quick-start style catalog and streamed straight into the renderer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-dashed bg-muted/20 p-4">
                      {hasSpec ? (
                        <Renderer spec={spec} registry={registry} loading={isStreaming} />
                      ) : (
                        <div className="flex min-h-72 items-center justify-center text-center text-sm text-muted-foreground">
                          {isStreaming
                            ? "Generating UI..."
                            : "Your generated UI will appear here."}
                        </div>
                      )}
                    </div>

                    {actionMessage ? (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                        {actionMessage}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              {specJson ? (
                <details className="rounded-xl border bg-card/80">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-medium tracking-tight">
                    View generated spec
                  </summary>
                  <div className="border-t px-4 py-4">
                    <pre className="max-h-[28rem] overflow-auto rounded-lg bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                      <code>{specJson}</code>
                    </pre>
                  </div>
                </details>
              ) : null}
            </div>
          </ValidationProvider>
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}
