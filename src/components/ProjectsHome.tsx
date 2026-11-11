"use client";

import { useRef, useState } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import { PROJECT_HIGHLIGHTS } from "@/data/projectHighlights";

export default function ProjectsHome() {
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  function openProject(project: Project) {
    setSelected(project);
    dialog.current?.showModal();
  }

  return (
    <>
      <div className="project-grid">
        {PROJECTS.filter(p => p.id !== 4).map(project => {
          const card = PROJECT_HIGHLIGHTS[project.id];
          return (
            <button key={project.id} className="project-tile" onClick={() => openProject(project)} aria-haspopup="dialog">
              <span className="project-tile-top"><span className="eyebrow">{String(project.id + 1).padStart(2, "0")} / PROJECT</span><span aria-hidden="true">↗</span></span>
              <h3>{project.name}</h3>
              <p>{card.summary}</p>
              <span className="project-highlight">{card.highlight}</span>
              <span className="project-tags">{card.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
            </button>
          );
        })}
      </div>
      <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title"
        onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="project-dialog-head"><span className="eyebrow">PROJECT NOTES</span><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close project details">Close ✕</button></div>
        {selected && <div className="project-dialog-body">
          <h2 id="project-dialog-title">{selected.name}</h2>
          <p>{selected.description}</p>
          <div className="project-tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <ul>{selected.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
          <a className="text-link" href={selected.link} target="_blank" rel="noopener noreferrer">View project repository ↗</a>
        </div>}
      </dialog>
    </>
  );
}
