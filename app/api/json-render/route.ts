import { gateway, streamText } from "ai";
import { z } from "zod";

import {
  demoModelId,
  systemPrompt,
} from "@/app/(dashboard)/demo/json-render/catalog";

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(600),
});

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json(
      {
        message:
          "Missing AI Gateway credentials. Add AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN and try again.",
      },
      { status: 503 }
    );
  }

  const requestBody = await request.json().catch(() => null);
  const parsedRequest = requestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return Response.json(
      {
        message: "Please enter a short prompt before generating UI.",
      },
      { status: 400 }
    );
  }

  const result = streamText({
    model: gateway(demoModelId),
    system: systemPrompt,
    prompt: parsedRequest.data.prompt,
    temperature: 0.2,
    onError({ error }) {
      console.error("Failed to stream json-render demo UI", error);
    },
  });

  return result.toTextStreamResponse();
}
