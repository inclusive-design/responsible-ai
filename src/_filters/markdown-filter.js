import MarkdownIt from 'markdown-it';
import { __ } from 'eleventy-plugin-fluid';
import translations from '../_data/translations.json'	with { type: 'json' };

/**
 * @param {string} value - The input string to render into HTML.
 * @returns {string} - Rendered HTML.
 */
export default function markdownFilter(value) {
	const { lang } = this.page;

	/**
	 * Automatically link risk index references to markdown links to the specified risk.
	 * @param {string} match - The complete matched substring from the regular expression.
	 * @returns {string} A markdown link in the format `[text](../text)` with lowercased path.
	 */
	function riskIndexToMarkdownLink(match) {
		let base;

		if (match[0] === 'O') {
			base = `/${translations[lang]['opportunities-slug']}`;
		}

		if (match[0] === 'R') {
			base = `/${translations[lang]['risks-slug']}`;
		}

		return `[${match}](${base}/${match.toLowerCase()}/)`;
	}

	const output = value.replaceAll(/[RO]\d+/gu, riskIndexToMarkdownLink);

	const md = new MarkdownIt();
	return md.render(output);
}
