export type Role = { company:string; title:string; start:string; end?:string; bullets:string[]; skills?:string[]; };
export const ROLES: Role[] = [
  {
    company: "Ford Motor Company",
    title: "Data Science Intern",
    start: "May 2025",
    end: "Aug 2025",
    bullets: [
      "Built and deployed an AI-powered ECU log analytics platform on GCP using Docker and Gemini 2.5 Flash & Pro models, enabling natural language driven code generation for regex-based log analysis reducing workflow time by ~90%.",
      "Optimized inference performance through prompt tuning, caching, and parallelized log processing cutting average query processing time from 10s to under 0.1s per log file.",
      "Implemented a multi-agentic system using Hybrid Search (semantic, metadata, keyword) & RAG with Langgraph & Qdrant to enhance log retrieval and analysis, validated via rule-based checks and LLM-as-a-judge achieving ~85% accuracy.",
      "Applied for a patent for the system’s architecture, covering code generation, hybrid search, and real-time ECU log analysis.",
    ],
    skills: ["Python", "GCP", "Docker", "LangGraph", "Qdrant", "Streamlit"],
  },
  {
    company: "Columbia University Irving Medical Center",
    title: "Graduate Researcher",
    start: "Jan 2025",
    end: "May 2025",
    bullets: [
      "Used pose estimation, dimensionality reduction (CEBRA), and unsupervised learning (KMeans, HDBSCAN) to decode behavioral signifiers in mice, identifying 16 stable clusters linking decision-making to brain state covering 80% of frames.",
    ],
    skills: ["Python", "Scikit-learn", "Unsupervised Learning"],
  },
  {
    company: "56 Secure",
    title: "Machine Learning Engineer Intern",
    start: "Feb 2024",
    end: "May 2024",
    bullets: [
      "Led improvement of the YOLOv5s intrusion detection model training on over 500k images, resolving 30+ on-ground bugs and increasing performance over the previous version, aiding in deployment (ML on hardware) across 500+ AI security cameras.",
      "Developed a Slack bot for metrics generation and automated new image data preparation pipeline for training readiness using Python, SQL, AWS S3, and Spark, boosting data science team productivity by 200% weekly.",
      "Collaborated with the product team to build custom evaluation scripts using YOLOv8 by analyzing 150+ customer incidents to refine product strategy and boost customer satisfaction.",
    ],
    skills: ["Python", "SQL", "PyTorch", "AWS", "Spark", "Linux"],
  },
  {
    company: "Vellore Institute of Technology",
    title: "Undergraduate Researcher",
    start: "Jan 2023",
    end: "Oct 2023",
    bullets: [
      "Co-authored an IEEE Access Journal paper 'SSBTCNet,' a semi-supervised brain tumor classification model using autoencoder features and fuzzy logic, surpassing leading image classification networks in accuracy, precision, and efficiency.",
    ],
    skills: ["Python", "TensorFlow", "OpenCV"],
  },
  {
    company: "Cyient",
    title: "Data Scientist Intern",
    start: "Jun 2022",
    end: "Jul 2022",
    bullets: [
      "Structured and optimized ML models using Tesseract OCR, LabelImg, and YOLOv4 in PyTorch to extract geospatial data and detect engineering symbols from PDFs, cutting computation time by 80% and integrating cross-functional feedback.",
    ],
    skills: ["Python", "PyTorch", "OpenCV"],
  },
];

export type Education = { school:string; location:string; degree:string; start:string; end:string; bullets?: string[] };
export const EDUCATION: Education[] = [
  { school: "Columbia University", location: "New York, US", degree: "MS in Data Science", start: "Aug 2024", end: "Dec 2025", bullets: [
    "TA @ Columbia QMSS [Fall 2025] — Practicum in Data Analysis",
    "TA @ Columbia Business School [Spring 2025] — Introduction to Databases for Business Analytics, Python for MBAs",
    "Data Science Institute Scholar [Spring 2025]",
  ] },
  { school: "Vellore Institute of Technology", location: "Vellore, IN", degree: "BTech Computer Science and Engineering", start: "Sep 2020", end: "Jun 2024", bullets: [
    "Raman Research Award Recipient [Fall 2023]",
  ] },
];


