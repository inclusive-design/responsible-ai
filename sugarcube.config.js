import { defineConfig } from '@sugarcube-sh/vite';

export default defineConfig({
	utilities: {
		classes: {
			'margin-inline': {
				source: 'space.*',
				prefix: 'margin-x',
			},
		},
	},
	resolver: 'src/assets/styles/design-tokens/tokens.resolver.json',
});
