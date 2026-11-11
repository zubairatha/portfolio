// Concise card presentation; complete original project records remain in projects.ts.
export const PROJECT_HIGHLIGHTS: Record<number, { tags: string[]; summary: string; highlight: string }> = {
  0: {
    tags: ["Python", "FastAPI", "Ollama"],
    summary: "An AI agent that turns multimodal tasks into Apple Calendar events, using deadlines, complexity, and past user data.",
    highlight: "In progress · personalized retrieval",
  },
  1: {
    tags: ["Python", "Langchain", "RAG"],
    summary: "Context-aware email drafts that adapt to a user's writing style, with retrieval from sent emails and generated FAQs.",
    highlight: "75× faster retrieval · 0.2s per email",
  },
  2: {
    tags: ["Python", "Scikit-Learn", "Time Series"],
    summary: "State-level election predictions using historical polling, temporal features, partisan lean, and incumbency.",
    highlight: "136,000+ historical polling samples",
  },
  3: {
    tags: ["Python", "NLTK", "PowerBI"],
    summary: "Restaurant recommendations combining user preferences, word embeddings, weighted similarity, and location.",
    highlight: "45,000+ data points · 10 km radius",
  },
};
