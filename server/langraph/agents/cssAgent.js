import { llm } from "../llm.js";

export async function cssAgent(state) {
  const response = await llm.invoke(`
You are a Senior UI Designer.

Specification:

${state.plan}

HTML:

${state.html}

Generate professional production-grade CSS.
Generate CSS that styles ONLY the classes and IDs found in the provided HTML.
Do not invent selectors.
Requirements:

- Mobile First
- Modern SaaS Design
- CSS Variables
- Flexbox
- CSS Grid
- Responsive Design
- Hover Effects
- Smooth Transitions
- Animations
- Dark + Light Friendly
- Professional Typography
- Clean Spacing

Create:

:root {
 --primary:
 --secondary:
 --accent:
 --background:
 --surface:
 --text:
}

Rules:

- No markdown
- No explanation
- Return CSS only
`);
console.log("CSS Agent Response : ", response.content);

  return {
    css: response.content,
  };
}