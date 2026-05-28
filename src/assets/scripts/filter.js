/* eslint-disable import-x/no-unassigned-import */
import './filter-container.js';

const filters = document.querySelector('#filters');
const filterOptions = filters.querySelectorAll('input[type=\'checkbox\']');
for (const checkbox of filterOptions) {
	checkbox.addEventListener('click', () => {
		renderFilterTags(filters);
	});
}

globalThis.setTimeout(() => {
	renderFilterTags();
}, 0);

document.addEventListener('click', (event) => {
	if (event.target.closest('#filter-tags button')) {
		const button = event.target.closest('#filter-tags button');
		const checkbox = filters.querySelector(`#${button.dataset.id}`);
		checkbox.click();
	}
});

const renderFilterTags = () => {
	const filterTags = document.querySelector('#filter-tags');
	filterTags.innerHTML = '';
	const checkedFilterOptions = filters.querySelectorAll('input:checked');
	if (checkedFilterOptions.length > 0) {
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'block';
		for (const option of checkedFilterOptions) {
			const checkboxLabel = filters.querySelector(`[for='${option.id}']`);
			const template = document.querySelector('#clear-button');
			const clone = document.importNode(template.content, true);
			const button = clone.querySelector('button');
			button.dataset.id = option.id;
			const label = clone.querySelector('.label');
			label.innerHTML = checkboxLabel.innerHTML;
			filterTags.append(clone);
		}
	} else {
		const filterApplied = document.querySelector('#filter-applied');
		filterApplied.style.display = 'none';
	}
};
