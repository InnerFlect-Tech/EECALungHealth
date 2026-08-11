export function scrollToElement(id: string, smooth = false): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
  return true;
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

export function scrollForRoute(_pathname: string, hash: string): void {
  if (hash) {
    if (scrollToElement(hash.slice(1))) return;
  }

  scrollToTop();
}
