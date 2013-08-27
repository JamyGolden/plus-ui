NOS (Native OS) UI is designed to make a minimial impact on the development environment. Changes to the custom form element states are mirrored on the actual form elements themselves, therefore no backend functionality needs to change to accomodate this. If javascript is disabled, the form should function as normal without the custom styling.

NOS UI is a library designed to help developers implement designs elements and functionality easily.

*Important things to note*:
* These methods should be applied to the HTML form elements themselves, not generic elements such as divs.

# Table of Contents
* [nosFormSelect](#nosformselect)
* [nosInputCheckbox](#nosinputcheckbox)
* [nosInputRadio](#nosinputradio)
* [nosInputPlaceholder](#nosinputplaceholder)
* [nosInputFile](#nosinputfile)
* [nosTooltip](#nostooltip)

## nosFormSelect
This method converts a normal html `<select>` menu into a custom stylable menu. Events on the custom menu are reflected on the original `<select>` menu and therefore work seamlessly on top of any form. 

`onClick`, `onChange` and `onBlur` callbacks exist for developers to extend the default functionality.

### Typical usage
	$('select').nosFormSelect();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosFormSelect({
		nameSpace: 'nosui-form-select', // Sets the name space for the HTML attributes
		elAttrNames: { // List of attribute names used on the custom element
			typeCustom: { // Attr names for the select dropdown options. (enabled by default)
				'defaultClass'   : '--custom',
				'dataName'       : '-type-custom',
				'dataSelected'   : '-selected',
				'listClass'      : '__list',
				'itemClass'      : '__item',
				'activeItemClass': '__item--active'
			},
			typeDefault: { // Attr names for the custom dropdown menu
				'defaultClass': '--default',
				'dataName'    : '-type-default'
			},
			'elClass'            : '-element',
			'fauxElClass'        : '',
			'activeClass'        : '--active',
			'disabledClass'      : '--disabled',
			'dropdownButtonClass': '__dropdown-button',
			'placeholderClass'   : '__placeholder'
		},
		isOpen: false,
		hideOnFocusLoss: true,

		// In the callback functions, the $el parameter is the jQuery object of the 
		// original select element and $fauxEl is the jQuery object of the custom version
		onInit: null, // Callback that fires after method has initialized
		onClick: null, // Click event callback
		onChange: null, // Change event callback. DefaultDropdown only
		onBlur: null // Blur event callback. DefaultDropdown only
	})

The `nameSpace` property is used to prepend the HTML attribute names - This allows to easily use multiple form elements on a page without CSS conflicts and specificity wars.

All class names can be editted if required.

## nosInputCheckbox
### Typical usage
	$('input[type="checkbox"]').nosInputCheckbox();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosInputCheckbox({
		nameSpace: 'nosui-form-checkbox', // Sets the name space for the HTML attributes
		elAttrNames: {
			'fauxElClass'  : '',
			'disabledClass': '--disabled',
			'checkedClass' : '--checked'
		},
		onClick: function($el, $fauxEl){}
	})

## nosInputRadio
### Typical usage
	$('input[type="radio"]').nosInputRadio();

### Default options:
These are the default options and the typical usage applies these by default. Any object, property or method that is changed here will overwrite the default version.

	$(el).nosInputRadio({
		nameSpace: 'nosui-form-radio', // Sets the name space for the HTML attributes
		elAttrNames: {
			'fauxElClass'  : '',
			'disabledClass': '--disabled',
			'checkedClass' : '--checked',
			'dataName'     : '-name'
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
		nameSpace: 'nosui-form-file', // Sets the name space for the HTML attributes
		elAttrNames: {
			'elClass'         : '__element',
			'fauxElClass'     : '',
			'disabledClass'   : '--disabled',
			'placeholderClass': '__placeholder'
		},
		placeholder: null,
		onChange: function($el, $fauxEl){}
	})

## nosTooltip
### Typical usage
	$('[data-nosui-tooltip]').nosTooltip();

### Default options:
	$(el).nosTooltip({
		nameSpace: 'nosui-tooltip', // Sets the name space for the HTML attributes
		elAttrNames: {
			popup: '__popup',
			'container': '',
			'dataName': ''
		}
	})


# Changelog version 0.5:
Changed all elements to divs. The plugin shouldn't dictate the element
Updated to jQuery 1.9
added disable method functionality