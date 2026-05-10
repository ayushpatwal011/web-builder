

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
    "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
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