import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import OpenAI from "openai";
import { appEnv } from "./appEnv";

export const chatCompletion = createServerFn({
  method: "GET",
  response: "raw",
})
  .validator(
    z.object({
      text: z.string(),
    })
  )
  .handler(async (info) => {
    const stream = await openai.chat.completions.create(
      {
        messages: [
          {
            role: "user",
            content: info.data.text,
          },
        ],
        model: "openrouter/quasar-alpha",
        temperature: 0.7,

        stream: true,
        max_completion_tokens: 100,
        top_p: 1,
        n: 1,
        stop: null,
      },
      {}
    );

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.choices[0].delta.content) {
            const text = chunk.choices[0].delta.content;
            controller.enqueue(text);
          }
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });

export const openai = new OpenAI({
  apiKey: appEnv.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
