// Concise card presentation; complete original project records remain in projects.ts.
export const PROJECT_HIGHLIGHTS: Record<number, { tags: string[]; summary: string }> = {
  0: {
    tags: ["Python", "FastAPI", "Ollama"],
    summary: "An AI agent that turns multimodal tasks into Apple Calendar events, using deadlines, complexity, and past user data.",
  },
  1: {
    tags: ["Python", "Langchain", "RAG"],
    summary: "Context-aware email drafts that adapt to a user's writing style, with retrieval from sent emails and generated FAQs.",
  },
  2: {
    tags: ["Python", "Scikit-Learn", "Time Series"],
    summary: "State-level election predictions using historical polling, temporal features, partisan lean, and incumbency.",
  },
  3: {
    tags: ["Python", "NLTK", "PowerBI"],
    summary: "Restaurant recommendations combining user preferences, word embeddings, weighted similarity, and location.",
  },
};
