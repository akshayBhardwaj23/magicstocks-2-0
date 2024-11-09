import { createOpenAI } from "@ai-sdk/openai";

export const perplexity = createOpenAI({
  name: "perplexity",
  apiKey: process.env.PPLX_API ?? "",
  baseURL: "https://api.perplexity.ai/",
});
