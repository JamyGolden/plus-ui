$(document).ready(function() {
	// Use something like modernizr to check
	// if placeholder is supported natively
	// before running this
	$('input[type="placeholder"]').nosInputPlaceholder();

	// Form Select
	$('.js-select').nosFormSelect();

	// Form select with defaultDropdown
	$('.js-select-alt').nosFormSelect({
		defaultDropdown: true,
		namespace: 'nosui-form-select-alt'
	});

	// Input Checkbox
	$('input[type="checkbox"]').nosInputCheckbox();

	// Input Radio
	$('input[type="radio"]').nosInputRadio();

	// Input file
	$('input[type="file"]').nosInputFile();

}); // document.ready()