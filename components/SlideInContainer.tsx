import { useEffect, useRef } from "react";

export default function SlideInContainer({ children, className, ...props }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => {
      if (!ref?.current) return;
      if (ref.current.getBoundingClientRect().top < window.innerHeight) {
        ref.current.classList.add("animate");
      } else {
        ref.current.classList.remove("animate");
      }
    };

    window.addEventListener("scroll", fn);
    fn();

    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className={`slideInContainer ${className || ""}`} ref={ref} {...props}>
      {children}
    </div>
  );
}
