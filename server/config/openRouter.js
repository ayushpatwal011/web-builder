// import dotenv from "dotenv"
// import OpenAI from "openai";
// dotenv.config();

// const nvidiaModel = "nvidia/llama-3.1-nemotron-ultra-253b-v1"

// const client = new OpenAI({
//   baseURL: "https://integrate.api.nvidia.com/v1",
//   apiKey: process.env.NVIDIA_API_KEY,
// });

// export const generateResponse = async (prompt) => {
//   console.log("Using model:", nvidiaModel);

//   const res = await client.chat.completions.create({
//     model: nvidiaModel,
//     messages: [
//       { role: "system", content: "You are a software engineer" },
//       { role: "user", content: prompt }
//     ],
//     temperature: 0.2
//   });

//   console.log("res", res);

//   return res.choices[0].message.content;
// }

import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

export const generateResponse = async (prompt) => {
  const payload = {
    model: "meta/llama-4-maverick-17b-128e-instruct",
    messages: [
      { role: "system", content: "You are a software engineer" },
      { role: "user", content: prompt }
    ],
    max_tokens: 4096,
    temperature: 0.2,
    top_p: 1.00,
    frequency_penalty: 0.00,
    presence_penalty: 0.00,
    stream: false
  };

  const headers = {
    "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,  // ✅ fixed: was hardcoded "$NVIDIA_API_KEY"
    "Accept": "application/json"
  };

  try {
    const response = await axios.post(invokeUrl, payload, {
      headers,
      responseType: "json"
    });

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("NVIDIA API error:", error.response?.status, error.response?.data);
    throw error;
  }
};