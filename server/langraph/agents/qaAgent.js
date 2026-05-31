import { llm } from "../llm.js";

export async function qaAgent(state) {
  const response = await llm.invoke(`
You are a Senior Frontend QA Engineer.

Review this project.

HTML:
${state.html}

CSS:
${state.css}

JS:
${state.js}

Tasks:

1. Find broken selectors
2. Find missing IDs
3. Find accessibility issues
4. Find responsiveness issues
5. Find JavaScript bugs
6. Improve UI quality

Return JSON only:

{
  "issues": [],
  "status": "PASS"
}

Use FAIL if major problems exist.
`);
console.log("QA Agent Response : ", response.content);
  return {
    qaFeedback: response.content,
  };
}