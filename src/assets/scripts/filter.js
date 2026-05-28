/* eslint-disable import-x/no-unassigned-import */
import './filter-container.js';

window.addEventListener('load', () => {
	renderFilterTags();
});

const filters = document.querySelector('#filters');
const filterOptions = filters.querySelectorAll('input[type=\'checkbox\']');
for (const checkbox of filterOptions) {
	checkbox.addEventListener('click', () => {
		renderFilterTags(filters);
	});
}

const renderFilterTags = () => {
	const filterTags = document.querySelector('#filter-tags');
	filterTags.innerHTML = '';
	const checkedFilterOptions = filters.querySelectorAll('input[type=\'checkbox\']:checked');
	if (checkedFilterOptions.length > 0) {
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'block';
		for (const option of checkedFilterOptions) {
			const checkbox = filters.querySelector(`[for='${option.id}']`);
			const template = document.querySelector('#clear-button');
			const clone = document.importNode(template.content, true);
			clone.addEventListener('click', () => {
				checkbox.click();
			});
			const label = clone.querySelector('.label');
			label.innerHTML = checkbox.innerHTML;
			filterTags.append(clone);
		}
	} else {
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'none';
	}
};
