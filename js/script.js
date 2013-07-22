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

	$('#select').nosFormSelect('Placeholder Text');

	$('#select-alt').nosFormSelect('Placeholder Text', true);

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