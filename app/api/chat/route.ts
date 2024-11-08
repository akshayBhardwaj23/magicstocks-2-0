import { aiModelName, aiSystemMessage } from "@/constants/constants";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const perplexity = createOpenAI({
    name: "perplexity",
    apiKey: process.env.PPLX_API ?? "",
    baseURL: "https://api.perplexity.ai/",
  });

  const result = await streamText({
    model: perplexity(aiModelName),
    system: aiSystemMessage,
    messages,
    maxTokens: 1000,
    onFinish: ({ text, finishReason, usage }) => {
      console.log(text, finishReason, usage);
    },
  });

  return result.toDataStreamResponse();
}
