import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsHome from "@/components/ProjectsHome";
import ResumePreview from "@/components/ResumePreview";
import { EDUCATION } from "@/data/experience";
import type { ReactNode } from "react";
function Section({ id, number, title, description, children }: {
    id: string;
    number: string;
    title: string;
    description: string;
    children: ReactNode;
}) { return <details className="work-section" id={id}><summary className="work-section-toggle"><div className="section-toggle-label"><span className="section-num">{number} / {id.toUpperCase()}</span><h2 className="work-h2">{title}</h2><span className="section-description">{description}</span></div></summary><div className="work-fold-body">{children}</div></details>; }
export default function Work() { return <div className="container inner-page"><div className="page-heading"><div className="eyebrow">THE PROFESSIONAL SIDE</div><h1 className="page-title">Work<span className="text-[var(--accent)]">.</span></h1><p className="page-description">The teams I&apos;ve worked with, the problems I&apos;ve spent time on, and a few things I&apos;ve built independently.</p><ResumePreview /></div><Section id="experience" number="01" title="Where I've worked." description="Engineering, machine learning, and research roles."><ExperienceTimeline /></Section><Section id="projects" number="02" title="Things I've built." description="Independent experiments, prototypes, and projects I'm still learning from. Explore a project to read more."><ProjectsHome /></Section><Section id="education" number="03" title="Where I've studied." description="A foundation in data science and computer science."><div className="degree-list">{EDUCATION.map(e => <article className="degree" key={e.school}><div className="work-date">{e.start} — {e.end}</div><div><h3>{e.school}</h3><p>{e.degree}</p><p>{e.location}</p></div></article>)}</div></Section></div>; }
