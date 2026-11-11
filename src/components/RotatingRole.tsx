const ROLES = ["a Data Scientist", "an AI Engineer", "a Machine Learning Engineer"];

/** CSS-only rotation reserves the longest title's width to prevent layout shifts. */
export default function RotatingRole() {
  return (
    <span className="rotating-role">
      <span className="sr-only">a Data Scientist, AI Engineer, and Machine Learning Engineer</span>
      {ROLES.map((role, index) => (
        <strong key={role} className="rotating-role-title" aria-hidden="true" style={{ animationDelay: `${index * 4}s` }}>{role}</strong>
      ))}
    </span>
  );
}
