/**
 * @param {string} value - The input string to use for a fragment link.
 * @returns {string} - The encoded fragment link.
 */
export default function linkFragmentFilter(value) {
	const words = value.split(' ');
	const start = words.slice(0, 4).join(' ');
	const end = words.slice(-4).join(' ');
	return `#:~:text=${encodeURIComponent(start).replace('-', '%2D')},${encodeURIComponent(end).replace('-', '%2D')}`;
}
