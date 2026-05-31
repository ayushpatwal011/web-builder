import { llm } from "../llm.js";

export async function htmlAgent(state) {
  const response = await llm.invoke(`
You are a Senior Frontend Engineer.

Website Specification:

${state.plan}

Generate ONLY HTML.


Requirements:

- Semantic HTML5
- SEO Friendly
- Accessible
- Mobile First Structure
- Proper class names
- Proper IDs
- BEM Naming Convention
- Responsive Layout Structure
- Header
- Navigation
- Main Content
- Footer

Rules:

- NO CSS
- NO JavaScript
- NO markdown
- NO explanation

Return valid HTML only.
`);
console.log("HTML Agent Response : ", response.content);
  return {
    html: response.content,
  };
}