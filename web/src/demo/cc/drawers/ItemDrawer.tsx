import type { RegionId } from '../../careContinuityScenario';
import { actorById, baseAlertById, baseCaseById, districtById, regionById } from '../model';
import { ActorDrawer } from './ActorDrawer';
import { AlertDrawer } from './AlertDrawer';
import { CaseDrawer } from './CaseDrawer';
import { DistrictDrawer, RegionDrawer } from './GeoDrawers';

/** Resolves the `item` URL param to the right drawer by its id prefix. Unknown ids render nothing. */
export function ItemDrawer({ item, onClose }: { item: string; onClose: () => void }) {
  if (item.startsWith('rg-') && regionById.has(item as RegionId)) return <RegionDrawer id={item as RegionId} onClose={onClose} />;
  if (item.startsWith('ds-') && districtById.has(item)) return <DistrictDrawer id={item} onClose={onClose} />;
  if (item.startsWith('al-') && baseAlertById.has(item)) return <AlertDrawer id={item} onClose={onClose} />;
  if (item.startsWith('SYN-') && baseCaseById.has(item)) return <CaseDrawer id={item} onClose={onClose} />;
  if (item.startsWith('ac-') && actorById.has(item)) return <ActorDrawer id={item} onClose={onClose} />;
  return null;
}
