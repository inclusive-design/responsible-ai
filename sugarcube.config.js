import { defineConfig } from '@sugarcube-sh/cli';

export default defineConfig({
	resolver: 'src/design-tokens/tokens.resolver.json',
	components: 'src/assets/styles/components/ui',
	cube: 'src/assets/styles',
});
