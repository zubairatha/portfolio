import LightField from "@/components/LightField";
import RotatingRole from "@/components/RotatingRole";

export default function Home() {
  return (
    <div className="container home-wrap">
      <div className="home-text">
        <div className="eyebrow">A LITTLE INTRODUCTION</div>
        <h1 className="home-title">Hey, I&apos;m<br />Zubair<span className="period">.</span></h1>
        <div className="home-intro">
          <p><span className="intro-role-line">I&apos;m <RotatingRole /></span>I build AI/ML systems at <strong>Ford</strong>. I hold a master&apos;s degree in Data Science from <strong>Columbia University</strong>.</p>
          <p>Outside work, I build personal projects, write about AI and search, and photograph the places I visit.</p>
        </div>
      </div>
      <LightField />
    </div>
  );
}
