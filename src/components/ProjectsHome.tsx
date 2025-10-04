"use client";
import React, { useState } from "react";
import { Github, ExternalLink, X } from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  link: string;
  bullets: string[];
};

// Parse projects from the projects.txt format
const PROJECTS: Project[] = [
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

const TAG_COLORS: string[] = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-sky-100 text-sky-800 border-sky-200",
  "bg-teal-100 text-teal-800 border-teal-200",
];

function colorForTag(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export default function ProjectsHome() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Projects</h1>
          <p className="text-neutral-600">A collection of my work in AI, machine learning, and data science.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer rounded-2xl border border-neutral-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-neutral-300 flex flex-col h-full"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  {project.name}
                </h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <Github size={16} className="text-neutral-600" />
                </a>
              </div>
              
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide border ${colorForTag(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide border bg-neutral-100 text-neutral-600 border-neutral-200">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-2xl mx-4 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-2">
                    {selectedProject.name}
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    {selectedProject.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-neutral-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide border ${colorForTag(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Project Details</h3>
                <ul className="space-y-2">
                  {selectedProject.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-700">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                >
                  <Github size={18} />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
