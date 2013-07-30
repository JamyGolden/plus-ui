/*
* jQuery NOs 0.3
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ) {

window.NosUIApp = {
	initMethod: function(options){
		if(typeof options !== 'object'){
			options = {};
		}
	},
	form: {
		isDisabled: function($el, $fauxEl, className) {
			if(typeof $el.attr('disabled') == 'string'){
				$fauxEl.addClass(className);
				return true;
			} else {
				$fauxEl.removeClass(className);
				return false;
			}
		}
	}
};

jQuery.fn.extend({

	nosTabs: function( dynamicNav, callback ) {

		return this.each( function() {

			// Define variables
			var $el = $(this),
				$contentChildren = $el.find('.nostabs-content').children();

			$contentChildren.hide().eq( 0 ).show();

			// Dynamically create the tabs
			if ( dynamicNav == true ) {

				var $nosTabsNav = $('<ul />', {
					'class': 'nostabs-nav'
				}).prependTo( $el );

				$contentChildren.each ( function (i) {

					$('<li />', {
						'class'	: i == 0 ? 'is-active' : '', // First tab is active
						'text'	: $(this).attr('data-nostabs-title')
					}).appendTo( $nosTabsNav );
					
				});
			} // End Dynamic Nav

			var $nosTabsNav = $el.find('.nostabs-nav'),
				$nosTabsNavItems = $nosTabsNav.find('li');

			$nosTabsNavItems.click(function() {

				var $this = $(this),
					index = $this.index();

				$this.addClass('is-active').siblings().removeClass('is-active');
				$contentChildren.eq( index ).show().siblings().hide();

			});

			if ( typeof( callback ) == 'function' ) callback( $el );
			
		}); // this.each()

	}, // nosTabs()
	nosAccordion: function( callback ) {

		return this.each(function(){

			var $el = $(this),
				$nosChildren = $el.children();

				$el.data().test = 'test nosAccordion';

			for ( var i = 0; i < $nosChildren.length; i++ ) {
				$nosChildren.eq();
			}

			var $nosTitle = $el.find('.plusaccordion-heading'),
				$nosContent = $el.children().not('.plusaccordion-heading');

			$nosContent.hide();
			$nosTitle.click(function() {

				var $this = $(this);

				$this.next().slideToggle();

			});

			if ( typeof( callback ) == 'function' ) callback( $el );
			
		}); this.each()

	}, // nosAccordion()
	nosFormInputPlaceholder: function( placeholderText, callback ) {

		return this.each(function(){

			var $el = $(this),
				val = placeholderText ? placeholderText : $el.attr('placeholder');

			function focusInput(){
				if($el.val() == val){
					$el.val('')
				}
			}

			function blurInput(){
				if($el.val() == ''){
					$el.val(val)
				}
			}

			// Set value
			$el.val(val);

			// Turn off functions
			// Incase this is called twice
			$el.off('focus.placeholder').off('blur.placeholder');

			// Turn on functions
			$el.on('focus.placeholder', focusInput).on('blur.placeholder', blurInput);
		});

	}, // nosPlaceholder()
	nosFormSelect: function( options, disableMethod ){
	// nosFormSelect: function( placeholder, defaultDropdown, clickEvent, disable ){

		NosUIApp.initMethod();

		var elAttrNames = {
			typeDefault: {
				'name': 'nosui-formselect--default',
				'dataName': 'nosui-formselect-type-default'
			},
			typeCustom: {
				'name': 'nosui-formselect--custom',
				'dataName': 'nosui-formselect-type-custom',
				'list': 'nosui-formselect__list',
				'item': 'nosui-formselect__item',
				'activeItem': 'nosui-formselect__item--active'
			},
			'el': 'nosui-formselect__element',
			'name': 'nosui-formselect',
			'active': 'nosui-formselect--active',
			'disabled': 'nosui-formselect--disabled',
			'placeholder': 'nosui-formselect__placeholder',
			'dropdownButton': 'nosui-formselect__dropdown-button'
		};

		return this.each(function(){

			var $el = $(this),
				$elOptions = $el.find('option');

			$el.addClass(elAttrNames.el);
			// Remove custom styling
			// Restore element back to original state
			if(disableMethod === true && $el.data(elAttrNames.typeDefault.dataName)){

				$el.data(elAttrNames.typeDefault.dataName, false).off().unwrap();
				return;

			} else if(disableMethod === true && $el.data(elAttrNames.typeCustom.dataName)){

				$el.data(elAttrNames.typeCustom.dataName, false).show();
				$el.prev().off().find('li').off().end().remove();
				return;

			};

			if ( options.defaultDropdown == true ) {

				// Adding element physical properties
				$el.data(elAttrNames.typeDefault.dataName, true)
					.addClass(elAttrNames.el)
					.wrap(
						$('<div />', {
							'class': elAttrNames.name + ' ' + elAttrNames.typeDefault.name,
							'id': $el.attr('id') ? elAttrNames.name + '-' + $el.attr('id') : false
						})
					);

				// Creating variables and dom elements
				var $fauxSelect = $el.parent(),
					$selectedOption = $elOptions.filter(function(){
						return $(this).prop('selcted') === true;
					}),
					placeholderText = $selectedOption.length ? $selectedOption.text() : $elOptions.first().text(),
					// Adding select placeholder text
					$placeholder = $('<div />', {
						'class': elAttrNames.placeholder,
						'text': placeholderText
					}).prependTo( $fauxSelect );

				// Applied for disabled styling if applied
				NosUIApp.form.isDisabled($el, $fauxSelect, elAttrNames.disabled);

				// Events
				$el.on({
					click: function(e) {

						// Applied for disabled styling if applied
						NosUIApp.form.isDisabled($el, $fauxSelect, elAttrNames.disabled);
						$fauxSelect.toggleClass( elAttrNames.active );

						// Event Callback
						if(typeof options.onClick === 'function') {
							options.onClick($el, $fauxSelect);
						};
					},
					change: function() {

						var text = $el.find(':selected').text();
						$placeholder.text(text);

						// Event Callback
						if(typeof options.onChange === 'function') {
							options.onChange($el, $fauxSelect);
						};

					},
					blur: function() {
						$fauxSelect.removeClass( elAttrNames.active );

						// Event Callback
						if(typeof options.onBlur === 'function') {
							options.onBlur($el, $fauxSelect);
						};
					}
				});

			} else {

				// Set data for plugin
				$el.data(elAttrNames.typeCustom.dataName, true);

				function toggleDropdown($fauxSelect) {
					$fauxSelect.toggleClass(elAttrNames.active).find( $list ).toggle();
				};

				var $fauxSelect = $('<div />', {
					'class': elAttrNames.name,
					'id': $el.attr('id') ? elAttrNames.name + '-' + $el.attr('id') : ''
				});

				// Check if is disabled
				// If so add the necessary classes
				NosUIApp.form.isDisabled($el, $fauxSelect, elAttrNames.disabled);

				$el.hide().before( $fauxSelect );

				// Creating List
				var $list = $('<div />', {
						'class': elAttrNames.typeCustom.list
					}).appendTo( $fauxSelect ).hide(),

					$dropdownButton = $('<div />', {
						'class': elAttrNames.dropdownButton
					}).appendTo( $fauxSelect );

				// For each option, create a fauxOption
				$elOptions.each( function( i ) {
					$('<div />', {
						'class': i == 0 ? elAttrNames.typeCustom.activeItem + ' ' + elAttrNames.typeCustom.item : elAttrNames.typeCustom.item,
						'text': $(this).text(),
						'data-nosformselect-selected': $(this).prop('selected')
					}).appendTo( $list );
				});

				var $fauxOptions = $fauxSelect.find('.' + elAttrNames.typeCustom.item),
					$fauxSelectedOption = $fauxOptions.filter(function(){
						return $(this).data('nosformselect-selected');
					});

				// If nothing is selected, select the first in the list
				if(!$fauxSelectedOption.length){
					$fauxSelectedOption = $fauxOptions.eq(0);
				}

				// Adding select placeholder text
				var $placeholder = $('<div />', {
					'class': elAttrNames.placeholder,
					'text': options.placeholder ? options.placeholder : $fauxSelectedOption.text()
				}).insertBefore( $list );

				NosUIApp.form.isDisabled($el, $fauxSelect, elAttrNames.disabled);

				// Events
				$fauxSelect.on('click', function(e) {
					// Return if select is disabled
					if(NosUIApp.form.isDisabled($el, $fauxSelect) === true) {
						return;
					};

					toggleDropdown($fauxSelect);
				});

				// Click functionality for fauxOptions
				$fauxOptions.on('click', function(e) {

					// When clicking on an item, don't trigger
					// the click on the $fauxSelect itself
					e.stopPropagation();

					var $this = $(this),
						index = $this.index(),
						text = $this.text();

					$this.addClass(elAttrNames.active).siblings().removeClass(elAttrNames.active);
					$placeholder.text(text);

					// Change selected item on the select menu
					$elOptions.prop('selected', false).eq(index).prop('selected', true);

					if(typeof options.onClick === 'function') {
						options.onClick($el, $fauxSelect);
					};

					toggleDropdown($fauxSelect);

				}); // .select li.click

			};

		}); // each

	}, // nosFormSelect
	nosFormInputCheckbox: function(clickEvent){

		return this.each(function(){

			var $el = $(this),
				$fauxCheckbox = $('<div />', {
				'class': 'nosformcheckbox'
			}).insertBefore( $el.hide() );

			if(typeof $el.attr('disabled') !== 'undefined'){
				$fauxCheckbox.addClass('nosformcheckbox-disabled');
			} else {
				$fauxCheckbox.removeClass('nosformcheckbox-disabled');
			}

			$fauxCheckbox.click( function(){ 
				var $this = $(this);

				if(typeof $el.attr('disabled') !== 'undefined'){
					$fauxCheckbox.addClass('nosformcheckbox-disabled');
					return;
				} else {
					$fauxCheckbox.removeClass('nosformcheckbox-disabled');
				}

				$this.toggleClass('nosformcheckbox-checked nosforminput');

				!$el.attr('checked') ? $el.attr('checked', 'checked') : $el.removeAttr('checked'); 

				if(typeof clickEvent === 'function') {
					clickEvent($el);
				};
			});
			
		}); // this.each()

	}, // nosFormCheckbox()
	nosFormInputRadio: function(clickEvent){

		return this.each(function(){

			var $el = $(this),
				$fauxCheckbox = $('<div />', {
				'class': 'nosformradio nosforminput'
			}).insertBefore( $el.hide() );

			if(typeof $el.attr('disabled') !== 'undefined'){
				$fauxCheckbox.addClass('nosformradio-disabled');
			} else {
				$fauxCheckbox.removeClass('nosformradio-disabled');
			}

			$fauxCheckbox.click( function(){ 
				var $this = $(this);

				if(typeof $el.attr('disabled') !== 'undefined'){
					$fauxCheckbox.addClass('nosformradio-disabled');
					return;
				} else {
					$fauxCheckbox.removeClass('nosformradio-disabled');
				}

				$this.addClass('nosformradio-checked').siblings('.nosformradio').removeClass('nosformradio-checked');
				$el.prop('checked', 'checked').siblings('input[name="' + $el.attr('name') + '"]').removeAttr('checked');

				if(typeof clickEvent === 'function') {
					clickEvent($el);
				};

			});
		
		});

	}, // nosFormRadio()
	nosFormInputFile: function( placeholderText ){

		return this.each(function(){

			var $el = $(this),
				$fauxInputFile = $('<div />', {
					'class': 'nosformfile nosforminput'
				}),
				$placeholder = $('<span />', {
					'class': 'nosformfile-placeholder',
					text: placeholderText

				});

			$el.wrap( $fauxInputFile ).before( $placeholder );

			$el.change(function(){
				$placeholder.text( $el.val() );
			});


		}); // return this.each

	}, // nosFormRadio()
	nosTooltip: function( tooltipText ){

		var elAttrNames = {
			'name': 'nosui-tooltip',
			'container': 'nosui-tooltip-container',
			'dataName': 'nostooltip'
		};

		return this.each(function(){

			var $el = $(this),
				$container = $('<div />', {
					'class'	: elAttrNames.container
				}),
				$tooltip = $('<div />', {
					'class'	: elAttrNames.name,
					text 	: tooltipText ? tooltipText : $el.data(elAttrNames.dataName)
				});

			$el.wrap($container).after($tooltip);

		}); // return this.each

	} // nosTooltip()
});

})( jQuery );
