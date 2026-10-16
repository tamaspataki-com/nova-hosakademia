import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import { markUpdateReady, setUpdater } from './app/update.js';
import './styles/global.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(<App />);

// Service worker: check for a new version when the app opens, whenever it returns to the foreground, and hourly.
const updateSW = registerSW({
  onNeedRefresh: markUpdateReady,
  onRegisteredSW(_url, reg) {
    if (!reg) return;
    const check = () => reg.update().catch(() => {});
    setInterval(check, 60 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
  }
});
setUpdater(updateSW);

// Artwork is precached now; drop the runtime PNG cache left behind by earlier builds.
if ('caches' in window) caches.delete('nova-art');
