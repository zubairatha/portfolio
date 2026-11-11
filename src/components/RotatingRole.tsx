"use client";

import { useEffect, useState } from "react";

const ROLES = ["a Data Scientist", "an AI Engineer", "a Machine Learning Engineer"];

export default function RotatingRole() {
  const [text, setText] = useState(ROLES[0]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;

    function start() {
      clearTimeout(timer);
      setText(ROLES[0]);
      if (motion.matches) return;

      let role = 0;
      let length = ROLES[0].length;
      let deleting = true;

      function tick() {
        if (deleting) {
          length--;
          setText(ROLES[role].slice(0, length));
          if (length === 0) {
            role = (role + 1) % ROLES.length;
            deleting = false;
            timer = setTimeout(tick, 250);
          } else {
            timer = setTimeout(tick, 40);
          }
        } else {
          length++;
          setText(ROLES[role].slice(0, length));
          if (length === ROLES[role].length) {
            deleting = true;
            timer = setTimeout(tick, 3200);
          } else {
            timer = setTimeout(tick, 85);
          }
        }
      }

      timer = setTimeout(tick, 3200);
    }

    start();
    motion.addEventListener("change", start);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", start);
    };
  }, []);

  return (
    <span className="rotating-role">
      <span className="sr-only">a Data Scientist, AI Engineer, and Machine Learning Engineer</span>
      <strong aria-hidden="true">{text}<span className="role-caret" /></strong>
    </span>
  );
}
