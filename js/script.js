$(document).ready(function() {
	// Use something like modernizr to check 
	// if placeholder is supported natively
	// before running this
	$('#placeholder').nosFormInputPlaceholder();

	$('#inputfile').nosFormInputFile({
		placeholder: 'Placeholder Text'
	});

	$('#select').nosFormSelect({
		placeholder: 'Placeholder Text', 
		onFocus: function($el, $fauxSelect){
			// click events here
		}
	});

	$('#select-alt').nosFormSelect({
		placeholder: 'Placeholder Text',
		defaultDropdown: true, 
		onClick: function($el, $fauxSelect){
			// console.log($el, $fauxSelect, $el.val())
		}
	});

	$('input[type="checkbox"]').nosFormInputCheckbox();

	$('input[type="radio"]').nosFormInputRadio();

	$('#toggle-form-elements').click(function(e){
		e.preventDefault();
		
		$('div').next('input, select').toggle();
	});

	$('#tooltip').nosTooltip({
		elAttrNames: {
			popup: 'lol'
		}
	});
}); // document.ready()