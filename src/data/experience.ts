export type Role = { company:string; title:string; start:string; end?:string; bullets:string[]; skills?:string[]; };
export const ROLES: Role[] = [
  { company:"YourCo", title:"Senior ML Engineer", start:"2024-07", end:"Present",
    bullets:["Built agentic eval harness processing 100k+ episodes/month.","Productionized long-context retrieval (100k tokens) with 30% lower cost."],
    skills:["Python","TypeScript","LLMs","Agents","AWS"] },
  { company:"OtherCo", title:"Data Scientist", start:"2022-01", end:"2024-06",
    bullets:["Led ranking model refresh; +7% CTR.","Introduced feature store to reduce training/serving skew."],
    skills:["PyTorch","Airflow","Spark"] }
];


