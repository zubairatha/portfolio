export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between text-sm">
        <div className="text-neutral-600">© {new Date().getFullYear()} Zubair Atha</div>
        <div className="text-neutral-600">Made by Zubair Atha</div>
      </div>
    </footer>
  );
}