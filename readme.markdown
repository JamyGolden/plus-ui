# nosFramework

## nosPlaceholder
This is an HTML5 placeholder polyfill for input elements.

	$( el ).nosPlaceholder();
or
	$( el ).nosPlaceholder(); // el must have HTML5 placeholder attribute - this will be used as the val

### HTML required:
	<input type="text" />
Or
	<input type="text" placeholder="Placeholder Text" />

## nosFormSelect
###defualt options:

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

## nosFormInputCheckbox
###defualt options:

	elAttrNames: {
		'fauxElClass'  : 'nosui-form-checkbox',
		'inputClass'   : 'nosui-form-input-text',
		'disabledClass': 'nosui-form-checkbox--disabled',
		'checkedClass' : 'nosui-form-checkbox--checked'
	},
	onClick: function($el, $fauxEl){}

## nosFormInputRadio
###defualt options:

	elAttrNames: {
		'fauxElClass'  : 'nosui-form-radio',
		'inputClass'   : 'nosui-form-input-text',
		'disabledClass': 'nosui-form-radio--disabled',
		'checkedClass' : 'nosui-form-radio--checked',
		'dataName'     : 'nosui-form-radio-name'
	},
	onClick: function($el, $fauxEl){}

#nosFormInputFile
###defualt options:

	elAttrNames: {
		'elClass'         : 'nosui-form-file__element',
		'fauxElClass'     : 'nosui-form-file',
		'disabledClass'   : 'nosui-form-file--disabled',
		'placeholderClass': 'nosui-form-file__placeholder'
	},
	placeholder: null,
	onChange: null

#nosTooltip

	elAttrNames: {
		popup: 'nosui-tooltip__popup',
		'container': 'nosui-tooltip',
		'dataName': 'nosui-tooltip'
	}

### Extra Info
The second example should be used with Modernizr to make sure browsers that support the placeholder attribute don't use that as well as nosPlaceholder() function

Changelog version 0.5:
Changed all elements to divs. The plugin shouldn't dictate the element
Updated to jQuery 1.9
added disable method functionality