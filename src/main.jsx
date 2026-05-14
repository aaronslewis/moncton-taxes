import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App.jsx';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import './index.css';

export const createRoot = ViteReactSSG({ routes });
