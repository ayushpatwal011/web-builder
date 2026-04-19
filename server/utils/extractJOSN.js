export const extractJSON = (text) => {
	if (!text) return ;
	const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').replace(/```/gi, '').trim();
	const firstBrace = cleanedText.indexOf('{');
	const lastBrace = cleanedText.lastIndexOf('}');
	if (firstBrace === -1 || lastBrace === -1) return ;
	const json =  JSON.parse(cleanedText.slice(firstBrace, lastBrace + 1));

	return json;
}