export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="prose prose-neutral text-justify">
        <h1>About</h1>
        <p>
          Hi! I'm <strong>Zubair Atha</strong>, an MS Data Science student at Columbia University with a background in
          Computer Science and Engineering. I've built and deployed end-to-end ML solutions across automotive,
          healthcare, security, and engineering services spanning real-time computer vision pipelines, large-language
          models and foundational ML models on cloud platforms.
        </p>
        <p>
          Lately, I've been diving into AI agent architecture and high-performance model inference: designing
          multi-agent frameworks, quantizing models, and orchestrating distributed inference services. I'm passionate
          about pushing efficiency at scale and am eager to collaborate on building fast, robust AI systems in
          production.
        </p>
      </div>
      
      <div className="mt-8 flex justify-center">
        <a
          href="https://drive.google.com/file/d/1aiDXhnJCaFSA8-7Vm_CaUliN6clXI5L_/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-xl text-neutral-900 font-medium hover:bg-blue-500/15 hover:-translate-y-1 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resume
        </a>
      </div>
    </div>
  );
}


