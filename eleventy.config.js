import { env } from 'node:process';
import { IdAttributePlugin, RenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import fontAwesomePlugin from '@11ty/font-awesome';
import fluidPlugin, { __ } from 'eleventy-plugin-fluid';
import inclusiveFootnotesPlugin from '@inclusive-design/eleventy-plugin-inclusive-footnotes';
import _ from 'lodash';
import parseTransform from './src/_transforms/parse-transform.js';
import objectArrayPush from './src/assets/scripts/object-array-push.js';
import findTranslationKeyFilter from './src/_filters/find-translation-key-filter.js';
import markdownFilter from './src/_filters/markdown-filter.js';

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig An instance of Eleventy's UserConfig class.
 * @returns {object} The configuration object.
 */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('now', () => new Date());
	eleventyConfig.addPlugin(fontAwesomePlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(inclusiveFootnotesPlugin);
	eleventyConfig.addPlugin(fluidPlugin, {
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
		eleventyConfig.addCollection(`sectors_${lang}`, (collection) => collection.getFilteredByGlob(`src/collections/sectors/${lang}/*.md`).toSorted((a, b) => a.data.title - b.data.title));

		eleventyConfig.addCollection(
			`risks_${lang}`,
			(collection) => collection
				.getFilteredByGlob(`src/collections/risks/${lang}/*.md`)
				.toSorted((a, b) => a.data.title.localeCompare(b.data.title)),
		);
		eleventyConfig.addCollection(`pages_${lang}`, (collection) => collection.getFilteredByGlob(`src/collections/pages/${lang}/*.md`));
	}

	eleventyConfig.addFilter('objectArrayPush', objectArrayPush);
	eleventyConfig.addFilter('findTranslationKey', findTranslationKeyFilter);
	eleventyConfig.addFilter('markdown', markdownFilter);

	/*
	  Provide a custom duplicate of eleventy-plugin-fluid's uioInit shortcode in
    order to run it without the text-size preference.
  */
	eleventyConfig.addShortcode('uioCustomInit', (locale, direction) => {
		const options = {
			preferences: ['fluid.prefs.lineSpace', 'fluid.prefs.textFont', 'fluid.prefs.contrast', 'fluid.prefs.enhanceInputs'],
			auxiliarySchema: {
				terms: {
					templatePrefix: '/lib/infusion/src/framework/preferences/html',
					messagePrefix: '/lib/infusion/src/framework/preferences/messages',
				},
			},
			prefsEditorLoader: {
				lazyLoad: true,
			},
			locale,
			direction,
		};

		return `<script>fluid.uiOptions.multilingual(".flc-prefsEditor-separatedPanel", ${JSON.stringify(options)});</script>`;
	});

	eleventyConfig.addTransform('parse', parseTransform);

	eleventyConfig.addPassthroughCopy({
		'src/admin/config.yml': 'admin/config.yml',
	});

	eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'assets/fonts' });
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
		templateFormats: ['njk', 'md', 'css', 'png', 'jpg', 'svg'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
}
