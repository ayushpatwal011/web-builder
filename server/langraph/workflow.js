import { StateGraph, END } from "@langchain/langgraph";

import { plannerAgent } from "./agents/plannerAgent.js";
import { htmlAgent } from "./agents/htmlAgent.js";
import { cssAgent } from "./agents/cssAgent.js";
import { jsAgent } from "./agents/jsAgent.js";
import { qaAgent } from "./agents/qaAgent.js";
import { mergeAgent } from "./agents/mergeAgent.js";
import { GraphState } from "./state.js";
import { integrationAgent } from "./agents/integrationAgent.js";
const workflow = new StateGraph(GraphState);

workflow.addNode("planner", plannerAgent);

workflow.addNode("htmlGenerator", htmlAgent);
workflow.addNode("cssGenerator", cssAgent);
workflow.addNode("jsGenerator", jsAgent);

workflow.addNode("integration", integrationAgent);

workflow.addNode("qa", qaAgent);
workflow.addNode("merge", mergeAgent);

workflow.setEntryPoint("planner");

// planner -> html
workflow.addEdge("planner", "htmlGenerator");

// html -> parallel css + js
workflow.addEdge("htmlGenerator", "cssGenerator");
workflow.addEdge("htmlGenerator", "jsGenerator");

// wait for both css and js
workflow.addEdge("cssGenerator", "integration");
workflow.addEdge("jsGenerator", "integration");

// integration -> qa
workflow.addEdge("integration", "qa");

// qa -> merge
workflow.addEdge("qa", "merge");

workflow.addEdge("merge", END);

export const workflowApp = workflow.compile();