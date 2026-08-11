import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollForRoute } from '../lib/scrollToTarget';

/** Resets scroll on route changes; consultation routes land at the form start. */
export function ScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    scrollForRoute(location.pathname, location.hash);
  }, [location.pathname, location.hash, location.key]);

  return null;
}
