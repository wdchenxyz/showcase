"use client";

import { defineRegistry } from "@json-render/react";

import { Button as UIButton } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { jsonRenderCatalog } from "./catalog";

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

export const { registry } = defineRegistry(jsonRenderCatalog, {
  components: {
    Stack: ({ props, children }) => {
      const direction = props.direction ?? "vertical";
      const gap = props.gap ?? "md";

      return (
        <div
          className={cn(
            "flex w-full",
            gapClasses[gap],
            direction === "horizontal"
              ? "flex-row flex-wrap items-start"
              : "flex-col items-stretch"
          )}
        >
          {children}
        </div>
      );
    },
    Card: ({ props, children }) => {
      return (
        <UICard className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">
              {props.title}
            </CardTitle>
            {props.description ? (
              <CardDescription className="text-sm leading-6">
                {props.description}
              </CardDescription>
            ) : null}
          </CardHeader>
          {children ? <CardContent className="space-y-3">{children}</CardContent> : null}
        </UICard>
      );
    },
    Text: ({ props }) => {
      return <p className="text-sm leading-6 text-foreground/80">{props.content}</p>;
    },
    Button: ({ props, emit }) => {
      return (
        <UIButton
          type="button"
          size="sm"
          variant={props.variant ?? "default"}
          onClick={() => emit("press")}
        >
          {props.label}
        </UIButton>
      );
    },
  },
  actions: {
    show_message: async () => {},
  },
});
