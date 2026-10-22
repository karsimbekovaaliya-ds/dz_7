import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // SWC, без Babel

// В GitHub Actions VITE_BASE = /<имя-репозитория>/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
});
