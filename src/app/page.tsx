import Link from "next/link";
import PixelLandscape from "@/components/PixelLandscape";
import RotatingRole from "@/components/RotatingRole";

export default function Home() {
  return (
    <div className="home-page"><div className="container home-wrap">
      <div className="home-text">
        <div className="eyebrow">A LITTLE INTRODUCTION</div>
        <h1 className="home-title">Hey, I&apos;m<br />Zubair<span className="period">.</span></h1>
        <div className="home-intro">
          <p><span className="intro-role-line">I&apos;m <RotatingRole /></span>I build AI/ML systems at <strong>Ford</strong>. I hold a master&apos;s degree in Data Science from <strong>Columbia University</strong>.</p>
          <p>Outside work, I write about computer science, life, and travel, and <Link href="/frames" className="intro-photo-link">photograph</Link> the places I visit.</p>
        </div>
      </div>
    </div><PixelLandscape /></div>
  );
}
