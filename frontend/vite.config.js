import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',          // allows external connections
		port: 5173,               // default vite port
		allowedHosts: [
			'all',
			'bd740b630ac4.ngrok-free.app',
			'.ngrok-free.app',
			'.ngrok.io',
			'.localtunnel.me'
		],    // allows all domains and ngrok/localtunnel hosts
		cors: true,
		strictPort: false
	}
});
