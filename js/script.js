$(document).ready(function() {
	// Use something like modernizr to check
	// if placeholder is supported natively
	// before running this
	$('input[placeholder]').plusInputPlaceholder();

	$('.js-input-number').plusInputNumber();

	$('img').plusResponsiveImages();

	// Form Select
	$('.js-select').plusFormSelect();

	// Form select with defaultDropdown
	$('.js-select-alt').plusFormSelect({
		defaultDropdown: true,
		namespace: 'plusui-form-select-alt'
	});

	// Input Checkbox
	$('.checkbox').plusInputCheckbox();

	// Input Checkbox Switch
	$('.checkbox-switch').plusInputCheckbox({
		namespace: 'plusui-form-switch',
		'switch': true
	});

	// Input Radio
	$('input[type="radio"]').plusInputRadio();

	// Input file
	$('input[type="file"]').plusInputFile();

	// Use something like modernizr to check
	// if input[type="range"] is supported natively
	// before running this
	$('.input-range').plusInputRange();
	// $('input[type="range"]') doesn't return the correct element in IE7
	// so a class was given to the element to target it.

}); // document.ready()