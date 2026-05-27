import { defineConfig } from '@sugarcube-sh/cli';

export default defineConfig({
	resolver: 'src/design-tokens/tokens.resolver.json',
	variables: {
		path: '_site/assets/styles/variables.gen.css',
	},
	utilities: {
		path: '_site/assets/styles/utilities.gen.css',
	},
	components: 'src/assets/styles/components/ui',
	cube: 'src/assets/styles',
});
