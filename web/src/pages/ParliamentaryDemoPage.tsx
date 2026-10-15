import { useEffect } from 'react';
import { PiApp } from '../demo/pi/PiApp';
import '../demo.css';

const CANONICAL = 'https://eecalunghealth.com/demo/parliamentary-intelligence';

/** Full-screen Parliamentary Intelligence demo app (stub data). */
export default function ParliamentaryDemoPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Parliamentary Intelligence demo • EECA Lung Health Hub';
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevHref = link?.getAttribute('href') ?? null;
    const created = !link;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = CANONICAL;
    return () => {
      document.title = prevTitle;
      if (created) link?.remove();
      else if (prevHref !== null) link?.setAttribute('href', prevHref);
    };
  }, []);

  return <PiApp />;
}
