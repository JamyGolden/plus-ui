$(document).ready(function() {

	$('.nostabs').nosTabs(function(base) {
		//console.log(base.data().test);
	});

	$('.nostabs2').nosTabs(true);

	$('.plusaccordion').nosAccordion(function(base) {
		//console.log(base.data().test);
	});

	if ( !Modernizr.input.placeholder ) {
		$('#placeholder').nosFormInputPlaceholder();
	};

	$('#inputfile').nosFormInputFile('Random Placeholder Text');

	$('#select').nosFormSelect({
		placeholder: 'Placeholder Text', 
		onClick: function($el, $fauxSelect){
			$el.prop('disabled', true);
			$fauxSelect.addClass('nosformselect-disabled');
		}
	});

	$('#select-alt').nosFormSelect({
		placeholder: 'Placeholder Text',
		defaultDropdown: true, 
		onClick: function($el, $fauxSelect){
			// console.log($el, $fauxSelect, $el.val())
		}
	});

	$('#checkbox-form').find('input[type="checkbox"]').nosFormInputCheckbox(function(){
		alert('clicked');
	});

	$('#checkbox-form2').find('input[type="checkbox"]').nosFormInputCheckbox();

	$('#radio-form').find('input[type="radio"]').nosFormInputRadio(function(){
		alert('clicked');
	});

	$('#toggle-form-elements').click(function(e){
		e.preventDefault();
		
		$('div').next('input, select').toggle();
	});

	$('#tooltip, #testlol').nosTooltip();

}); // document.ready()