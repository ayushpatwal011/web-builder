import { llm } from "../llm.js";

export async function plannerAgent(state) {
  const plannerPrompt = `
You are a senior product manager, UI/UX designer, and software architect.

User Request:
${state.prompt}

Create a COMPLETE WEBSITE SPECIFICATION.

Return ONLY markdown.

Include:

# Product Overview

# Target User

# Features

# Layout Structure

Header:
Sidebar:
Main Content:
Footer:

# Components

For each component define:
- purpose
- content
- interactions

# Design System

Primary Color:
Secondary Color:
Background Color:
Text Color:

Typography:
Spacing:
Border Radius:
Shadows:

# Responsive Behavior

Desktop:
Tablet:
Mobile:

# JavaScript Requirements

List every interaction.

Be extremely detailed.

Think like a professional SaaS designer.
`;

  const response = await llm.invoke(plannerPrompt);

  console.log("Planner Agent Response : ", response.content);
  return {
    plan: response.content,
  };
}