# nosFramework

## nosPlaceholder
	This adds HTML5 placeholder support for input elements
	$( el ).nosPlaceholder({
		placeholder: 'Placeholder text here'
	});
or
	$( el ).nosPlaceholder(); // el must have HTML5 placeholder attribute - this will be used as the val

### HTML required:
	<input type="text" />
Or
	<input type="text" placeholder="Placeholder Text" />


	
### Extra Info
The second example should be used with Modernizr to make sure browsers that support the placeholder attribute don't use that as well as nosPlaceholder() function

Changelog version 0.5:
Changed all elements to divs. The plugin shouldn't dictate the element
Updated to jQuery 1.9
added disable method functionality