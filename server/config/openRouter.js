import dotenv from "dotenv"
dotenv.config();
const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY
const model = "deepseek/deepseek-chat"
export const generateResponse = async (prompt) => {
	
	console.log("api is", openRouterApiKey);
	
	const res = await fetch(openRouterUrl, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${openRouterApiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: model,
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
		})
	});
	if (!res.ok) {
    const error = await res.json();
    console.error("OpenRouter error details:", JSON.stringify(error, null, 2));
    throw new Error(`OpenRouter error ${res.status}: ${JSON.stringify(error)}`);
}
	const data = await res.json();
	return data.choices[0].message.content;

}