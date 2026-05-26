import { env } from 'node:process';
import { IdAttributePlugin, RenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import { VentoPlugin } from 'eleventy-plugin-vento';
import fontAwesomePlugin from '@11ty/font-awesome';
import fluidPlugin, { __ } from 'eleventy-plugin-fluid';
import inclusiveFootnotesPlugin from '@inclusive-design/eleventy-plugin-inclusive-footnotes';
import _ from 'lodash';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import sugarcube from '@sugarcube-sh/vite';
import parseTransform from './src/_transforms/parse-transform.js';
import objectArrayPush from './src/_filters/object-array-push.js';
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
	eleventyConfig.addPlugin(VentoPlugin);
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(inclusiveFootnotesPlugin);
	eleventyConfig.addPlugin(fluidPlugin, {
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

	eleventyConfig.addPlugin(EleventyVitePlugin, {
		viteOptions: {
			plugins: [sugarcube()],
		},
	});
	eleventyConfig.addPassthroughCopy({ 'src/assets/styles': 'assets/styles' });
	eleventyConfig.addPassthroughCopy('src/assets/scripts/app.js');
	eleventyConfig.addPassthroughCopy('src/assets/scripts/main.js');

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

	eleventyConfig.addShortcode('__', (key, values = {}, data) => __(key, values, data));

	eleventyConfig.addTransform('parse', parseTransform);

	eleventyConfig.addPassthroughCopy({ 'public/admin/': '/admin/' });
	eleventyConfig.addPassthroughCopy({ 'public/assets/': '/assets/' });
	eleventyConfig.addPassthroughCopy({ 'public/icons': '/' });

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
