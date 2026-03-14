import type { Metadata } from "next";

import { JsonRenderDemo } from "./JsonRenderDemo";

export const metadata: Metadata = {
  title: "Json Render Demo",
  description: "A small demo page explaining where json-render fits and how it works.",
};

export default function JsonRenderPage() {
  return <JsonRenderDemo />;
}
