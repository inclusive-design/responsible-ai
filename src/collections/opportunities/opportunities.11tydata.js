import { __, generatePermalink } from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/opportunity',
	eleventyComputed: {
		translationKey: (data) => data.index,
		eleventyNavigation(data) {
			return {
				key: data.index,
				title: data.title,
				parent: 'opportunities',
			};
		},
		permalink(data) {
			data.slug = data.index.toLowerCase();
			return generatePermalink(data, 'opportunities', __('opportunities-slug', {}, data));
		},
	},
};
