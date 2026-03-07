import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { loadEnv, type ConfigEnv, type ViteDevServer } from 'vite';

function manifestPlugin(env: Record<string, string>) {
	const manifest = {
		short_name: '麻雀ログ',
		name: 'オンライン麻雀ログ',
		start_url: env.VITE_BASE_PATH,
		scope: env.VITE_BASE_PATH,
		display: 'standalone',
		icons: [
			{
				src: 'icon.png',
				sizes: '512x512',
			},
		],
	};
	const source = JSON.stringify(manifest, null, '\t');

	return {
		name: 'generate-manifest',
		configureServer(server: ViteDevServer) {
			server.middlewares.use((req, res, next) => {
				if (req.url === `${env.VITE_BASE_PATH}manifest.json`) {
					res.setHeader('Content-Type', 'application/json');
					res.end(source);
					return;
				}
				next();
			});
		},
		generateBundle(this: { emitFile: (file: { type: string; fileName: string; source: string }) => void }) {
			this.emitFile({
				type: 'asset',
				fileName: 'manifest.json',
				source,
			});
		},
	};
}

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		base: env.VITE_BASE_PATH || '/',
		plugins: [react(), tailwindcss(), manifestPlugin(env)],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
};
