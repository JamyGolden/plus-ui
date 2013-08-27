/*
* jQuery NOs 0.7
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

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.nameSpace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNameSpace(defaults.elAttrNames, defaults.nameSpace);
			};

			return defaults;

		// if options doesn't exist
		} else if(typeof options !== 'object'){

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.nameSpace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNameSpace(defaults.elAttrNames, defaults.nameSpace);
			};

			return defaults;

		// If defaults doesn't exist - should cover everything
		} else if(typeof defaults !== 'object'){ 
			return options;
		};
	},
	matchElType: function($elType, $el){
		var el = $el.get(0);

		if(!$elType.filter($el).length){ // $el is NOT of the correct element type
			var elSelector = NosUIApp.getFullElSelector($el);

			throw new Error('Incorrect element type targetted with the NOS-UI script. Element: ' + elSelector);
		}
	},
	getFullElSelector: function($el){
		var el = $el.get(0),
			elAttrId = el.id,
			elIdSelector = elAttrId !== '' ? '#' + elAttrId : '',
			elAttrClass = el.getAttribute('class'),
			elClassSelector = elAttrClass ? '.' + elAttrClass.trim().split(' ').join('.') : '',
			elSelector = elIdSelector + elClassSelector;

		return elSelector;
	},
	form: {
		isDisabled: function($el, $fauxEl, className) {
			if(typeof $el == 'undefined'){
				throw new Error('missing $el parameter');
			} else if (typeof $fauxEl == 'undefined') {
				throw new Error('missing $fauxEl parameter');
			} else if (typeof className == 'undefined'){
				throw new Error('missing className parameter');
			};

			if($el.prop('disabled')){
				$fauxEl.addClass(className);
				return true;
			} else {
				$fauxEl.removeClass(className);
				return false;
			}
		}
	},
	applyCssNameSpace: function(elAttrNames, nameSpace){
		$.each(elAttrNames, function(k, v){
			if(typeof v === 'object'){
				NosUIApp.applyCssNameSpace(elAttrNames[k], nameSpace);
			} else {
				elAttrNames[k] = nameSpace + v;
			};
		});
	}
};



$.fn.extend({

	nosInputPlaceholder: function( options, disableMethod ) {

		var defaults = {
			placeholder: null
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			NosUIApp.matchElType($('input'), $el);

			if(typeof options.placeholder === 'string') {
				val = options.placeholder;
			} else {
				val =  $el.attr('placeholder');
			};

			// The value hasn't been defined 
			// and cannot be guessed either.
			// Everything should stop here
			if(typeof val !== 'string') {
				return;
			};

			function focusInput(){
				// Focus Callback
				if(typeof options.onFocus === 'function') {
					options.onFocus($el);
				};

				if($el.val() == val){
					$el.val('')
				};
			};

			function blurInput(){
				// Blur Callback
				if(typeof options.onBlur === 'function') {
					options.onBlur($el);
				};

				if($el.val() == ''){
					$el.val(val)
				};
			};

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
			elAttrNames: { // Attr names without a namespace
				typeDefault: {
					'defaultClass': '--default',
					'dataName'    : '-type-default'
				},
				typeCustom: {
					'defaultClass'   : '--custom',
					'dataName'       : '-type-custom',
					'dataSelected'   : '-selected',
					'listClass'      : '__list',
					'itemClass'      : '__item',
					'activeItemClass': '__item--active'
				},
				'elClass'            : '-element',
				'fauxElClass'        : '',
				'activeClass'        : '--active',
				'disabledClass'      : '--disabled',
				'dropdownButtonClass': '__dropdown-button',
				'placeholderClass'   : '__placeholder'
			},
			nameSpace: 'nosui-form-select',
			isOpen: false,
			hideOnFocusLoss: true,
			onInit: null,
			onClick: null,
			onChange: null,
			onBlur: null
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			NosUIApp.matchElType($('select'), $el);

			var $elOptions = $el.find('option'),
				$selectedOption = $elOptions.filter(function(){
					return $(this).prop('selcted') === true;
				});

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
				$el.prev().off().find('.' + options.elAttrNames.typeCustom.itemClass).off().end().remove();
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
				var elName = $el.attr('name') ? $el.attr('name') : null;
					$fauxSelect = $el.parent();

				$fauxSelect.data('name', elName);

				var placeholderText = $selectedOption.length ? $selectedOption.text() : $elOptions.first().text(),
					// Adding select placeholder text
					$placeholder = $('<div />', {
						'class': options.elAttrNames.placeholderClass,
						'text': placeholderText
					}).prependTo( $fauxSelect );

				// Applied for disabled styling if applied
				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				// Event Callback
				if(typeof options.onInit === 'function') {
					options.onInit($el, $fauxSelect);
				};

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
					change: function(e) {

						var text = $el.find(':selected').text();
						$placeholder.text(text);

						// Event Callback
						if(typeof options.onChange === 'function') {
							options.onChange($el, $fauxSelect);
						};

					},
					blur: function(e) {
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
					$fauxSelect.toggleClass(options.elAttrNames.activeClass);
					$fauxSelectList.toggle();

					// Toggle isOpen property
					if($fauxSelectList.is(':hidden')){
						options.isOpen = false;
					} else {
						options.isOpen = true;
					};

					// Hide $fauxSelectList if anything is clicked.
					if(options.hideOnFocusLoss){
						if(options.isOpen){
							$('body').on('click.nosui', function(){
								toggleDropdown($fauxSelect);
							});
						} else {
							$('body').off('click.nosui');
						};
					};
				};

				// Set vars
				var elName      = $el.attr('name') ? $el.attr('name') : null,
					$fauxSelect = $('<div />', {
						'class': options.elAttrNames.fauxElClass + ' ' + options.elAttrNames.typeCustom.defaultClass,
						'id': $el.attr('id') ? options.elAttrNames.fauxElClass + '-' + $el.attr('id') : ''
					}).data('name', elName);

				// Check if is disabled
				// If so add the necessary classes
				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				$el.hide().before( $fauxSelect );

				// Creating List
				var $fauxSelectList = $('<div />', {
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
						.appendTo( $fauxSelectList );
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
					'text': $fauxSelectedOption.text()
				}).insertBefore( $fauxSelectList );

				NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass);

				// Event Callback
				if(typeof options.onInit === 'function') {
					options.onInit($el, $fauxSelect);
				};

				// Faux select Events
				$fauxSelect.on({
					click: function(e) {
						// If hideOnFocusLoss is enabled, don't allow clicks
						// to bubble up and trigger body click
						if(options.hideOnFocusLoss){
							e.stopPropagation();
						};

						// Return if select is disabled
						if(NosUIApp.form.isDisabled($el, $fauxSelect, options.elAttrNames.disabledClass) === true) {
							return;
						};

						if(typeof options.onClick === 'function') {
							options.onClick($el, $fauxSelect);
						};

						toggleDropdown($fauxSelect); // Toggle list
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

						$this.addClass(options.elAttrNames.typeCustom.activeItemClass).siblings().removeClass(options.elAttrNames.typeCustom.activeItemClass);
						$placeholder.text(text);

						// Change selected item on the select menu
						$elOptions.prop('selected', false).eq(index).prop('selected', true);

						// Force the default element change event to fire
						// This is for consistency with the defaultDropdown option
						$el.change(); 

						if(typeof options.onChange === 'function') {
							options.onChange($el, $fauxSelect);
						};

						toggleDropdown($fauxSelect); // Toggle list
					}
				}); // .select li.click

			};

		}); // each

	}, // nosFormSelect
	nosInputCheckbox: function(options, disableMethod){

		var defaults = {
			elAttrNames: {
				'fauxElClass'  : '',
				'disabledClass': '--disabled',
				'checkedClass' : '--checked'
			},
			nameSpace: 'nosui-form-checkbox',
			onInit: null,
			onClick: null
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			NosUIApp.matchElType($('input[type="checkbox"]'), $el);

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

			// Event Callback
			if(typeof options.onInit === 'function') {
				options.onInit($el, $fauxCheckbox);
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
						options.onClick($el, $fauxCheckbox);
					};
				}
			});
			
		}); // this.each()

	}, // nosFormCheckbox()
	nosInputRadio: function(options, disableMethod){

		var defaults = {
			elAttrNames: {
				'fauxElClass'  : '',
				'inputClass'   : '-text',
				'disabledClass': '--disabled',
				'checkedClass' : '--checked',
				'dataName'     : '-name'
			},
			nameSpace: 'nosui-form-radio',
			onInit: null,
			onClick: null
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			NosUIApp.matchElType($('input[type="radio"]'), $el);

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

			// Force fauxEl to match the checked state of the 
			// input on init
			if($el.prop('checked')){
				$fauxCheckbox.addClass(options.elAttrNames.checkedClass);
			};

			// This applies disabled styled if disabled
			// returns false.
			// If disabled stop running the function
			if(NosUIApp.form.isDisabled($el, $fauxCheckbox, options.elAttrNames.disabledClass)){
				return;
			};

			// Event Callback
			if(typeof options.onInit === 'function') {
				options.onInit($el, $fauxCheckbox);
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
						options.onClick($el, $fauxCheckbox);
					};
				}
			});
		});

	}, // nosFormRadio()
	nosInputFile: function( options, disableMethod ){

		var defaults = {
			elAttrNames: {
				'elClass'         : '__element',
				'fauxElClass'     : '',
				'disabledClass'   : '--disabled',
				'placeholderClass': '__placeholder'
			},
			nameSpace: 'nosui-form-file',
			placeholder: 'No file chosen',
			onInit: null,
			onChange: null
		};
		options = NosUIApp.defineOptions(defaults, options);

		return this.each(function(){

			var $el = $(this);

			NosUIApp.matchElType($('input[type="file"]'), $el);

			$el.addClass(options.elAttrNames.elClass);

			var $fauxInputFile = $('<div />', {
					'class': options.elAttrNames.fauxElClass
				}),
				$placeholder = $('<span />', {
					'class': options.elAttrNames.placeholderClass,
					'text': options.placeholder
				});

			NosUIApp.form.isDisabled($el, $fauxInputFile, options.elAttrNames.disabledClass);

			$el.wrap( $fauxInputFile ).before( $placeholder );

			// Event Callback
			if(typeof options.onInit === 'function') {
				options.onInit($el, $fauxCheckbox);
			};

			$el.on({
				change: function(){
					$placeholder.text( $el.val() );

					if(typeof options.onChange === 'function') {
						options.onChange($el, $fauxInputFile);
					};
				}
			});

		}); // return this.each

	}, // nosFormRadio()
	nosTooltip: function( options ){

		var defaults = {
			elAttrNames: {
				'popup'    : 'nosui-tooltip__popup',
				'container': 'nosui-tooltip',
				'dataName' : 'nosui-tooltip'
			},
			text: null
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
