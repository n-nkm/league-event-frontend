import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@stomp/stompjs': path.resolve('./node_modules/@stomp/stompjs/bundles/stomp.umd.min.js')
		}
	}
});
