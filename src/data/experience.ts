export type Role = { company:string; title:string; start:string; end?:string; bullets:string[]; skills?:string[]; };
export const ROLES: Role[] = [
  { company:"YourCo", title:"Senior ML Engineer", start:"2024-07", end:"Present",
    bullets:["Built agentic eval harness processing 100k+ episodes/month.","Productionized long-context retrieval (100k tokens) with 30% lower cost."],
    skills:["Python","TypeScript","LLMs","Agents","AWS"] },
  { company:"OtherCo", title:"Data Scientist", start:"2022-01", end:"2024-06",
    bullets:["Led ranking model refresh; +7% CTR.","Introduced feature store to reduce training/serving skew."],
    skills:["PyTorch","Airflow","Spark"] }
];

export type Education = { school:string; location:string; degree:string; start:string; end:string };
export const EDUCATION: Education[] = [
  { school: "Columbia University", location: "New York, US", degree: "MS in Data Science", start: "Aug 2024", end: "Dec 2025" },
  { school: "Vellore Institute of Technology", location: "Vellore, IN", degree: "BTech Computer Science and Engineering", start: "Sep 2020", end: "Jun 2024" },
];


