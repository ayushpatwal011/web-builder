import { llm } from "../llm.js";

export async function jsAgent(state) {
  const response = await llm.invoke(`
You are a Senior JavaScript Engineer.

Specification:

${state.plan}

HTML:

${state.html}

Create production-ready JavaScript.
Generate JavaScript using ONLY IDs and classes present in the HTML.
Do not invent selectors.
Requirements:

- Vanilla JavaScript
- ES6+
- Event Delegation
- Error Handling
- Accessibility Support
- Mobile Friendly
- DOMContentLoaded
- No Global Variables

Implement:

- Navigation Toggle
- Modal Logic
- Form Validation
- Scroll Animations
- Interactive Components
- Theme Switching if required
- Dynamic UI Interactions

Rules:

- No markdown
- No explanation
- Return JavaScript only
`);
console.log("JS Agent Response : ", response.content);

  return {
    js: response.content,
  };
}