import { llm } from "../llm.js";

export async function integrationAgent(state) {
  const response = await llm.invoke(`
You are a Senior Frontend Architect.

Verify and fix consistency.

HTML:
${state.html}

CSS:
${state.css}

JS:
${state.js}

Tasks:

1. Verify every CSS selector exists in HTML.
2. Verify every JS selector exists in HTML.
3. Fix broken IDs.
4. Fix broken classes.
5. Fix missing elements.
6. Improve code quality.

Return ONLY valid JSON.

{
  "html": "...",
  "css": "...",
  "js": "..."
}
`);

  let result;

  try {
    result = JSON.parse(response.content);
  } catch {
    return {};
  }
  console.log("Integration Agent Result : ", result);

  return {
    html: result.html,
    css: result.css,
    js: result.js,
  };
}