import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { chatCompletion } from "~/utils/exampleFn";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: z.object({
    accountId: z.string().optional(),
  }),
});

function RouteComponent() {
  const [text, setText] = useState("");

  const chatCompletionFn = useServerFn(chatCompletion);

  async function stremStuff() {
    const response = await chatCompletionFn({
      data: {
        text: "Hello, how are you?",
      },
    });
    const reader = response.body?.getReader();

    if (!reader) {
      return;
    }
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      if (value) {
        setText((prev) => prev + new TextDecoder().decode(value));
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={stremStuff}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Stream
      </button>
      <p>{text}</p>
    </div>
  );
}
