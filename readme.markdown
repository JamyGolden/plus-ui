NOS (Native OS) UI is designed to make a minimial impact on the development environment. Changes to the custom form element states are mirrored on the actual form elements themselves, therefore no backend functionality needs to change to accomodate this. If javascript is disabled, the form should function as normal without the custom styling.

NOS UI is a library designed to help developers implement designs elements and functionality easily.

The form functionality

# Table of Contents
* [nosFormSelect](#nosformselect)
* [nosInputCheckbox](#nosinputcheckbox)
* [nosInputRadio](#nosinputradio)
* [nosInputPlaceholder](#nosinputplaceholder)
* [nosInputFile](#nosinputfile)
* [nosTooltip](#nostooltip)

## nosFormSelect
This method converts a normal html &lt;select&gt; menu into a custom stylable menu. Events on the custom menu are reflected on the original &lt;select&gt; menu and therefore work seamlessly with forms. onClick, onChange and onBlur callbacks exist for developers to extend the default functionality.

### Typical usage
	$('select').nosFormSelect();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosFormSelect({
		elAttrNames: { // List of attribute names used on the custom element
			typeCustom: { // Attr names for the custom dropdown menu
				'defaultClass'   : 'nosui-form-select--custom',
				'dataName'       : 'nosui-form-select-type-custom',
				'dataSelected'   : 'nosui-form-select-selected',
				'listClass'      : 'nosui-form-select__list',
				'itemClass'      : 'nosui-form-select__item',
				'activeItemClass': 'nosui-form-select__item--active'
			},
			typeDefault: { // Attr names for the default select dropdown option
				'defaultClass': 'nosui-form-select--default',
				'dataName'    : 'nosui-form-select-type-default'
			},
			'elClass'            : 'nosui-form-select__element', // Default element class
			'fauxElClass'        : 'nosui-form-select',
			'activeClass'        : 'nosui-form-select--active',
			'disabledClass'      : 'nosui-form-select--disabled',
			'dropdownButtonClass': 'nosui-form-select__dropdown-button',
			'placeholderClass'   : 'nosui-form-select__placeholder'
		},
		placeholder: function($el, $fauxEl){}, // Placeholder text if one doesn't already exist

		// In the callback functions, the $el parameter is the jQuery object of the 
		// original select element and $fauxEl is the jQuery object of the custom version
		onClick: function($el, $fauxEl){}, // Click event callback
		onChange: function($el, $fauxEl){}, // Change event callback
		onBlur: function($el, $fauxEl){} // Blur event callback
	})

All class names can be editted if required.

## nosInputCheckbox
### Typical usage
	$('input[type="checkbox"]').nosInputCheckbox();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosInputCheckbox({
		elAttrNames: {
			'fauxElClass'  : 'nosui-form-checkbox',
			'inputClass'   : 'nosui-form-input-text',
			'disabledClass': 'nosui-form-checkbox--disabled',
			'checkedClass' : 'nosui-form-checkbox--checked'
		},
		onClick: function($el, $fauxEl){}
	})

## nosInputRadio
### Typical usage
	$('input[type="radio"]').nosInputRadio();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosInputRadio({
		elAttrNames: {
			'fauxElClass'  : 'nosui-form-radio',
			'inputClass'   : 'nosui-form-input-text',
			'disabledClass': 'nosui-form-radio--disabled',
			'checkedClass' : 'nosui-form-radio--checked',
			'dataName'     : 'nosui-form-radio-name'
		},
		onClick: function($el, $fauxEl){}
	})

## nosInputPlaceholder
This is an HTML5 placeholder polyfill for input elements.

### Typical usage
#### HTML
	<input type="text" placeholder="Name">

#### JS
	$(input[placeholder]).nosInputPlaceholder();


### Default options:
	$( el ).nosInputPlaceholder({
		placeholder: null
	});

If the `placeholder` property is falsy the placeholder value will default to the HTML `placeholder` attribute value.

### Note
Remember to do some feature detection for `placeholder` support with something like [Modernizr](https://github.com/Modernizr/Modernizr).

## nosInputFile
### Typical usage
	$('input[type="file"]').nosInputFile();

### Default options:
	$(el).nosInputFile({
		elAttrNames: {
			'elClass'         : 'nosui-form-file__element',
			'fauxElClass'     : 'nosui-form-file',
			'disabledClass'   : 'nosui-form-file--disabled',
			'placeholderClass': 'nosui-form-file__placeholder'
		},
		placeholder: null,
		onChange: function($el, $fauxEl){}
	})

## nosTooltip
### Typical usage
	$('[data-nosui-tooltip]').nosTooltip();

### Default options:
	$(el).nosTooltip({
		elAttrNames: {
			popup: 'nosui-tooltip__popup',
			'container': 'nosui-tooltip',
			'dataName': 'nosui-tooltip'
		}
	})


# Changelog version 0.5:
Changed all elements to divs. The plugin shouldn't dictate the element
Updated to jQuery 1.9
added disable method functionality