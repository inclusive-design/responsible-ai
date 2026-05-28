import { defineConfig } from 'eslint/config';
import eslintConfigInclusiveDesign from '@inclusive-design/eslint-config';

export default defineConfig([
	{
		extends: [eslintConfigInclusiveDesign],
		rules: {
			camelcase: ['error', { properties: 'never' }],
			'require-unicode-regexp': ['error', { requireFlag: 'u' }],
		},
	},
	{
		ignores: ['_site/**', 'README.md'],
	},
]);
