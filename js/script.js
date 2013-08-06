$(document).ready(function() {
	// Use something like modernizr to check 
	// if placeholder is supported natively
	// before running this
	$('#placeholder').nosFormInputPlaceholder();

	$('#inputfile').nosFormInputFile({
		placeholder: 'Placeholder Text'
	});

	$('#select').nosFormSelect();

	$('#select-alt').nosFormSelect({
		defaultDropdown: true
	});

	$('input[type="checkbox"]').nosFormInputCheckbox();

	$('input[type="radio"]').nosFormInputRadio();

	$('#toggle-form-elements').click(function(e){
		e.preventDefault();
		
		$('div').next('input, select').toggle();
	});

	$('.tooltip').nosTooltip();
}); // document.ready()