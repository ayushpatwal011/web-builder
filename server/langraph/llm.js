import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  model: "meta/llama-4-maverick-17b-128e-instruct",

  temperature: 0.7,

  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY,
  },
});