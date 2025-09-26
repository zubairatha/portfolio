import { ROLES, EDUCATION } from "@/data/experience";

export default function ExperienceTimeline(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Experience</h1>
      <ol className="relative border-l border-neutral-200">
        {ROLES.map((r,i)=>(
          <li key={i} className="ml-6 mb-8">
            <span className="absolute -left-[7px] flex h-3.5 w-3.5 rounded-full bg-neutral-900" />
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <span className="text-neutral-500">· {r.company}</span>
              </div>
              <div className="text-sm text-neutral-500 mt-1">{r.start} — {r.end ?? "Present"}</div>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-neutral-800">{r.bullets.map((b,j)=><li key={j}>{b}</li>)}</ul>
              {r.skills && <div className="mt-3 flex flex-wrap gap-2">{r.skills.map(s=><span key={s} className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-700">{s}</span>)}</div>}
            </div>
          </li>
        ))}
      </ol>
      <h2 className="text-3xl font-semibold tracking-tight mt-12 mb-6">Education</h2>
      <ol className="relative border-l border-neutral-200">
        {EDUCATION.map((e,i)=>(
          <li key={i} className="ml-6 mb-8">
            <span className="absolute -left-[7px] flex h-3.5 w-3.5 rounded-full bg-neutral-900" />
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="text-lg font-semibold">{e.school}</h3>
                <span className="text-neutral-500">· {e.location}</span>
              </div>
              <div className="text-sm text-neutral-500 mt-1">{e.degree}</div>
              <div className="text-sm text-neutral-500">{e.start} — {e.end}</div>
              {e.bullets && e.bullets.length > 0 && (
                <ul className="list-disc pl-5 mt-3 space-y-1 text-neutral-800">
                  {e.bullets.map((b,j)=>(<li key={j}>{b}</li>))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}


