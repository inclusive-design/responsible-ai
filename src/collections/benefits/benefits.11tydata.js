import { __, generatePermalink } from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/benefit',
	eleventyComputed: {
		translationKey: (data) => data.index,
		eleventyNavigation(data) {
			return {
				key: data.index,
				title: data.title,
				parent: 'benefits',
			};
		},
		permalink(data) {
			data.slug = data.index.toLowerCase();
			return generatePermalink(data, 'benefits', __('benefits-slug', {}, data));
		},
	},
};
