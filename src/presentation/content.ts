export const slides = [
  { id: "hello", title: "ObjectTalk: English practice, played together" },
  { id: "team", title: "The ObjectTalk team" },
  { id: "why", title: "Why we built ObjectTalk" },
  { id: "people", title: "Who we are building for" },
  { id: "difference", title: "Our advantages and product comparison" },
  { id: "content", title: "What players can do" },
  { id: "demo", title: "Product demo" },
  { id: "harness", title: "Technology and core engineering" },
  { id: "business", title: "Pilot plan and business model" },
  { id: "future", title: "Thank you." },
] as const;

export function slideFromHash(hash: string) {
  const value = Number(hash.replace(/^#/, ''));
  return Number.isInteger(value) && value >= 1 && value <= slides.length ? value - 1 : 0;
}
