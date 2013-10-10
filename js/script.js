$(document).ready(function() {
	// Use something like modernizr to check
	// if placeholder is supported natively
	// before running this
	$('input[placeholder]').nosInputPlaceholder();

	$('img').nosResponsiveImages();

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
	$('.scroll').nosScrollbar();

	// Use something like modernizr to check
	// if input[type="range"] is supported natively
	// before running this
	$('.input-range').nosInputRange();
	// $('input[type="range"]') doesn't return the correct element in IE7 
	// so a class was given to the element to target it.

}); // document.ready()