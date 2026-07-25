import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observers = new Map();
    const visibleSections = new Set<string>();

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Find the first visible section that matches our order of IDs
      for (const id of sectionIds) {
        if (visibleSections.has(id)) {
          setActiveSection(id);
          return;
        }
      }
      
      // If we scroll back to top above all sections, clear it
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Triggers when section is roughly in the middle
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}
