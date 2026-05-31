import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  prompt: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  plan: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  html: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  css: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  js: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  qaFeedback: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  finalCode: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),
});