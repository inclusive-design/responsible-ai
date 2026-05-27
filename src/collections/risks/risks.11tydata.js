import { __, generatePermalink } from 'eleventy-plugin-fluid';

export default {
	layout: 'layouts/risk',
	eleventyComputed: {
		translationKey: (data) => data.index,
		eleventyNavigation(data) {
			return {
				key: data.index,
				title: data.title,
				parent: 'risks',
			};
		},
		permalink(data) {
			data.slug = data.index.toLowerCase();
			return generatePermalink(data, 'risks', __('risks-slug', {}, data));
		},
	},
};
