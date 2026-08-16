export const RESULTS_ANCHOR_ID = "resultados";

export function scrollToResults() {
  const el = document.getElementById(RESULTS_ANCHOR_ID);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.focus({ preventScroll: true });
}
