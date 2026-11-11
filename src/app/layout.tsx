import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export const metadata: Metadata = {
    title: "Zubair Atha",
    description: "Projects, writing, and notes on AI",
    icons: {
        icon: "/icon.jpeg",
        shortcut: "/icon.jpeg",
        apple: "/icon.jpeg",
    },
};
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (<html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>);
}
