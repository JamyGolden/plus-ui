$(document).ready(function() {
	// Use something like modernizr to check 
	// if placeholder is supported natively
	// before running this
	$('#placeholder').nosInputPlaceholder();

	// Input file
	$('#inputfile').nosInputFile();

	// Form Select
	$('#select').nosFormSelect();

	// Form select with defaultDropdown
	$('#select-alt').nosFormSelect({
		defaultDropdown: true,
		nameSpace: 'nosui-form-select-alt'
	});

	// Input Checkbox
	$('input[type="checkbox"]').nosInputCheckbox();

	// Input Radio
	$('input[type="radio"]').nosInputRadio();

	// Tooltip
	$('.tooltip').nosTooltip();

	// Toggle form elements for informational purposes
	// With this you can see how selecting a custom 
	// form element selects it's hidden counterpart.
	$('#toggle-form-elements').click(function(e){
		e.preventDefault();

		$('div').next('input, select').toggle();
	});
}); // document.ready()