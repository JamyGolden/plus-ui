NOS (Native OS) UI is designed to make a minimial impact on the development environment. Changes to the custom form element states are mirrored on the actual form elements themselves, therefore no backend functionality needs to change to accomodate this. If javascript is disabled, the form should function as normal without the custom styling.

NOS UI is a library designed to help developers implement designs elements and functionality easily.

The form functionality

# Table of Contents
* [nosPlaceholder](#nosPlaceholder)
* [nosFormSelect](#nosFormSelect)
* [nosFormInputCheckbox](#nosFormInputCheckbox)
* [nosFormInputRadio](#nosFormInputRadio)
* [nosFormInputFile](#nosFormInputFile)
* [nosTooltip](#nosTooltip)

## <a id="nosPlaceholder"></a> nosPlaceholder
This is an HTML5 placeholder polyfill for input elements.

### Defualt options:
	$( el ).nosPlaceholder({
		placeholder: null
	});

If the `placeholder` property is null or left out the placeholder value will default to the HTML `placeholder` attribute value
### Typical usage
#### HTML
	<input type="text" placeholder="Name">

#### JS
	$(input[placeholder]).nosPlaceholder();

### Note
Remember to do some feature detection for `placeholder` support with something like [Modernizr](https://github.com/Modernizr/Modernizr).

## <a id="nosFormSelect"></a> nosFormSelect
asdasd sa dsa dsa

### Defualt options:
	$(el).nosFormSelect({
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
		},
		placeholer: function($el, $fauxEl){},
		onClick: function($el, $fauxEl){},
		onChange: function($el, $fauxEl){},
		onBlur: function($el, $fauxEl){}
	})

### Typical usage
	$('select').nosFormSelect();

## <a id="nosFormInputCheckbox"></a> nosFormInputCheckbox
### Defualt options:
	$(el).nosFormInputCheckbox({
		elAttrNames: {
			'fauxElClass'  : 'nosui-form-checkbox',
			'inputClass'   : 'nosui-form-input-text',
			'disabledClass': 'nosui-form-checkbox--disabled',
			'checkedClass' : 'nosui-form-checkbox--checked'
		},
		onClick: function($el, $fauxEl){}
	})

### Typical usage
	$('input[type="checkbox"]').nosFormInputCheckbox();

## <a id="nosFormInputRadio"></a> nosFormInputRadio
### Defualt options:
	$(el).nosFormInputRadio({
		elAttrNames: {
			'fauxElClass'  : 'nosui-form-radio',
			'inputClass'   : 'nosui-form-input-text',
			'disabledClass': 'nosui-form-radio--disabled',
			'checkedClass' : 'nosui-form-radio--checked',
			'dataName'     : 'nosui-form-radio-name'
		},
		onClick: function($el, $fauxEl){}
	})

### Typical usage
	$('input[type="radio"]').nosFormInputRadio();

## <a id="nosFormInputFile"></a> nosFormInputFile
### Defualt options:
	$(el).nosFormInputFile({
		elAttrNames: {
			'elClass'         : 'nosui-form-file__element',
			'fauxElClass'     : 'nosui-form-file',
			'disabledClass'   : 'nosui-form-file--disabled',
			'placeholderClass': 'nosui-form-file__placeholder'
		},
		placeholder: null,
		onChange: function($el, $fauxEl){}
	})

### Typical usage
	$('input[type="file"]').nosFormInputFile();

## <a id="nosTooltip"></a> nosTooltip
	$(el).nosTooltip({
		elAttrNames: {
			popup: 'nosui-tooltip__popup',
			'container': 'nosui-tooltip',
			'dataName': 'nosui-tooltip'
		}
	})

### Typical usage
	$('[data-nosui-tooltip]').nosTooltip();

# Changelog version 0.5:
Changed all elements to divs. The plugin shouldn't dictate the element
Updated to jQuery 1.9
added disable method functionality