/*
* jQuery NOs 0.9.12
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ) {

window.NosUIApp = {
	namespace: 'nosui',
	defineOptions: function(defaults, options){
		// both don't exist
		if(typeof options !== 'object' && typeof defaults !== 'object'){
			return NosUIApp.createPrivateMethods({});

		// both exist
		} else if(typeof options === 'object' && typeof defaults === 'object'){
			$.extend(true, defaults, options);

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.namespace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNamespace(defaults.elAttrNames, defaults.namespace);
			};

			return NosUIApp.createPrivateMethods(defaults);

		// if options doesn't exist
		} else if(typeof options !== 'object'){

			if(typeof defaults.elAttrNames === 'object' && typeof defaults.namespace === 'string'){
				// Apply namespace to class names
				NosUIApp.applyCssNamespace(defaults.elAttrNames, defaults.namespace);
			};

			return NosUIApp.createPrivateMethods(defaults);

		// If defaults doesn't exist - should cover everything
		} else if(typeof defaults !== 'object'){
			return NosUIApp.createPrivateMethods(options);
		};
	},
	createPrivateMethods: function(obj){
		obj._dom = {};
		// This is used to prevent stackoverflows within callbacks
		obj._stackOverflow = 0;
		return obj;
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
					elAttrNames: {
						elClass: '',
						hasPlaceholderClass: '--placeholder-active'
					},
					namespace: 'nosui-input-placeholder',
					placeholder: null
				},
				o = NosUIApp.defineOptions(defaults, options);

			o._dom.$el = $(this);
			NosUIApp.matchElType($('input'), o._dom.$el);

			if(disableMethod === true){
				disable();
				return;
			}

			function disable(){
				o._dom.$el.off().removeClass(o.elAttrNames.hasPlaceholderClass).val('');
			};

			function init(){
				if(typeof o.placeholder === 'string') {
					o._dom.$el.attr('placeholder', o.placeholder);
				};

				o._dom.val = o._dom.$el.attr('placeholder');

				// The value hasn't been defined
				// and cannot be guessed either.
				// Everything should stop here
				if(typeof o._dom.val !== 'string') {
					return;
				};

				// Set value
				o._dom.$el.addClass(o.elAttrNames.elClass);
				blurInput();
			};

			function focusInput(){
				// Focus Callback
				if(typeof o.onFocus === 'function') {
					o.onFocus(o._dom.$el);
				};

				if(o._dom.$el.val() == o._dom.val){
					o._dom.$el.removeClass(o.elAttrNames.hasPlaceholderClass).val('')
				};
			};

			function blurInput(){
				// Blur Callback
				if(typeof o.onBlur === 'function') {
					o.onBlur(o._dom.$el);
				};

				if(o._dom.$el.val() == ''){
					o._dom.$el.addClass(o.elAttrNames.hasPlaceholderClass).val(o._dom.val)
				};
			};

			function events(){
				// Turn off functions
				// Incase this is called twice
				o._dom.$el.off({
					'focus.nosui-placeholder': focusInput,
					'blur.nosui-placeholder': blurInput
				});

				// Turn on functions
				o._dom.$el.on({
					'focus.nosui-placeholder': focusInput,
					'blur.nosui-placeholder': blurInput
				});
			};

			init();
			events();

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
				};

			// Ensure options is an object
			if(!options || typeof options !== 'object') options = {};

			// If namespace has already been set, make sure it stays the same
			if(typeof $(this).data('nosui-namespace') === 'string'){
				options.namespace = $(this).data('nosui-namespace');
			};

			var o = NosUIApp.defineOptions(defaults, options);
			o._dom.$el = $(this);

			// Match element or throw error
			NosUIApp.matchElType($('select'), o._dom.$el);

			// Restore element back to original state
			if(disableMethod === true && o._dom.$el.data(o.elAttrNames.dataName) == 'custom'){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.removeClass(o.elAttrNames.elClass).data(o.elAttrNames.dataName, null).show();

				// Turn off fauxEl and fauxOptions events
				o._dom.$el.prev().off() // turn off fauxEl events
					.find('.' + o.elAttrNames.typeCustom.itemClass).off() //turn off fauxOption events
					.end().remove(); // remove fauxEl
				return;
			} else if(disableMethod === true){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.removeClass(o.elAttrNames.elClass).data(o.elAttrNames.dataName, null).off({
					'click.nosui-form-select': null,
					'change.nosui-form-select': null,
					'blur.nosui-form-select': null
				}).siblings().remove() // remove placeholder and button
				o._dom.$el.unwrap();

				return;
			};

			o._dom.$elOptions = o._dom.$el.find('option');
			o._dom.$selectedOption = o._dom.$elOptions.filter(function(){
					return $(this).prop('selcted') === true;
				});

			o._dom.$el.addClass(o.elAttrNames.elClass)
				.data('nosui-namespace', o.namespace)

			if ( o.defaultDropdown == true ) {
				function initDefault(){

					// Adding element physical properties
					o._dom.$el.data(o.elAttrNames.dataName, 'default')
						.addClass(o.elAttrNames.elClass)
						.wrap(
							$('<div />', {
								'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.typeDefault.defaultClass,
								'id': o._dom.$el.attr('id') ? o.elAttrNames.fauxElClass + '-' + o._dom.$el.attr('id') : ''
							})
						);

					// Creating variables and dom elements
					o._dom.elName = o._dom.$el.attr('name') ? o._dom.$el.attr('name') : null;
					o._dom.$fauxSelect = o._dom.$el.parent();

					o._dom.$fauxSelect.data('name', o._dom.elName);

					var placeholderText = o._dom.$selectedOption.length ? o._dom.$selectedOption.text() : o._dom.$elOptions.first().text();
						// Adding select placeholder text
					o._dom.$placeholder = $('<div />', {
						'class': o.elAttrNames.placeholderClass,
						'text': placeholderText
					}).prependTo( o._dom.$fauxSelect ),

					o._dom.$dropdownButton = $('<div />', {
						'class': o.elAttrNames.dropdownButtonClass
					}).insertAfter( o._dom.$placeholder );

					// Applied for disabled styling if applied
					NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass);

					// Event Callback
					if(typeof o.onInit === 'function') {
						o.onInit(o._dom.$el, o._dom.$fauxSelect, o);
					};

				} // initDefault

				function eventsDefault(){
					o._dom.$el.on({
						'focus.nosui-form-select': function(e) {
							// Applied for disabled styling if applied
							NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass);
							o._dom.$fauxSelect.toggleClass( o.elAttrNames.activeClass );

							// Event Callback
							if(typeof o.onClick === 'function') {
								o.onClick(o._dom.$el, o._dom.$fauxSelect, o);
							};
						},
						'change.nosui-form-select': function(e) {
							o._stackOverflow++;
							var text = o._dom.$el.find(':selected').text();
							o._dom.$placeholder.text(text);

							// Event Callback
							if(typeof o.onChange === 'function' && o._stackOverflow <= 1) {
								o.onChange(o._dom.$el, o._dom.$fauxSelect, o);
							};
							o._stackOverflow = 0;
						},
						'blur.nosui-form-select': function(e) {
							o._dom.$fauxSelect.removeClass( o.elAttrNames.activeClass );

							// Event Callback
							if(typeof o.onBlur === 'function') {
								o.onBlur(o._dom.$el, o._dom.$fauxSelect, o);
							};
						}
					});
				};

				initDefault();
				eventsDefault();

			} else {
				function initCustom(){
					// Set data for plugin
					o._dom.$el.data(o.elAttrNames.dataName, 'custom');

					// Set vars
					o._dom.elName = o._dom.$el.attr('name') ? o._dom.$el.attr('name') : null,
					o._dom.$fauxSelect = $('<div />', {
						'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.typeCustom.defaultClass,
						'id': o._dom.$el.attr('id') ? o.elAttrNames.fauxElClass + '-' + o._dom.$el.attr('id') : ''
					}).data('name', o._dom.elName);

					// Check if is disabled
					// If so add the necessary classes
					NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass);

					o._dom.$el.hide().before( o._dom.$fauxSelect );

					// Creating List
					o._dom.$fauxSelectList = $('<div />', {
						'class': o.elAttrNames.typeCustom.listClass
					}).appendTo( o._dom.$fauxSelect ).hide();

					o._dom.$dropdownButton = $('<div />', {
						'class': o.elAttrNames.dropdownButtonClass
					}).appendTo( o._dom.$fauxSelect );

					// For each option, create a fauxOption
					o._dom.$elOptions.each( function( i ) {
						$('<div />', {
							'class': i == 0 ? o.elAttrNames.typeCustom.activeItemClass + ' ' + o.elAttrNames.typeCustom.itemClass : o.elAttrNames.typeCustom.itemClass,
							'text': $(this).text()
						})
							.data(NosUIApp.namespace + '-selected', $(this).prop('selected'))
							.appendTo( o._dom.$fauxSelectList );
					});

					o._dom.$fauxOptions = o._dom.$fauxSelect.find('.' + o.elAttrNames.typeCustom.itemClass);
					o._dom.$fauxSelectedOption = o._dom.$fauxOptions.filter(function(){
						return $(this).data(NosUIApp.namespace + '-selected');
					});

					// Add first/last classes to faux o
					o._dom.$fauxOptions.first().addClass(o.elAttrNames.typeCustom.firstItemClass);
					o._dom.$fauxOptions.last().addClass(o.elAttrNames.typeCustom.lastItemClass);

					// If nothing is selected, select the first in the list
					if(!o._dom.$fauxSelectedOption.length){
						o._dom.$fauxSelectedOption = $fauxOptions.eq(0);
					}

					// Adding select placeholder text
					o._dom.$placeholder = $('<div />', {
						'class': o.elAttrNames.placeholderClass,
						'text': o._dom.$fauxSelectedOption.text()
					}).insertBefore( o._dom.$fauxSelectList );

					NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass);

					// Event Callback
					if(typeof o.onInit === 'function') {
						o.onInit(o._dom.$el, o._dom.$fauxSelect, o);
					};

				}; // initCustom()

				function eventsCustom(){
					o._dom.$el.on({
						'change.nosui-form-select': function(e){
							reflectChange(e);
						}
					})

					// Faux select Events
					o._dom.$fauxSelect.on({
						'click.nosui-form-select': function(e) {
							// Return if select is disabled
							if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass) === true) {
								return;
							};

							if(typeof o.onClick === 'function') {
								o.onClick(o._dom.$el, o._dom.$fauxSelect, o);
							};

							toggleDropdown(o._dom.$fauxSelect); // Toggle list
						},
						'mousedown.nosui-form-select': function(e) {
							//e.stopPropagation();

							// Apply disabled styled if disabled
							// returns false if disabled.
							// If disabled stop running the function
							if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxSelect, o.elAttrNames.disabledClass)){
								return;
							};

							// This is to stop the body mouse down event from firing
							// when the list is open. This causes a click on the list
							// when open to close and re-open
							if(o.isOpen){
								e.stopPropagation();
							};

							o._dom.$fauxSelect.addClass(o.elAttrNames.mousedownClass);

							// Prevent bug where checkbox can be left selected
							$('body').on('mouseup.nosui-form-select', function(e){
								o._dom.$fauxSelect.removeClass(o.elAttrNames.mousedownClass);

								// Remove event
								$('body').off('mouseup.nosui-form-select');
							});

							// Event Callback
							if(typeof o.onMousedown === 'function') {
								o.onMousedown(o._dom.$el, o._dom.$fauxSelect, o);
							};
						},
						'mouseup.nosui-form-select': function(e) {
							o._dom.$fauxSelect.removeClass(o.elAttrNames.mousedownClass);

							// Remove event
							$('body').off('mouseup.nosui-form-select');
						}
					});

					// Click functionality for fauxOption elements
					o._dom.$fauxOptions.on({
						'mousedown.nosui-form-select': function(e) {
							selectOption($(this));
						}
					}); // .select li.click
				}

				function toggleDropdown($fauxSelect) {
					// Toggle isOpen property
					if(o.isOpen == false){
						showDropdown(o._dom.$fauxSelect);
					} else {
						hideDropdown(o._dom.$fauxSelect)
					};
				};

				function showDropdown($fauxSelect) {

					o._dom.$fauxSelect.addClass(o.elAttrNames.activeClass);
					o._dom.$fauxSelectList.show();

					// This event must be `mousedown` instead of `click` otherwise
					// the select will immediately hide once clicked
					$('body').on('mousedown.nosui-form-select', function(e){
						hideDropdown(o._dom.$fauxSelect);
					});

					o.isOpen = true;
				};

				function hideDropdown($fauxSelect) {
					o._dom.$fauxSelectList.hide();

					o.isOpen = false;

					// This event must be `mousedown` instead of `click` otherwise
					// the select will immediately hide once clicked
					$('body').off('mousedown.nosui-form-select');

					o._dom.$fauxSelect.removeClass(o.elAttrNames.activeClass);
				};

				// Select option based on target faux option
				function selectOption($fauxOption){
					var index = $fauxOption.index(),
						text = $fauxOption.text();

					// Change selected item on the select menu
					o._dom.$elOptions.prop('selected', false)
						.eq(index).prop('selected', true);

					// Force the default element change event to fire
					// This is for consistency with the defaultDropdown option
					o._dom.$el.change();
				};

				// Reflect selected state element
				function reflectChange(e){
					o._stackOverflow++;

					o._dom.$selectedOption     = o._dom.$el.find('option:selected');
					var index                  = o._dom.$selectedOption.index();
					o._dom.$fauxSelectedOption = o._dom.$fauxOptions.eq(index);
					var text                   = o._dom.$fauxSelectedOption.text();

					o._dom.$fauxSelectedOption.addClass(o.elAttrNames.typeCustom.activeItemClass).data('nosui-selected', 'selected')
						.siblings().removeClass(o.elAttrNames.typeCustom.activeItemClass).data('nosui-selected', null);
					o._dom.$placeholder.text(text);

					// Change selected item on the select menu
					o._dom.$elOptions.prop('selected', false)
						.eq(index).prop('selected', true);
					o._dom.$fauxOptions.data(NosUIApp.namespace + 'selected', false)
						.eq(index).data(NosUIApp.namespace + 'selected', true);

					if(typeof o.onChange === 'function' && o._stackOverflow <= 1) {
						o.onChange(o._dom.$el, o._dom.$fauxSelect, o);
					};

					o._stackOverflow = 0;
				};

				// Run
				initCustom();
				eventsCustom();
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
					onChange: null,
					onMousedown: null
				},
				o = NosUIApp.defineOptions(defaults, options);

			o._dom.$el = $(this);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="checkbox"]'), o._dom.$el);

			if(disableMethod === true){
				disable();
				return;
			};

			function disable(){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.prev('.' + o.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				o._dom.$el.show(); // Show the element
			}

			function init(){
				o._dom.$fauxEl = $('<div />', {
						'class': o.elAttrNames.fauxElClass + ' ' + o.elAttrNames.inputClass
					})
					.data('nosui-checked', o._dom.$el.prop('checked'))
					.insertBefore( o._dom.$el.hide() );

				NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass);

				// Force fauxEl to match the checked state of the
				// input on init
				if(o._dom.$el.prop('checked')){
					o._dom.$fauxEl.addClass(o.elAttrNames.checkedClass);
				};

				// Event Callback
				if(typeof o.onInit === 'function') {
					o.onInit(o._dom.$el, o._dom.$fauxEl, o);
				};
			}

			function reflectChange(e){
				o._stackOverflow++;

				// Toggle Attribute
				if(o._dom.$el.prop('checked')){
					o._dom.$el.data('nosui-checked', true);
					o._dom.$fauxEl.addClass(o.elAttrNames.checkedClass);
				} else {
					o._dom.$el.data('nosui-checked', false);
					o._dom.$fauxEl.removeClass(o.elAttrNames.checkedClass);
				};

				if(typeof o.onChange === 'function' && o._stackOverflow <= 1) {
					o.onChange(o._dom.$el, o._dom.$fauxEl, o);
				};

				o._stackOverflow = 0;
			};

			function events(){
				o._dom.$el.on({
					'change.nosui': reflectChange
				});

				o._dom.$fauxEl.on({
					'click.nosui': function(e){
						// This applies disabled styled if disabled
						// returns false.
						// If disabled stop running the function
						if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass)){
							return;
						};

						// Toggle Attribute
						if(o._dom.$el.prop('checked')){
							o._dom.$el.prop('checked', false);
						} else {
							o._dom.$el.prop('checked', true);
						};

						o._dom.$el.change();
					},
					'mousedown.nosui': function(e) {
						// This applies disabled styled if disabled
						// returns false.
						// If disabled stop running the function
						if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass)){
							return;
						};

						o._dom.$fauxEl.addClass(o.elAttrNames.mousedownClass);

						// Prevent bug where checkbox can be left selected
						$('body').on('mouseup.nosui', function(e){
							o._dom.$fauxEl.removeClass(o.elAttrNames.mousedownClass);

							// Remove event
							$('body').off('mouseup.nosui');
						});

						// Event Callback
						if(typeof o.onMousedown === 'function') {
							o.onMousedown(o._dom.$el, o._dom.$fauxEl, o);
						};
					},
					'mouseup.nosui': function(e) {
						o._dom.$fauxEl.removeClass(o.elAttrNames.mousedownClass);

						// Remove event
						$('body').off('mouseup.nosui');
					}
				});
			};

			init();
			events();

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
					onChange: null,
					onMousedown: null
				},
				o = NosUIApp.defineOptions(defaults, options);

			o._dom.$el = $(el);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="radio"]'), o._dom.$el);

			if(disableMethod === true){
				disable();
				return;
			};

			function disable(){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.prev('.' + o.elAttrNames.fauxElClass).off() // Turn off fauxEl events
					.remove(); // Remove fauxEl
				o._dom.$el.show(); // Show the element
			};

			function init(){
				o._dom.elName           = o._dom.$el.attr('name');
				o._dom.$elContainerForm = o._dom.$el.closest('form').length ? o._dom.$el.closest('form') : $('body');
				o._dom.$elSiblings      = o._dom.$elContainerForm.find('input[type="radio"]').filter(function(){
						return $(this).attr('name') == o._dom.elName;
					}).not(o._dom.$el);
				o._dom.$fauxEl = $('<div />', {
					'class': o.elAttrNames.fauxElClass
				})
					.data(NosUIApp.namespace + '-name', o._dom.elName)
					.data(NosUIApp.namespace + '-checked', o._dom.$el.prop('checked')) // Copy element checked property value
					.insertBefore( o._dom.$el.hide() );

				// Force fauxEl to match the checked state of the
				// input on init
				if(o._dom.$fauxEl.data(NosUIApp.namespace + '-checked')){
					o._dom.$fauxEl.addClass(o.elAttrNames.checkedClass);
				};

				// This applies disabled styled if disabled
				// returns false.
				// If disabled stop running the function
				if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass)){
					return;
				};

				// Event Callback
				if(typeof o.onInit === 'function') {
					o.onInit(o._dom.$el, o._dom.$fauxEl, o);
				};
			};

			function reflectChange(e){
				o._stackOverflow++;
				// Faux siblings must be defined after all fauxSiblings hvae been created
				// i.e. on click should be enough time
				o._dom.$fauxSiblings = o._dom.$elContainerForm
					.find('.' + o.elAttrNames.fauxElClass)
					.filter(function(i, el){
						if($(el).data(NosUIApp.namespace + '-name') == o._dom.elName){
							return true
						} else {
							return false;
						};
					})
					.not(o._dom.$fauxEl);

				// Uncheck siblings
				o._dom.$fauxSiblings.data(NosUIApp.namespace + '-checked', false).removeClass(o.elAttrNames.checkedClass);

				// Check radio
				o._dom.$fauxEl.data(NosUIApp.namespace + '-checked', true).addClass(o.elAttrNames.checkedClass);

				if(typeof o.onChange === 'function' && o._stackOverflow <= 1) {
					o.onChange(o._dom.$el, o._dom.$fauxEl, o);
				};

				o._stackOverflow = 0;
			};

			function events(){
				o._dom.$el.on({
					'change.nosui': reflectChange
				});

				o._dom.$fauxEl.on({
					'click.nosui': function(e){
						// Apply disabled styled if disabled
						// returns false if disabled.
						// If disabled stop running the function
						if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass)){
							return;
						};

						// Uncheck siblings
						o._dom.$elSiblings.prop('checked', false);

						// Check radio
						o._dom.$el.prop('checked', true);

						reflectChange(e);
					},
					'mousedown.nosui': function(e) {
						// Apply disabled styled if disabled
						// returns false if disabled.
						// If disabled stop running the function
						if(NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass)){
							return;
						};

						o._dom.$fauxEl.addClass(o.elAttrNames.mousedownClass);

						// Prevent bug where checkbox can be left selected
						$('body').on('mouseup.nosui', function(e){
							o._dom.$fauxEl.removeClass(o.elAttrNames.mousedownClass);

							// Remove event
							$('body').off('mouseup.nosui');
						});

						// Event Callback
						if(typeof o.onMousedown === 'function') {
							o.onMousedown(o._dom.$el, o._dom.$fauxEl, o);
						};
					},
					'mouseup.nosui': function(e) {
						o._dom.$fauxEl.removeClass(o.elAttrNames.mousedownClass);

						// Remove event
						$('body').off('mouseup.nosui');
					}
				});
			};

			init();
			events();
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
				o = NosUIApp.defineOptions(defaults, options);

			o._dom.$el = $(this);

			// Match element or throw error
			NosUIApp.matchElType($('input[type="file"]'), o._dom.$el);

			if(disableMethod === true){
				disable();
				return;
			};

			function disable(){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.off('change.nosui')
					.removeClass(o.elAttrNames.elClass)
					.siblings().remove() // Remove button/placeholder
					.end().unwrap('.' + o.elAttrNames.fauxElClass); // Remove fauxEl
			}

			function init(){
				o._dom.$el.addClass(o.elAttrNames.elClass);
				o._dom.$fauxEl = $('<div />', {
					'class': o.elAttrNames.fauxElClass
				});
				o._dom.$placeholder = $('<div />', {
					'class': o.elAttrNames.placeholderClass,
					'text': o.placeholderText
				});
				o._dom.$button = $('<div />', {
					'class': o.elAttrNames.buttonClass,
					'text': o.buttonText
				});

				NosUIApp.form.isDisabled(o._dom.$el, o._dom.$fauxEl, o.elAttrNames.disabledClass);

				o._dom.$el.wrap( o._dom.$fauxEl ).before( o._dom.$placeholder, o._dom.$button );

				// Event Callback
				if(typeof o.onInit === 'function') {
					o.onInit(o._dom.$el, o._dom.$fauxEl, o);
				};
			};

			function events(){
				o._dom.$el.on({
					'change.nosui': function(){
						o._dom.$placeholder.text( o._dom.$el.val() );

						if(typeof o.onChange === 'function') {
							o.onChange(o._dom.$el, o._dom.$fauxEl, o);
						};
					}
				});
			};

			init();
			events();

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
				o   = NosUIApp.defineOptions(defaults, options);

			o._dom.$el = $(this)

			// Match element or throw error
			NosUIApp.matchElType($('input'), o._dom.$el);

			if(disableMethod === true){
				disable();
				return;
			};

			function disable(){
				// Changing the data on the element to
				// reflect that it has been disabled
				o._dom.$el.show()
					.prev().off()
					.children().off();
				o._dom.$el.prev().remove();
			};

			// Ensure the value adheres to the max/min values
			function elValueFilter(){
				if(o.valueVal < o.minVal){
					o.valueVal = o.minVal;

					// Correct element value
					o._dom.$el.val(o.valueVal);
				} else if(o.valueVal > o.maxVal){
					o.valueVal = o.maxVal;

					// Correct element value
					o._dom.$el.val(o.valueVal);
				};
			};

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
				var fauxElWidth = o._dom.$fauxEl.width(),
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
				elValueFilter();

				// Set val and trigger change for external plugins
				o._dom.$el.val(o.valueVal).trigger('change');

				o._dom.$handle.css('left', xPerc + '%');

				// onChange
				if(typeof o.onChange === 'function') {
					o.onChange(o._dom.$el, o._dom.$fauxEl, o);
				};
			};

			function reflectInputVal(e){
				o.valueVal = o._dom.$el.val();
				elValueFilter();

				var valPos = nextStep(
					((o.valueVal - o.minVal) / (o.maxVal - o.minVal)) * 100 // percentage val
				);

				o._dom.$handle.css('left', valPos + '%')
			}

			function init(){
				// Setting options
				o.stepVal = o._dom.$el.attr('step') ? parseFloat(o._dom.$el.attr('step')) : 1;
				// Set default min/max val whether it's been set or not
				o.minVal = o._dom.$el.attr('min') ? parseFloat(o._dom.$el.attr('min')) : 0;
				o.maxVal = o._dom.$el.attr('max') ? parseFloat(o._dom.$el.attr('max')) : 100;
				if(o.minVal > o.maxVal){
					o.maxVal = o.minVal;
				};
				// According to MDN (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)
				// value: min + (max-min)/2, or min if max is less than min
				o.valueVal = o._dom.$el.val() ? parseFloat(o._dom.$el.val()) : o.minVal + (o.maxVal - o.minVal)/2;
				elValueFilter();

				// Setting variables
				o._dom.$fauxEl = $('<div />', {
						'class': o.elAttrNames.fauxElClass
					});
				o._dom.$slider = $('<div />', {
						'class': o.elAttrNames.sliderClass
					}).appendTo(o._dom.$fauxEl);
				o._dom.$handle = $('<div />', {
						'class': o.elAttrNames.handleClass
					}).appendTo(o._dom.$fauxEl);

				// Dom manipulation and events
				o._dom.$el.hide().addClass(o.elAttrNames.elClass).val(o.valueVal).on({
					'change.nosui': reflectInputVal
				});
				o._dom.$fauxEl.on({
					'click.nosui': function(e){
						var xPos = e.pageX - o._dom.$fauxEl.offset().left;
						setPosition(xPos)
					}
				}).insertBefore( o._dom.$el );

				// Set init slider position based on el
				reflectInputVal(o.valueVal);

				o._dom.$handle.on({
					'click.nosui': function(e){
						e.preventDefault();
						e.stopPropagation();
					},
					'mousedown.nosui': function(e){
						e.preventDefault();

						o._dom.$el.off('change.nosui')

						// Make sure that the handle position stays in the correct
						// position when you start dragging. This prevents a
						// handle "jump" bug
						var handleOffset = e.pageX - o._dom.$handle.offset().left;

						$('body').on({
							'mousemove.nosui': function(e){
								e.preventDefault(); // prevent text selection

								if(typeof o.timeoutThrottle !== 'undefined'){
									window.clearTimeout(o.timeoutThrottle);
								};

								o.timeoutThrottle = window.setTimeout(function(){
									// Get scroll handle percentage form left val
									var xPos = e.pageX - o._dom.$fauxEl.offset().left;

									setPosition(xPos);
								}, 5);
							}
						});

						$('body').on('mouseup.nosui', function(){
							$('body').off('mousemove.nosui');
							$('body').off('mouseup.nosui');

							// Turn reflection back on
							o._dom.$el.on('change.nosui', reflectInputVal)
						});
					}
				});

				// onInit
				if(typeof o.onInit === 'function') {
					o.onInit(o._dom.$el, o._dom.$fauxEl, o);
				};
			}; // init

			init();
		});
	}
});

})( jQuery );
