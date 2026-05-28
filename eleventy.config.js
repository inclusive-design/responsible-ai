import { env } from 'node:process';
import { IdAttributePlugin, RenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import { VentoPlugin } from 'eleventy-plugin-vento';
import fontAwesomePlugin from '@11ty/font-awesome';
import fluidPlugin, { __ } from 'eleventy-plugin-fluid';
import inclusiveFootnotesPlugin from '@inclusive-design/eleventy-plugin-inclusive-footnotes';
import _ from 'lodash';
import parseTransform from './src/_transforms/parse-transform.js';
import findTranslationKeyFilter from './src/_filters/find-translation-key-filter.js';
import markdownFilter from './src/_filters/markdown-filter.js';
import linkFragmentFilter from './src/_filters/link-fragment-filter.js';

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig An instance of Eleventy's UserConfig class.
 * @returns {object} The configuration object.
 */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('now', () => new Date());
	eleventyConfig.addPlugin(fontAwesomePlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(VentoPlugin);
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(inclusiveFootnotesPlugin);
	eleventyConfig.addPlugin(fluidPlugin, {
		uio: false,
		css: { enabled: false },
		js: { enabled: false },
		defaultLanguage: 'en',
		supportedLanguages: {
			en: {
				slug: 'en',
				name: 'English',
			},
			fr: {
				slug: 'fr',
				name: 'Français',
				dir: 'ltr',
				uioSlug: 'fr',
			},
		},
	});

	for (const lang of ['en', 'fr']) {
		eleventyConfig.addCollection(
			lang,
			(collection) => collection
				.getFilteredByGlob(`src/collections/*/${lang}/*.md`),
		);

		eleventyConfig.addCollection(
			`opportunities_${lang}`,
			(collection) => collection
				.getFilteredByGlob(`src/collections/opportunities/${lang}/*.md`)
				.toSorted((a, b) => a.data.index.localeCompare(b.data.index)),
		);

		eleventyConfig.addCollection(
			`risks_${lang}`,
			(collection) => collection
				.getFilteredByGlob(`src/collections/risks/${lang}/*.md`)
				.toSorted((a, b) => a.data.index.localeCompare(b.data.index)),
		);
		eleventyConfig.addCollection(
			`pages_${lang}`,
			(collection) => collection
				.getFilteredByGlob(`src/collections/pages/${lang}/*.md`),
		);
	}

	eleventyConfig.addFilter('findTranslationKey', findTranslationKeyFilter);
	eleventyConfig.addFilter('markdown', markdownFilter);
	eleventyConfig.addFilter('linkFragment', linkFragmentFilter);

	eleventyConfig.addShortcode('__', (key, values = {}, data) => __(key, values, data));

	eleventyConfig.addTransform('parse', parseTransform);

	eleventyConfig.addPassthroughCopy({ 'src/admin/config.yml': 'admin/config.yml' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/scripts': 'assets/scripts' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/styles': 'assets/styles' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/uploads': 'assets/uploads' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/icons': '/' });

	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPreprocessor('drafts', '*', (data, _content) => {
		if (data.draft && env.ELEVENTY_RUN_MODE === 'build') {
			return false;
		}
	});

	return {
		dir: {
			input: 'src',
		},
		templateFormats: ['vto', 'md', 'css', 'png', 'jpg', 'svg'],
		htmlTemplateEngine: 'vto',
		markdownTemplateEngine: 'vto',
	};
}
