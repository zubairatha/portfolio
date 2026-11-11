"use client";

import { useRef } from "react";
import { assetPath } from "@/lib/assets";

export default function ResumePreview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const resume = assetPath("/documents/zubair-atha-resume.pdf");

  return (
    <>
      <div className="work-actions">
        <button className="resume-link" onClick={() => dialog.current?.showModal()}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
            <path d="M9 1H2v16h12V6L9 1Z M9 1v5h5 M5 10h6 M5 13h4" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          <span>Résumé</span><span aria-hidden="true">↗</span>
        </button>
      </div>
      <dialog ref={dialog} className="resume-dialog" aria-label="Résumé preview"
        onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <button type="button" className="dialog-close resume-close" onClick={() => dialog.current?.close()} autoFocus aria-label="Close résumé preview"><span aria-hidden="true">✕</span></button>
        <object data={`${resume}#toolbar=1&navpanes=0`} type="application/pdf" className="resume-document" aria-label="Zubair Atha résumé PDF">
          <p className="pdf-fallback">Your browser cannot display this PDF inline. <a href={resume} target="_blank" rel="noopener noreferrer">Open the résumé PDF ↗</a>.</p>
        </object>
      </dialog>
    </>
  );
}
