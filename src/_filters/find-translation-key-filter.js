/**
 * @param {string} translationKey - The current page's translationKey.
 * @param {string} desiredLang - The language of the translated page.
 * @returns {string|false} The URL of the treanslated page, or false if no translation is found.
 */
export default function findTranslationKeyFilter(translationKey, desiredLang) {
	let translationUrl = false;

	for (const element of this.data.collections.all) {
		if (element.data.translationKey === translationKey && element.data.lang === desiredLang) {
			translationUrl = element.url;
		}
	}

	return translationUrl;
}
