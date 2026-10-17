import { Icon } from './ui.jsx';
import { OFFLINE_UNAVAILABLE_TEXT, useOfflineStatus } from './offline.js';

// "Available offline" is shown only once the adventure's files are verified in the device's caches.
export default function OfflineNote({ adv }) {
  const state = useOfflineStatus(adv);
  if (state === 'ready')
    return (
      <div className="note good" role="status">
        <Icon name="cloud_done" /> <span>Offline is elérhető.</span>
      </div>
    );
  if (state === 'preparing')
    return (
      <p className="muted" role="status">
        <Icon name="cloud_sync" /> Letöltés offline használatra… Addig internetkapcsolat kell a felvételekhez.
      </p>
    );
  if (state === 'unavailable')
    return (
      <div className="note soft" role="alert">
        <Icon name="cloud_off" /> <span>{OFFLINE_UNAVAILABLE_TEXT}</span>
      </div>
    );
  return null; // checking, unsupported, or an adventure without recordings: no offline claim
}
