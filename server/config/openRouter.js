import dotenv from "dotenv"
import OpenAI from "openai";
dotenv.config();
// open router
const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY
const model = "deepseek/deepseek-chat"
const nvidiaModel = "nvidia/llama-3.1-nemotron-ultra-253b-v1"

// nvidia 
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

export const generateResponse = async (prompt) => {
	
	// open router
	// const res = await fetch(openRouterUrl, {
	// 	method: "POST",
	// 	headers: {
	// 		"Authorization": `Bearer ${openRouterApiKey}`,
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		model: nvidia_model,
	// 		messages: [{
	// 			role: "system",
	// 			content: "You are a software engineer"
	// 		},
	// 			{
	// 				role: "user",
	// 				content: prompt
	// 			}
	// 		],
	// 		temperature: 0.2
	// 	})
	// });

	// nvidia
	const res = await client.chat.completions.create({
		model: nvidiaModel,
		messages: [{
			role: "system",
			content: "You are a software engineer"
		},
			{
				role: "user",
				content: prompt
			}
		],
		temperature: 0.2
	});	
	

	if (!res.ok) {
    const error = await res.json();
    console.error("OpenRouter error details:", JSON.stringify(error, null, 2));
    throw new Error(`OpenRouter error ${res.status}: ${JSON.stringify(error)}`);
}
	const data = await res.json();
	return data.choices[0].message.content;

}
