"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

type PreProps = React.HTMLAttributes<HTMLPreElement> & { children?: any };

export default function MDXPre(props: PreProps) {
  const child = React.Children.toArray(props.children)[0] as any;
  const className: string = child?.props?.className || "";
  const language = (className.match(/language-([a-z0-9+#-]+)/i)?.[1] || "text").toLowerCase();
  const code: string = typeof child?.props?.children === "string" ? child.props.children : String(child?.props?.children || "");
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false), 1200); } catch {}
  };

  return (
    <div className="relative rounded-xl border border-neutral-200 overflow-hidden">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-white/80 backdrop-blur px-1.5 py-1 border border-neutral-200 shadow-sm">
        <span className="text-[11px] uppercase tracking-wide text-neutral-600 px-1">{language}</span>
        <button onClick={onCopy} aria-label="Copy code" className="p-1 rounded-md hover:bg-neutral-100 text-neutral-700">
          {copied ? <Check size={14}/> : <Copy size={14}/>} 
        </button>
      </div>
      <pre className={props.className + " m-0 p-4 bg-neutral-900 text-neutral-100 overflow-auto"}>
        {React.cloneElement(child, { className: child?.props?.className, children: code })}
      </pre>
    </div>
  );
}


