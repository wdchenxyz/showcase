import type { Metadata } from "next";

import { JsonRenderDemo } from "./JsonRenderDemo";

export const metadata: Metadata = {
  title: "json-render Demo",
  description: "A simple json-render quick-start style demo that generates UI from a prompt.",
};

export default function JsonRenderPage() {
  return <JsonRenderDemo />;
}
