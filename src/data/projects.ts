export type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  link: string;
  bullets: string[];
};

// Parse projects from the projects.txt format
export const PROJECTS: Project[] = [
  {
    id: 0,
    name: "CalBridge (WIP)",
    description: "Mutimodal AI that bridges your tasks to your calendar",
    tags: ["Python", "FastAPI", "PyObjC", "Ollama"],
    link: "https://github.com/zubairatha/CalBridge",
    bullets: [
      "Building an AI agent which gets a task (multimodal input) from the user and automatically generates calendar events on Apple Calendar based on Deadline, Task Complexity and Past user data.",
      "Working extensively to build efficient retrieval systems for personalization."
    ]
  },
  {
    id: 1,
    name: "AI Email Automation Agent",
    description: "AI-driven email automation with response generation",
    tags: ["Python", "Large Language Models", "Langchain", "Vector Database", "Generative AI"],
    link: "https://github.com/zubairatha/AI-Email-Automation",
    bullets: [
      "Constructed an AI-driven email automation agent that reads unread emails and generates drafts mimicking user response style.",
      "Created a vector database combining previously sent emails and FAQ (generated using GPT-3.5) databases, enhancing search and retrieval efficiency by 75 times in comparison with conventional databases.",
      "Implemented RAG (Retrieval Augmented Generation) based response generation for unread emails (via IMAP), with automated drafts sent via SMTP. Integrated the system with Gmail and attained an average response time of 0.2 seconds per email."
    ]
  },
  {
    id: 2,
    name: "2024 US Presidential Election Prediction",
    description: "Machine learning models for election outcome prediction",
    tags: ["Python", "Scikit-Learn", "Statsmodels", "Time Series Analysis"],
    link: "https://github.com/zubairatha/US-2024-Presidential-Election-Prediction",
    bullets: [
      "Led development of machine learning models (Linear Regression, Random Forest, XGBoost) to predict the 2024 US Presidential Election outcomes, processing and analyzing 136,000+ historical polling samples.",
      "Engineered critical features including temporal proximity, state partisan lean, and incumbency factors through comprehensive data preprocessing and cleaning of datasets from MIT Election Lab and FiveThirtyEight.",
      "Built and evaluated an end-to-end ML pipeline resulting in accurate state-level predictions, with the Linear Regression model outperforming baseline Bayesian methods in both accuracy and winner prediction."
    ]
  },
  {
    id: 3,
    name: "Uber Eats Restaurant Recommender System",
    description: "Personalized restaurant recommendations with NLP",
    tags: ["Python", "NLTK", "PowerBI"],
    link: "https://github.com/zubairatha/Uber-Eats-Restaurant-Recommender-System",
    bullets: [
      "Implemented a prescriptive model to provide personalized restaurant recommendations based on user preferences and geographical constraints processing 45,000+ data points.",
      "Calculated association and similarity using NLP techniques: word embeddings and weighted cosine similarity measurements.",
      "Enhanced the relevance and precision of restaurant recommendations by deploying a manual weightage mechanism and a 10-kilometer radius filter. Designed an insightful data dashboard employing cleaning and visualizing tools in PowerBI."
    ]
  },
  {
    id: 4,
    name: "E-Commerce Sales Forecasting",
    description: "Time series analysis for sales prediction",
    tags: ["Python", "Scikit-Learn", "Statsmodels", "Time Series Analysis"],
    link: "https://github.com/zubairatha/Sales-Forecasting-TSA",
    bullets: [
      "Performed in-depth Exploratory Data Analysis to identify feature importance and forecasted sales for an E-Commerce store using SARIMA (optimized via grid search) and Facebook's Prophet, improving forecast accuracy from 78% to 86%.",
      "Conducted Anomaly Detection using statistical techniques to pinpoint dates of revenue anomalies to infer customer behavior."
    ]
  }
];

