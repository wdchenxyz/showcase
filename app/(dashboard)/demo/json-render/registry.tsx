"use client";

import { defineRegistry, useBoundProp } from "@json-render/react";

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
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { jsonRenderCatalog } from "./catalog";

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

const surfaceToneClasses = {
  neutral: "border-border/70 bg-card/95",
  accent: "border-primary/20 bg-primary/5",
  success: "border-emerald-500/25 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
} as const;

const badgeToneClasses = {
  neutral: "border-border/70 bg-background/80 text-foreground",
  accent: "border-primary/20 bg-primary/10 text-primary",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
} as const;

function getGridColumns(columns: number | undefined) {
  switch (columns) {
    case 3:
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    default:
      return "grid-cols-1";
  }
}

export const { registry } = defineRegistry(jsonRenderCatalog, {
  components: {
    Section: ({ props, children }) => {
      const tone = props.tone ?? "neutral";

      return (
        <Card className={cn("shadow-sm", surfaceToneClasses[tone])}>
          <CardHeader className="space-y-3">
            {props.eyebrow ? (
              <Badge
                variant="outline"
                className={cn("w-fit", badgeToneClasses[tone])}
              >
                {props.eyebrow}
              </Badge>
            ) : null}
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold tracking-tight">
                {props.title}
              </CardTitle>
              {props.description ? (
                <CardDescription className="text-sm leading-6">
                  {props.description}
                </CardDescription>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      );
    },
    Stack: ({ props, children }) => {
      const direction = props.direction ?? "vertical";
      const gap = props.gap ?? "md";

      return (
        <div
          className={cn(
            "flex w-full",
            gapClasses[gap],
            direction === "horizontal"
              ? "flex-row items-center"
              : "flex-col items-stretch",
            props.wrap && "flex-wrap"
          )}
        >
          {children}
        </div>
      );
    },
    Grid: ({ props, children }) => {
      const gap = props.gap ?? "md";

      return (
        <div
          className={cn(
            "grid w-full",
            getGridColumns(props.columns),
            gapClasses[gap]
          )}
        >
          {children}
        </div>
      );
    },
    Metric: ({ props }) => {
      const tone = props.tone ?? "neutral";

      return (
        <div
          className={cn(
            "space-y-2 rounded-2xl border p-4 shadow-sm",
            surfaceToneClasses[tone]
          )}
        >
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.16em]">
            {props.label}
          </p>
          <p className="text-2xl font-semibold tracking-tight">{props.value}</p>
          {props.helper ? (
            <p className="text-muted-foreground text-sm leading-6">{props.helper}</p>
          ) : null}
        </div>
      );
    },
    Copy: ({ props }) => {
      return (
        <p
          className={cn(
            "text-sm leading-6",
            props.emphasis === "strong" && "text-foreground font-medium",
            props.emphasis === "muted" && "text-muted-foreground",
            (!props.emphasis || props.emphasis === "default") &&
              "text-foreground/90"
          )}
        >
          {props.content}
        </p>
      );
    },
    ActionButton: ({ props, emit }) => {
      return (
        <Button
          type="button"
          size="sm"
          variant={props.variant ?? "default"}
          onClick={() => emit("press")}
        >
          {props.label}
        </Button>
      );
    },
    InputField: ({ props, bindings }) => {
      const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);

      return (
        <Field>
          <FieldLabel>{props.label}</FieldLabel>
          {props.multiline ? (
            <Textarea
              value={value ?? ""}
              placeholder={props.placeholder ?? ""}
              className="min-h-24 bg-background/80"
              onChange={(event) => setValue(event.target.value)}
            />
          ) : (
            <Input
              value={value ?? ""}
              placeholder={props.placeholder ?? ""}
              className="bg-background/80"
              onChange={(event) => setValue(event.target.value)}
            />
          )}
          {props.helper ? (
            <FieldDescription>{props.helper}</FieldDescription>
          ) : null}
        </Field>
      );
    },
    StatusNotice: ({ props }) => {
      const tone = props.tone ?? "neutral";

      return (
        <div
          className={cn(
            "space-y-2 rounded-2xl border p-4 shadow-sm",
            surfaceToneClasses[tone]
          )}
        >
          <Badge variant="outline" className={badgeToneClasses[tone]}>
            {props.title}
          </Badge>
          <p className="text-sm leading-6 text-foreground/90">{props.message}</p>
        </div>
      );
    },
  },
});
