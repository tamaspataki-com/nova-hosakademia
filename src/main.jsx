import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(<App />);

// Artwork is precached now; drop the runtime PNG cache left behind by earlier builds.
if ('caches' in window) caches.delete('nova-art');
