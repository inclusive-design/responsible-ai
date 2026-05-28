import MarkdownIt from 'markdown-it';

/**
 * @param {string} value - The input string to render into HTML.
 * @returns {string} - Rendered HTML.
 */
export default function markdownFilter(value) {
	/**
	 * Automatically link risk index references to markdown links to the specified risk.
	 * @param {string} match - The complete matched substring from the regular expression.
	 * @returns {string} A markdown link in the format `[text](../text)` with lowercased path.
	 */
	function riskIndexToMarkdownLink(match) {
		return `[${match}](../${match.toLowerCase()})`;
	}

	const output = value.replaceAll(/[RO]\d+/gu, riskIndexToMarkdownLink);

	const md = new MarkdownIt();
	return md.render(output);
}
