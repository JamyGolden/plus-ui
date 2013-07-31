/*
* jQuery NOs 0.5
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ) {

window.NosUIApp = {
	defineOptions: function(defaults, options){
		// both don't exist
		if(typeof options !== 'object' && typeof defaults !== 'object'){
			return {};

		// both exist
		} else if(typeof options === 'object' && typeof defaults === 'object'){
			$.extend(true, defaults, options);
			return defaults;

		// if options doesn't exist
		} else if(typeof options !== 'object'){
			return defaults;

		// If defaults doesn't exist - should cover everything
		} else if(typeof defaults !== 'object'){ 
			return options;
		}
	},
	form: {
		isDisabled: function($el, $fauxEl, className) {
			if($el.prop('disabled')){
				$fauxEl.addClass(className);
				return true;
			} else {
				$fauxEl.removeClass(className);
				return false;
			}
		}
	}
};

$.fn.extend({

	nosFormInputPlaceholder: function( options, disableMethod ) {
		options = NosUIApp.defineOptions(options);

		return this.each(function(){

			var $el = $(this);

			if(typeof options.placeholder === 'string') {
				val = options.placeholder;
			} else {
				val =  $el.attr('placeholder');
			}

			// The value hasn't been defined 
			// and cannot be guessed either.
			// Everything should stop here
			if(typeof val !== 'string') {
				return;
			}

			function focusInput(){
				// Focus Callback
				if(typeof options.onFocus === 'function') {
					options.onFocus($el);
				};

				if($el.val() == val){
					$el.val('')
				}
			}

			function blurInput(){
				// Blur Callback
				if(typeof options.onBlur === 'function') {
					options.onBlur($el);
				};

				if($el.val() == ''){
					$el.val(val)
				}
			}

			// Set value
			$el.val(val);

			// Turn off functions
			// Incase this is called twice
			$el.off({
				'focus.placeholder': focusInput,
				'blur.placeholder': blurInput
			});

			// Disable this method
			// Return here before the elements have the functionality 
			// turned on
			if(disableMethod === true){
				return;
			};

			// Turn on functions
			$el.on({
				'focus.placeholder': focusInput,
				'blur.placeholder': blurInput
			});
		});

	}, // nosPlaceholder()
	nosFormSelect: function( options, disableMethod ){

		var defaults = {
			elAttrNames: {
				typeDefault: {
					'defaultClass': 'nosui-form-select--default',
					'dataName'    : 'nosui-form-select-type-default'
				},
				typeCustom: {
					'defaultClass'   : 'nosui-form-select--custom',
					'dataName'       : 'nosui-form-select-type-custom',
					'dataSelected'   : 'nosui-form-select-selected',
					'listClass'      : 'nosui-form-select__list',
					'itemClass'      : 'nosui-form-select__item',
					'activeItemClass': 'nosui-form-select__item--active'
				},
				'elClass'            : 'nosui-form-select__element',
				'fauxElClass'        : 'nosui-form-select',
				'activeClass'        : 'nosui-form-select--active',
				'disabledClass'      : 'nosui-form-select--disabled',
				'dropdownButtonClass': 'nosui-form-select__dropdown-button',
				'placeholderClass'   : 'nosui-form-select__placeholder'
			}
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this),
				$elOptions = $el.find('option');

			$el.addClass(options.elAttrNames.elClass);
			// Remove custom styling
			// Restore element back to original state
			if(disableMethod === true && $el.data(options.elAttrNames.typeDefault.dataName)){
				// Changing the data on the element to 
				// reflect that it has been disabled
				$el.data(options.elAttrNames.typeDefault.dataName, false).off().unwrap();

				return;
			} else if(disableMethod === true && $el.data(options.elAttrNames.typeCustom.dataName)){
				// Changing the data on the element to 
				// reflect that it has been disabled
				$el.data(options.elAttrNames.typeCustom.dataName, false).show();

				// Turn off fauxEl and fauxOptions events
				$el.prev().off().find('li').off().end().remove();
				return;
			};

			if ( options.defaultDropdown == true ) {

				// Adding element physical properties
				$el.data(options.elAttrNames.typeDefault.dataName, true)
					.addClass(options.elAttrNames.elClass)
					.wrap(
						$('<div />', {
							'class': options.elAttrNames.fauxElClass + ' ' + options.elAttrNames.typeDefault.defaultClass,
							'id': $el.attr('id') ? options.elAttrNames.fauxElClass + '-' + $el.attr('id') : ''
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
						'class': options.elAttrNames.placeholderClass,
						'text': placeholderText
					}).prependTo( $fauxSelect );

				// Applied for disabled styling if applied
				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				// Events
				$el.on({
					click: function(e) {

						// Applied for disabled styling if applied
						NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);
						$fauxSelect.toggleClass( options.elAttrNames.activeClass );

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
						$fauxSelect.removeClass( options.elAttrNames.active );

						// Event Callback
						if(typeof options.onBlur === 'function') {
							options.onBlur($el, $fauxSelect);
						};
					}
				});

			} else {

				// Set data for plugin
				$el.data(options.elAttrNames.typeCustom.dataName, true);

				function toggleDropdown($fauxSelect) {
					$fauxSelect.toggleClass(options.elAttrNames.activeClass).find('.' + options.elAttrNames.typeCustom.listClass).toggle();
				};

				var $fauxSelect = $('<div />', {
					'class': options.elAttrNames.fauxElClass + ' ' + options.elAttrNames.typeCustom.defaultClass,
					'id': $el.attr('id') ? options.elAttrNames.fauxElClass + '-' + $el.attr('id') : ''
				});

				// Check if is disabled
				// If so add the necessary classes
				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				$el.hide().before( $fauxSelect );

				// Creating List
				var $list = $('<div />', {
						'class': options.elAttrNames.typeCustom.listClass
					}).appendTo( $fauxSelect ).hide(),

					$dropdownButton = $('<div />', {
						'class': options.elAttrNames.dropdownButtonClass
					}).appendTo( $fauxSelect );

				// For each option, create a fauxOption
				$elOptions.each( function( i ) {
					$('<div />', {
						'class': i == 0 ? options.elAttrNames.typeCustom.activeItemClass + ' ' + options.elAttrNames.typeCustom.itemClass : options.elAttrNames.typeCustom.itemClass,
						'text': $(this).text()
					})
						.data(options.elAttrNames.typeCustom.dataSelected, $(this).prop('selected'))
						.appendTo( $list );
				});

				var $fauxOptions = $fauxSelect.find('.' + options.elAttrNames.typeCustom.itemClass),
					$fauxSelectedOption = $fauxOptions.filter(function(){
						return $(this).data(options.elAttrNames.typeCustom.dataSelected);
					});

				// If nothing is selected, select the first in the list
				if(!$fauxSelectedOption.length){
					$fauxSelectedOption = $fauxOptions.eq(0);
				}

				// Adding select placeholder text
				var $placeholder = $('<div />', {
					'class': options.elAttrNames.placeholderClass,
					'text': options.placeholder ? options.placeholder : $fauxSelectedOption.text()
				}).insertBefore( $list );

				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				// Faux select Events
				$fauxSelect.on({
					click: function(e) {
						// Return if select is disabled
						if(NosUIApp.form.isDisabled($el, $fauxSelect) === true) {
							return;
						};

						toggleDropdown($fauxSelect);
					}
				});

				// Click functionality for fauxOption elements
				$fauxOptions.on({
					click: function(e) {
						// When clicking on an item, don't trigger
						// the click on the $fauxSelect itself
						e.stopPropagation();

						var $this = $(this),
							index = $this.index(),
							text = $this.text();

						$this.addClass(options.elAttrNames.activeClass).siblings().removeClass(options.elAttrNames.activeClass);
						$placeholder.text(text);

						// Change selected item on the select menu
						$elOptions.prop('selected', false).eq(index).prop('selected', true);

						if(typeof options.onClick === 'function') {
							options.onClick($el, $fauxSelect);
						};

						toggleDropdown($fauxSelect);
					}
				}); // .select li.click

			};

		}); // each

	}, // nosFormSelect
	nosFormInputCheckbox: function(options, disableMethod){

		var defaults = {
			elAttrNames: {
				'fauxElClass'  : 'nosui-form-checkbox',
				'inputClass'   : 'nosui-form-input-text',
				'disabledClass': 'nosui-form-checkbox--disabled',
				'checkedClass' : 'nosui-form-checkbox--checked'
			}
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			if(disableMethod === true){
				// Changing the data on the element to 
				// reflect that it has been disabled
				$el.prev('.' + options.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				$el.show(); // Show the element

				return;
			};

			var $fauxCheckbox = $('<div />', {
					'class': options.elAttrNames.fauxElClass + ' ' + options.elAttrNames.inputClass
				}).insertBefore( $el.hide() );


			NosUIApp.form.isDisabled($el, $fauxCheckbox, options.elAttrNames.disabledClass);

			// Force fauxEl to match the checked state of the 
			// input on init
			if($el.prop('checked')){
				$fauxCheckbox.addClass(options.elAttrNames.checkedClass);
			};

			$fauxCheckbox.on({
				click: function(){ 
					var $this = $(this);

					// This applies disabled styled if disabled
					// returns false.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxCheckbox, options.elAttrNames.disabledClass)){
						return;
					};

					$this.toggleClass(options.elAttrNames.checkedClass);

					// Toggle Attribute
					if($el.prop('checked')){
						$el.prop('checked', false);
					} else {
						$el.prop('checked', true);
					};

					if(typeof options.onClick === 'function') {
						options.onClick($el);
					};
				}
			});
			
		}); // this.each()

	}, // nosFormCheckbox()
	nosFormInputRadio: function(options, disableMethod){

		var defaults = {
			elAttrNames: {
				'fauxElClass'  : 'nosui-form-radio',
				'inputClass'   : 'nosui-form-input-text',
				'disabledClass': 'nosui-form-radio--disabled',
				'checkedClass' : 'nosui-form-radio--checked',
				'dataName'     : 'nosui-form-radio-name'
			}
		}
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			if(disableMethod === true){
				// Changing the data on the element to 
				// reflect that it has been disabled
				$el.prev('.' + options.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				$el.show(); // Show the element

				return;
			};

			var elName = $el.attr('name'),
				$elSiblings = $('input[type="radio"]').filter(function(){
					return $(this).attr('name') == elName;
				}).not($el),
				$fauxCheckbox = $('<div />', {
					'class': options.elAttrNames.fauxElClass
				}).data(options.elAttrNames.dataName, elName).insertBefore( $el.hide() );

			// This applies disabled styled if disabled
			// returns false.
			// If disabled stop running the function
			if(NosUIApp.form.isDisabled($el, $fauxCheckbox, options.elAttrNames.disabledClass)){
				return;
			};

			// Force fauxEl to match the checked state of the 
			// input on init
			if($el.prop('checked')){
				$fauxCheckbox.addClass(options.elAttrNames.checkedClass);
			};

			$fauxCheckbox.on({
				click: function(){ 
					// Apply disabled styled if disabled
					// returns false if disabled.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxCheckbox, options.elAttrNames.disabledClass)){
						return;
					};
					
					var $this = $(this),
						fauxDataName = $fauxCheckbox.data(options.elAttrNames.dataName),
						$fauxSiblings = $('.' + options.elAttrNames.fauxElClass).filter(function(){
							return $(this).data(options.elAttrNames.dataName) == fauxDataName ? true : false;
						}).not($this);

					$this.addClass(options.elAttrNames.checkedClass);
					$fauxSiblings.removeClass(options.elAttrNames.checkedClass);
					$el.prop('checked', true);
					$elSiblings.prop('checked', false);

					if(typeof options.onClick === 'function') {
						options.onClick($el);
					};
				}
			});
		});

	}, // nosFormRadio()
	nosFormInputFile: function( options, disableMethod ){

		var defaults = {
			elAttrNames: {
				'elClass'         : 'nosui-form-file__element',
				'fauxElClass'     : 'nosui-form-file',
				'disabledClass'   : 'nosui-form-file--disabled',
				'placeholderClass': 'nosui-form-file__placeholder'
			}
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);
			$el.addClass(options.elAttrNames.elClass);

			var $fauxInputFile = $('<div />', {
					'class': options.elAttrNames.fauxElClass
				}),
				$placeholder = $('<span />', {
					'class': options.elAttrNames.placeholderClass,
					'text': options.placeholder ? options.placeholder : ''

				});

			NosUIApp.form.isDisabled($el, $fauxInputFile, options.elAttrNames.disabledClass);

			$el.wrap( $fauxInputFile ).before( $placeholder );

			$el.on({
				change: function(){
					$placeholder.text( $el.val() );
				}
			});


		}); // return this.each

	}, // nosFormRadio()
	nosTooltip: function( options ){

		var defaults = {
			elAttrNames: {
				popup: 'nosui-tooltip__popup',
				'container': 'nosui-tooltip',
				'dataName': 'nosui-tooltip'
			}
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){
			var $el = $(this),
				$container = $('<div />', {
					'class' : options.elAttrNames.container
				}),
				$tooltip = $('<div />', {
					'class': options.elAttrNames.popup,
					'text' : options.text ? options.text : $el.data(options.elAttrNames.dataName)
				});

			$el.wrap($container).after($tooltip);

		}); // return this.each

	} // nosTooltip()
});

})( jQuery );
