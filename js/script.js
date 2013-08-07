$(document).ready(function() {
	// Use something like modernizr to check 
	// if placeholder is supported natively
	// before running this
	$('#placeholder').nosInputPlaceholder();

	$('#inputfile').nosInputFile({
		placeholder: 'Placeholder Text'
	});

	$('#select').nosFormSelect();

	$('#select-alt').nosFormSelect({
		defaultDropdown: true
	});

	$('input[type="checkbox"]').nosInputCheckbox();

	$('input[type="radio"]').nosInputRadio();

	$('#toggle-form-elements').click(function(e){
		e.preventDefault();
		
		$('div').next('input, select').toggle();
	});

	$('.tooltip').nosTooltip();
}); // document.ready()