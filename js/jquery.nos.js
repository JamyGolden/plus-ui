/*
* jQuery NOs 0.9.6
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ) {

window.NosUIApp = {
	namespace: 'nosui',
	defineOptions: function(defaults, options){
		// both don't exist
		if(typeof options !== 'object' && typeof defaults !== 'object'){
			return {};

		// both exist
		} else if(typeof options === 'object' && typeof defaults === 'object'){
			$.extend(true, defaults, options);

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.namespace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNamespace(defaults.elAttrNames, defaults.namespace);
			};

			return defaults;

		// if options doesn't exist
		} else if(typeof options !== 'object'){

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.namespace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNamespace(defaults.elAttrNames, defaults.namespace);
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

			throw new Error('Incorrect element type targetted with the NOS-UI script. Element: ' + elSelector + '. Or a jQuery object not yet attached to the DOM is being used.');
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
	applyCssNamespace: function(elAttrNames, nameSpace){
		$.each(elAttrNames, function(k, v){
			if(typeof v === 'object' && v !== null){
				NosUIApp.applyCssNamespace(elAttrNames[k], nameSpace);
			} else if(typeof v === 'string'){
				elAttrNames[k] = nameSpace + v;
			};
		});
	},
	elList: {
		responsiveImages: []
	}
};

$.fn.extend({

	nosInputPlaceholder: function( options, disableMethod ) {


		return this.each(function(){

			var defaults = {
					placeholder: null
				},
				o = NosUIApp.defineOptions(defaults, options),
				$el = $(this);

			NosUIApp.matchElType($('input'), $el);

			if(typeof o.placeholder === 'string') {
				$el.attr('placeholder', o.placeholder);
			};

			var val =  $el.attr('placeholder');

			// The value hasn't been defined
			// and cannot be guessed either.
			// Everything should stop here
			if(typeof val !== 'string') {
				return;
			};

			function focusInput(){
				// Focus Callback
				if(typeof o.onFocus === 'function') {
					o.onFocus($el);
				};

				if($el.val() == val){
					$el.val('')
				};
			};

			function blurInput(){
				// Blur Callback
				if(typeof o.onBlur === 'function') {
					o.onBlur($el);
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
				'focus.nosui-placeholder': focusInput,
				'blur.nosui-placeholder': blurInput
			});

			// Disable this method
			// Return here before the elements have the functionality
			// turned on
			if(disableMethod === true){
				return;
			};

			// Turn on functions
			$el.on({
				'focus.nosui-placeholder': focusInput,
				'blur.nosui-placeholder': blurInput
			});
		});

	}, // nosPlaceholder()
	nosFormSelect: function( options, disableMethod ){

		return this.each(function(){

			var defaults = {
					elAttrNames: { // Attr names without a namespace
						typeDefault: {
							'defaultClass': '--default'
						},
						typeCustom: {
							'defaultClass'    : '--custom',
							'dataSelected'    : '-selected',
							'listClass'       : '__list',
							'itemClass'       : '__item',
							'activeItemClass' : '__item--active',
							'firstItemClass'  : '__item--first',
							'lastItemClass'   : '__item--last'
						},
						'elClass'            : '-element',
						'fauxElClass'        : '',
						'activeClass'        : '--active',
						'mousedownClass'     : '--mousedown',
						'disabledClass'      : '--disabled',
						'dropdownButtonClass': '__dropdown-button',
						'placeholderClass'   : '__placeholder',
						'dataName'           : '-type'
					},
					namespace: 'nosui-form-select',
					defaultDropdown: false,
					isOpen: false,
					onInit: null,
					onClick: null,
					onChange: null,
					onMousedown: null, // Only used for defaultDropdown: false
					onBlur: null // Only used for defaultDropdown: true
				},
				$el = $(this),
				o = NosUIApp.defineOptions(defaults, options);

			// Match element or throw error
			NosUIApp.matchElType($('select'), $el);

			// Restore element back to original state
			if(disableMethod === true && $el.data(o.elAttrNames.dataName) == 'default'){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.siblings().remove() // remove placeholder and button
					.end().removeClass(o.elAttrNames.elClass).data(o.elAttrNames.dataName, null).off({
						'click.nosui-form-select': null,
						'change.nosui-form-select': null,
						'blur.nosui-form-select': null
					}).unwrap();

				return;
			} else if(disableMethod === true && $el.data(o.elAttrNames.dataName) == 'custom'){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.removeClass(o.elAttrNames.elClass).data(o.elAttrNames.dataName, null).show();

				// Turn off fauxEl and fauxOptions events
				$el.prev().off() // turn off fauxEl events
					.find('.' + o.elAttrNames.typeCustom.itemClass).off() //turn off fauxOption events
					.end().remove(); // remove fauxEl
				return;
			} else if(disableMethod === true){
				// Return if this doesn't affect anything
				return;
			}

			var $elOptions = $el.find('option'),
				$selectedOption = $elOptions.filter(function(){
					return $(this).prop('selcted') === true;
				});

			$el.addClass(o.elAttrNames.elClass);

			if ( o.defaultDropdown == true ) {

				// Adding element physical properties
				$el.data(o.elAttrNames.dataName, 'default')
					.addClass(o.elAttrNames.elClass)
					.wrap(
						$('<div />', {
							'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.typeDefault.defaultClass,
							'id': $el.attr('id') ? o.elAttrNames.fauxElClass + '-' + $el.attr('id') : ''
						})
					);

				// Creating variables and dom elements
				var elName = $el.attr('name') ? $el.attr('name') : null;
					$fauxSelect = $el.parent();

				$fauxSelect.data('name', elName);

				var placeholderText = $selectedOption.length ? $selectedOption.text() : $elOptions.first().text(),
					// Adding select placeholder text
					$placeholder = $('<div />', {
						'class': o.elAttrNames.placeholderClass,
						'text': placeholderText
					}).prependTo( $fauxSelect ),

					$dropdownButton = $('<div />', {
						'class': o.elAttrNames.dropdownButtonClass
					}).insertAfter( $placeholder );

				// Applied for disabled styling if applied
				NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass);

				// Event Callback
				if(typeof o.onInit === 'function') {
					o.onInit($el, $fauxSelect, o);
				};

				// Events
				$el.on({
					'focus.nosui-form-select': function(e) {
						// Applied for disabled styling if applied
						NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass);
						$fauxSelect.toggleClass( o.elAttrNames.activeClass );

						// Event Callback
						if(typeof o.onClick === 'function') {
							o.onClick($el, $fauxSelect, o);
						};
					},
					'change.nosui-form-select': function(e) {
						var text = $el.find(':selected').text();
						$placeholder.text(text);

						// Event Callback
						if(typeof o.onChange === 'function') {
							o.onChange($el, $fauxSelect, o);
						};
					},
					'blur.nosui-form-select': function(e) {
						$fauxSelect.removeClass( o.elAttrNames.activeClass );

						// Event Callback
						if(typeof o.onBlur === 'function') {
							o.onBlur($el, $fauxSelect, o);
						};
					}
				});

			} else {

				// Set data for plugin
				$el.data(o.elAttrNames.dataName, 'custom');

				function toggleDropdown($fauxSelect) {
					// Toggle isOpen property
					if(o.isOpen == false){
						showDropdown($fauxSelect);
					} else {
						hideDropdown($fauxSelect)
					};
				};

				function showDropdown($fauxSelect) {

					$fauxSelect.addClass(o.elAttrNames.activeClass);
					$fauxSelectList.show();

					// This event must be `mousedown` instead of `click` otherwise
					// the select will immediately hide once clicked
					$('body').on('mousedown.nosui-form-select', function(e){
						hideDropdown($fauxSelect);
					});

					o.isOpen = true;
				};

				function hideDropdown($fauxSelect) {
					$fauxSelectList.hide();

					o.isOpen = false;

					// This event must be `mousedown` instead of `click` otherwise
					// the select will immediately hide once clicked
					$('body').off('mousedown.nosui-form-select');

					$fauxSelect.removeClass(o.elAttrNames.activeClass);
				};

				// Set vars
				var elName      = $el.attr('name') ? $el.attr('name') : null,
					$fauxSelect = $('<div />', {
						'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.typeCustom.defaultClass,
						'id': $el.attr('id') ? o.elAttrNames.fauxElClass + '-' + $el.attr('id') : ''
					}).data('name', elName);

				// Check if is disabled
				// If so add the necessary classes
				NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass);

				$el.hide().before( $fauxSelect );

				// Creating List
				var $fauxSelectList = $('<div />', {
						'class': o.elAttrNames.typeCustom.listClass
					}).appendTo( $fauxSelect ).hide(),

					$dropdownButton = $('<div />', {
						'class': o.elAttrNames.dropdownButtonClass
					}).appendTo( $fauxSelect );

				// For each option, create a fauxOption
				$elOptions.each( function( i ) {
					$('<div />', {
						'class': i == 0 ? o.elAttrNames.typeCustom.activeItemClass + ' ' + o.elAttrNames.typeCustom.itemClass : o.elAttrNames.typeCustom.itemClass,
						'text': $(this).text()
					})
						.data(NosUIApp.namespace + '-selected', $(this).prop('selected'))
						.appendTo( $fauxSelectList );
				});

				var $fauxOptions = $fauxSelect.find('.' + o.elAttrNames.typeCustom.itemClass),
					$fauxSelectedOption = $fauxOptions.filter(function(){
						return $(this).data(NosUIApp.namespace + '-selected');
					});

				// Add first/last classes to faux o
				$fauxOptions.first().addClass(o.elAttrNames.typeCustom.firstItemClass);
				$fauxOptions.last().addClass(o.elAttrNames.typeCustom.lastItemClass);

				// If nothing is selected, select the first in the list
				if(!$fauxSelectedOption.length){
					$fauxSelectedOption = $fauxOptions.eq(0);
				}

				// Adding select placeholder text
				var $placeholder = $('<div />', {
					'class': o.elAttrNames.placeholderClass,
					'text': $fauxSelectedOption.text()
				}).insertBefore( $fauxSelectList );

				NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass);

				// Event Callback
				if(typeof o.onInit === 'function') {
					o.onInit($el, $fauxSelect, o);
				};

				// Faux select Events
				$fauxSelect.on({
					'click.nosui-form-select': function(e) {
						// Return if select is disabled
						if(NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass) === true) {
							return;
						};

						if(typeof o.onClick === 'function') {
							o.onClick($el, $fauxSelect, o);
						};

						toggleDropdown($fauxSelect); // Toggle list
					},
					'mousedown.nosui-form-select': function(e) {
						//e.stopPropagation();

						// Apply disabled styled if disabled
						// returns false if disabled.
						// If disabled stop running the function
						if(NosUIApp.form.isDisabled($el, $fauxSelect, o.elAttrNames.disabledClass)){
							return;
						};

						// This is to stop the body mouse down event from firing
						// when the list is open. This causes a click on the list
						// when open to close and re-open
						if(o.isOpen){
							e.stopPropagation();
						};

						$fauxSelect.addClass(o.elAttrNames.mousedownClass);

						// Prevent bug where checkbox can be left selected
						$('body').on('mouseup.nosui-form-select', function(e){
							$fauxSelect.removeClass(o.elAttrNames.mousedownClass);

							// Remove event
							$('body').off('mouseup.nosui-form-select');
						});

						// Event Callback
						if(typeof o.onMousedown === 'function') {
							o.onMousedown($el, $fauxSelect, o);
						};
					},
					'mouseup.nosui-form-select': function(e) {
						$fauxSelect.removeClass(o.elAttrNames.mousedownClass);

						// Remove event
						$('body').off('mouseup.nosui-form-select');
					}
				});

				// Click functionality for fauxOption elements
				$fauxOptions.on({
					'mousedown.nosui-form-select': function(e) {
						var $this = $(this),
							index = $this.index(),
							text = $this.text();

						$this.addClass(o.elAttrNames.typeCustom.activeItemClass).data('nosui-selected', 'selected')
							.siblings().removeClass(o.elAttrNames.typeCustom.activeItemClass).data('nosui-selected', null);
						$placeholder.text(text);

						// Change selected item on the select menu
						$elOptions.prop('selected', false)
							.eq(index).prop('selected', true);
						$fauxOptions.data(NosUIApp.namespace + 'selected', false)
							.eq(index).data(NosUIApp.namespace + 'selected', true);

						// Force the default element change event to fire
						// This is for consistency with the defaultDropdown option
						$el.change();

						if(typeof o.onChange === 'function') {
							o.onChange($el, $fauxSelect, o);
						};

						//toggleDropdown($fauxSelect); // Toggle list
					}
				}); // .select li.click

			};

		}); // each

	}, // nosFormSelect
	nosInputCheckbox: function(options, disableMethod){

		return this.each(function(){

			var defaults = {
					elAttrNames: {
						'fauxElClass'   : '',
						'disabledClass' : '--disabled',
						'checkedClass'  : '--checked',
						'mousedownClass': '--mousedown'
					},
					namespace: 'nosui-form-checkbox',
					onInit: null,
					onClick: null,
					onMousedown: null
				},
				o = NosUIApp.defineOptions(defaults, options),
				$el = $(this);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="checkbox"]'), $el);

			if(disableMethod === true){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.prev('.' + o.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				$el.show(); // Show the element

				return;
			};

			var $fauxCheckbox = $('<div />', {
					'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.inputClass
				})
				.data('nosui-checked', $el.prop('checked'))
				.insertBefore( $el.hide() );

			NosUIApp.form.isDisabled($el, $fauxCheckbox, o.elAttrNames.disabledClass);

			// Force fauxEl to match the checked state of the
			// input on init
			if($el.prop('checked')){
				$fauxCheckbox.addClass(o.elAttrNames.checkedClass);
			};

			// Event Callback
			if(typeof o.onInit === 'function') {
				o.onInit($el, $fauxCheckbox, options);
			};

			$fauxCheckbox.on({
				'click.nosui': function(e){
					// This applies disabled styled if disabled
					// returns false.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxCheckbox, o.elAttrNames.disabledClass)){
						return;
					};

					var $this = $(this);

					$this.toggleClass(o.elAttrNames.checkedClass);

					// Toggle Attribute
					if($el.prop('checked')){
						$el.prop('checked', false);
						$this.data('nosui-checked', false);
					} else {
						$el.prop('checked', true);
						$this.data('nosui-checked', true);
					};

					if(typeof o.onClick === 'function') {
						o.onClick($el, $fauxCheckbox, options);
					};
				},
				'mousedown.nosui': function(e) {
					// This applies disabled styled if disabled
					// returns false.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxCheckbox, o.elAttrNames.disabledClass)){
						return;
					};

					$fauxCheckbox.addClass(o.elAttrNames.mousedownClass);

					// Prevent bug where checkbox can be left selected
					$('body').on('mouseup.nosui', function(e){
						$fauxCheckbox.removeClass(o.elAttrNames.mousedownClass);

						// Remove event
						$('body').off('mouseup.nosui');
					});

					// Event Callback
					if(typeof o.onMousedown === 'function') {
						o.onMousedown($el, $fauxCheckbox, options);
					};
				},
				'mouseup.nosui': function(e) {
					$fauxCheckbox.removeClass(o.elAttrNames.mousedownClass);

					// Remove event
					$('body').off('mouseup.nosui');
				}
			});

		}); // this.each()

	}, // nosFormCheckbox()
	nosInputRadio: function(options, disableMethod){

		return this.each(function(i, el){

			var defaults = {
					elAttrNames: {
						'fauxElClass'    : '',
						'inputClass'     : '-text',
						'disabledClass'  : '--disabled',
						'checkedClass'   : '--checked',
						'mousedownClass' : '--mousedown'
					},
					namespace: 'nosui-form-radio',
					onInit: null,
					onClick: null,
					onMousedown: null
				},
				o = NosUIApp.defineOptions(defaults, options),
				$el = $(el);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="radio"]'), $el);

			if(disableMethod === true){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.prev('.' + o.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				$el.show(); // Show the element

				return;
			};

			var elName = $el.attr('name'),
				$elContainerForm = $el.closest('form').length ? $el.closest('form') : $('body'),
				$elSiblings = $elContainerForm.find('input[type="radio"]').filter(function(){
					return $(this).attr('name') == elName;
				}).not($el),
				$fauxRadio = $('<div />', {
					'class': o.elAttrNames.fauxElClass
				})
					.data(NosUIApp.namespace + '-name', elName)
					.data(NosUIApp.namespace + '-checked', $el.prop('checked')) // Copy element checked property value
					.insertBefore( $el.hide() );

			// Force fauxEl to match the checked state of the
			// input on init
			if($fauxRadio.data(NosUIApp.namespace + '-checked')){
				$fauxRadio.addClass(o.elAttrNames.checkedClass);
			};

			// This applies disabled styled if disabled
			// returns false.
			// If disabled stop running the function
			if(NosUIApp.form.isDisabled($el, $fauxRadio, o.elAttrNames.disabledClass)){
				return;
			};

			// Event Callback
			if(typeof o.onInit === 'function') {
				o.onInit($el, $fauxRadio, o);
			};

			$fauxRadio.on({
				'click.nosui': function(e){
					// Apply disabled styled if disabled
					// returns false if disabled.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxRadio, o.elAttrNames.disabledClass)){
						return;
					};

					// Faux siblings must be defined after all fauxSiblings hvae been created
					// i.e. on click should be enough time
					var $fauxSiblings =
							$elContainerForm
							.find('.' + o.elAttrNames.fauxElClass)
							.filter(function(){
								if($(this).data(NosUIApp.namespace + '-name') == elName){
									return true
								} else {
									return false;
								};
							})
							.not($fauxRadio);

					$fauxRadio.addClass(o.elAttrNames.checkedClass);
					$fauxSiblings.removeClass(o.elAttrNames.checkedClass);

					// Check radio
					$el.prop('checked', true);
					$fauxRadio.data(NosUIApp.namespace + '-checked', true);

					// Uncheck siblings
					$elSiblings.prop('checked', false);
					$fauxSiblings.data(NosUIApp.namespace + '-checked', false);

					if(typeof o.onClick === 'function') {
						o.onClick($el, $fauxRadio, o);
					};
				},
				'mousedown.nosui': function(e) {
					// Apply disabled styled if disabled
					// returns false if disabled.
					// If disabled stop running the function
					if(NosUIApp.form.isDisabled($el, $fauxRadio, o.elAttrNames.disabledClass)){
						return;
					};

					$fauxRadio.addClass(o.elAttrNames.mousedownClass);

					// Prevent bug where checkbox can be left selected
					$('body').on('mouseup.nosui', function(e){
						$fauxRadio.removeClass(o.elAttrNames.mousedownClass);

						// Remove event
						$('body').off('mouseup.nosui');
					});

					// Event Callback
					if(typeof o.onMousedown === 'function') {
						o.onMousedown($el, $fauxRadio, o);
					};
				},
				'mouseup.nosui': function(e) {
					$fauxRadio.removeClass(o.elAttrNames.mousedownClass);

					// Remove event
					$('body').off('mouseup.nosui');
				}
			});
		});

	}, // nosFormRadio()
	nosInputFile: function( options, disableMethod ){

		return this.each(function(){

			var defaults = {
					elAttrNames: {
						'elClass'         : '__element',
						'fauxElClass'     : '',
						'disabledClass'   : '--disabled',
						'buttonClass'     : '__button',
						'placeholderClass': '__placeholder'
					},
					namespace: 'nosui-form-file',
					placeholderText: 'No file chosen',
					buttonText: 'Choose File',
					onInit: null,
					onChange: null
				},
				o = NosUIApp.defineOptions(defaults, options),
				$el = $(this);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="file"]'), $el);

			if(disableMethod === true){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.off('change.nosui')
					.removeClass(o.elAttrNames.elClass)
					.siblings().remove() // Remove button/placeholder
					.end().unwrap('.' + o.elAttrNames.fauxElClass); // Remove fauxEl

				return;
			};

			$el.addClass(o.elAttrNames.elClass);

			var $fauxInputFile = $('<div />', {
					'class': o.elAttrNames.fauxElClass
				}),
				$placeholder = $('<div />', {
					'class': o.elAttrNames.placeholderClass,
					'text': o.placeholderText
				}),
				$button = $('<div />', {
					'class': o.elAttrNames.buttonClass,
					'text': o.buttonText
				});

			NosUIApp.form.isDisabled($el, $fauxInputFile, o.elAttrNames.disabledClass);

			$el.wrap( $fauxInputFile ).before( $placeholder, $button );

			// Event Callback
			if(typeof o.onInit === 'function') {
				o.onInit($el, $fauxCheckbox, o);
			};

			$el.on({
				'change.nosui': function(){
					$placeholder.text( $el.val() );

					if(typeof o.onChange === 'function') {
						o.onChange($el, $fauxInputFile, o);
					};
				}
			});

		}); // return this.each

	}, // nosFormRadio()
	nosTooltip: function( options ){

		return this.each(function(){

			var defaults = {
					elAttrNames: {
						'popup'    : 'nosui-tooltip__popup',
						'container': 'nosui-tooltip',
						'dataName' : 'nosui-tooltip'
					},
					text: null
				},
				o          = NosUIApp.defineOptions(defaults, options),
				$el        = $(this),
				$container = $('<div />', {
					'class' : o.elAttrNames.container
				}),
				$tooltip = $('<div />', {
					'class': o.elAttrNames.popup,
					'text' : o.text ? o.text : $el.data(o.elAttrNames.dataName)
				});

			$el.wrap($container).after($tooltip);

		}); // return this.each

	}, // nosTooltip()
	nosResponsiveImages: function( options, disableMethod ){

		var minResponsiveWidth = 0;

		// Sets the data jQuery attributes of the obj
		function setDataAttr($el){
			var responsiveStateList = [],
				attrList = $el.get(0).attributes,
				attrMap = {};

			for (a = 0; a < attrList.length; a++) {
				var attrKey = attrList[a].name.toLowerCase(),
					attrVal = attrList[a].value;

				if(attrKey.indexOf('data-') !== -1){
					attrKey = attrKey.substring(5);
				} else {
					// Don't add attribute to the list
					continue;
				}

				$el.data(attrKey);
				attrMap[attrKey] = attrVal;
			}

			// If attributes on element exist
			if(!jQuery.isEmptyObject(attrMap)){
				$el.data('src-' + minResponsiveWidth, $el.attr('src'))
				attrMap['src-' + minResponsiveWidth] = $el.attr('src');
			};

			return !jQuery.isEmptyObject(attrMap);
		};

		function setImage(){

			var windowWidth = $(window).width();

			$.each(NosUIApp.elList.responsiveImages, function(i, $respEl){

				var dataAttr = $respEl.data(),
					// Set activeResponseWidth to minimum by default
					activeResponsiveWidth = minResponsiveWidth;

				// For each data-src-num attribute
				$.each(dataAttr, function(k, v){
					var keyWidth = parseFloat(k.substring(3));

					// If larger than the current `keyWidth` and smaller than
					// the current `windowWidth`
					if(keyWidth > activeResponsiveWidth && keyWidth < windowWidth){
						activeResponsiveWidth = keyWidth;
					}
				});

				var newSrc = $respEl.data('src-' + activeResponsiveWidth);

				// Set new image
				$respEl.attr('src', newSrc);
			});
		};

		var $window = $(window),
			windowWidth = $window.width(),
			lastElIndex = this.length -1,
			scrollTimeout;

		// Always disable resize event incase it runs multiple times
		$window.off('resize.nosui-responsive-image').on('resize.nosui-responsive-image', function(){
			if(typeof scrollTimeout !== 'undefined'){
				window.clearTimeout(scrollTimeout);
			};

			// Set a timeout so the function doesn't run too often
			scrollTimeout = window.setTimeout(setImage, 200);
		});

		// for each item targetted by the user
		return this.each(function(i, $el){

		var defaults = {
				elAttrNames: {
					'elClass': ''
				},
				minResponsiveWidth: 0,
				namespace: 'nosui-responsive-image'
			},
			o = NosUIApp.defineOptions(defaults, options),
			$el = $(this);

			// Disable method if var is true
			if(disableMethod){
				$el.attr('src', $el.data('src-' + minResponsiveWidth)).removeClass(o.elAttrNames.elClass);

				// Remove elements from the list
				NosUIApp.elList.responsiveImages = $.grep( NosUIApp.elList.responsiveImages, function($grepEl,i){
					return $grepEl.get(0) !== $el.get(0);
				});

				return;
			};

			// Set the jQuery data attr
			var elAttributesExist = setDataAttr($el);

			if(elAttributesExist === false){
				return;
			}

			$el.addClass(o.elAttrNames.elClass);

			NosUIApp.matchElType($('img'), $el);

			// Push $el to the nosui responsive element array
			NosUIApp.elList.responsiveImages.push($el)

			// If this is the last item, set all images to
			// their correct state.
			if(i === lastElIndex){
				setImage();
			};
		});
	},
	nosInputRange: function( options, disableMethod ){
		return this.each(function(){

			var defaults = {
					elAttrNames: {
						'elClass'    : '-element',
						'fauxElClass': '',
						'container'  : '',
						'sliderClass': '__slider',
						'handleClass': '__handle'
					},
					namespace: 'nosui-input-range',
					timeoutThrottle: 0,
					onInit: null,
					onChange: null
				},
				$el = $(this),
				o   = NosUIApp.defineOptions(defaults, options);

			// Match element or throw error
			NosUIApp.matchElType($('input'), $el);

			if(disableMethod === true){
				// Changing the data on the element to
				// reflect that it has been disabled
				$el.prev().off()
					.children().off();
				$el.prev().remove();

				return;
			};

			// Setting options
			o.stepVal = $el.attr('step') ? parseFloat($el.attr('step')) : 1;
			// Set default min/max val whether it's been set or not
			o.minVal = $el.attr('min') ? parseFloat($el.attr('min')) : 0;
			o.maxVal = $el.attr('max') ? parseFloat($el.attr('max')) : 100;
			if(o.minVal > o.maxVal){
				o.maxVal = o.minVal;
			};
			// According to MDN (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)
			// value: min + (max-min)/2, or min if max is less than min
			o.valueVal = $el.val() ? parseFloat($el.val()) : o.minVal + (o.maxVal - o.minVal)/2;
			if(o.valueVal < o.minVal){
				o.valueVal = o.minVal;
			} else if(o.valueVal > o.maxVal){
				o.valueVal = o.maxVal;
			};

			// Setting variables
			var $body   = $('body'),
				$fauxEl = $('<div />', {
					'class': o.elAttrNames.fauxElClass
				}),
				$slider = $('<div />', {
					'class': o.elAttrNames.sliderClass
				}).appendTo($fauxEl),
				$handle = $('<div />', {
					'class': o.elAttrNames.handleClass
				}).appendTo($fauxEl);

			// Define functions
			function nextStep(percVal){
				var stepPerc = (o.stepVal / (o.maxVal - o.minVal)) * 100,
					rem = percVal % stepPerc;

				if (rem <= (stepPerc/2)) {
					return percVal - rem;
				} else {
					return percVal + stepPerc - rem;
				};
			};

			function setPosition(xPos){
				var fauxElWidth = $fauxEl.width(),
					// Get percentage value
					xPerc = (xPos/fauxElWidth) * 100,
					// Filter the percentage through the step
					xPerc = nextStep(xPerc);

				if(xPerc < 0){
					xPerc = 0;
				} else if(xPerc > 100){
					xPerc = 100;
				};

				// Get correct slider value
				o.valueVal = Math.round(((o.maxVal - o.minVal) * xPerc/100) + o.minVal);
				// Set val and trigger change for external plugins
				$el.val(o.valueVal).trigger('change');

				$handle.css('left', xPerc + '%');

				// onChange
				if(typeof o.onChange === 'function') {
					o.onChange($el, $fauxEl, o);
				};
			};

			function reflectInputVal(e){
				var valPos = nextStep(
					(($el.val() - o.minVal) / (o.maxVal - o.minVal)) * 100 // percentage val
				);

				$handle.css('left', valPos + '%')
			}

			function init(){
				// Dom manipulation and events
				$el.hide().addClass(o.elAttrNames.elClass).val(o.valueVal).on({
					'change.nosui': reflectInputVal
				});
				$fauxEl.on({
					'click.nosui': function(e){
						var xPos = e.pageX - $fauxEl.offset().left;
						setPosition(xPos)
					}
				}).insertBefore( $el );

				// Set init slider position based on el
				reflectInputVal(o.valueVal);

				$handle.on({
					'click.nosui': function(e){
						e.preventDefault();
						e.stopPropagation();
					},
					'mousedown.nosui': function(e){
						e.preventDefault();

						$el.off('change.nosui')

						// Make sure that the handle position stays in the correct
						// position when you start dragging. This prevents a
						// handle "jump" bug
						var handleOffset = e.pageX - $handle.offset().left;

						$body.on({
							'mousemove.nosui': function(e){
								e.preventDefault(); // prevent text selection

								if(typeof o.timeoutThrottle !== 'undefined'){
									window.clearTimeout(o.timeoutThrottle);
								};

								o.timeoutThrottle = window.setTimeout(function(){
									// Get scroll handle percentage form left val
									var xPos = e.pageX - $fauxEl.offset().left;

									setPosition(xPos);
								}, 5);
							}
						});

						$body.on('mouseup.nosui', function(){
							$body.off('mousemove.nosui');
							$body.off('mouseup.nosui');

							// Turn reflection back on
							$el.on('change.nosui', reflectInputVal)
						});
					}
				});

				// onInit
				if(typeof o.onInit === 'function') {
					o.onInit($el, $fauxEl, o);
				};
			}; // init

			init();
		});
	}
});

})( jQuery );
