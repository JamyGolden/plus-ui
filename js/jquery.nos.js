/*
* jQuery NOs 0.1.8
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ) {

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
					$el.val("")
				}
			}

			function blurInput(){
				if($el.val() == ""){
					$el.val(val)
				}
			}

			// Set value
			$el.val(val);

			// Turn off functions
			$el.off('focus.placeholder').off('blur.placeholder');

			// Turn on functions
			$el.on('focus.placeholder', focusInput).on('blur.placeholder', blurInput);
		});

	}, // nosPlaceholder()
	nosFormSelect: function( placeholder, defaultDropdown, clickEvent ){

		return this.each(function(){

			function toggleFormList() {
				$fauxSelect.toggleClass('nosformselect-active').find( $list ).toggle();
			}

			var $el = $(this);

			function isDisabled($el, $fauxEl) {
				if(typeof $el.attr('disabled') == 'string'){

					$fauxEl.addClass('nosformselect-disabled');
					return true;

				} else {

					$fauxEl.removeClass('nosformselect-disabled');
					return false;

				}
			}

			if ( defaultDropdown == true ) {

				var activeClass = 'nosformselect-default-active';

				$el.wrap(
					$('<div />', {
						'class': 'nosformselect-default',
						'id': 'nosformselect-' + $el.attr('id')
					})
				);
				var $fauxSelect = $el.parent();

				// Adding select placeholder text
				var $placeholderText = $('<span />', {
					'class': 'nosformselect-default-placeholder',
					text: placeholder
				}).prependTo( $fauxSelect );

				isDisabled($el, $fauxSelect); // Applied for styling alone.

				// Events
				$el.click( function(e) {

					isDisabled($el, $fauxSelect); // Applied for styling alone.

					$fauxSelect.toggleClass( activeClass );

				}).change( function() {

					var text = $el.find(':selected').text();
					$placeholderText.text(text);

					if(typeof clickEvent === 'function') {
						clickEvent($el, $fauxSelect);
					};

				}).blur(function() {

					$fauxSelect.removeClass( activeClass );

				}); // .select li.click

			} else {

				var $fauxSelect = $('<div />', {
					'class': 'nosformselect',
					'id': 'nosformselect-' + $el.attr('id')
				});

				if($el.attr('disabled') == 'true'){
					$fauxSelect.attr('data-disabled', 'true').addClass('nosformselect-is-disabled');
				} else {
					$fauxSelect.prop('data-disabled', 'false');
				};

				$el.hide().before( $fauxSelect );

				// Adding dropdown button for cross-browser support
				$('<span />', {
					'class': 'nosformselect-button',
					text: 'Drop Down'
				}).appendTo( $fauxSelect );

				// Creating List
				var $list = $('<ul />').appendTo( $fauxSelect ).hide();
				$el.find('option').each( function( i ) {
					$('<li />', {
						'class': i == 0 ? 'nosformselect-active' : '',
						text: $(this).text()
					}).appendTo( $fauxSelect.find('ul') );
				});

				// Adding select placeholder text
				var $placeholder = $('<span />', {
					'class': 'nosformselect-selected',
					text: placeholder ? placeholder : $fauxSelect.find('li').eq(0).text()
				}).insertBefore( $list );

				isDisabled($el, $fauxSelect);

				// Events
				$fauxSelect.click( function(e) {
					if(isDisabled($el, $fauxSelect) === true) { // Return if select is disabled
						return;
					};

					toggleFormList();
				});

				$fauxSelect.find('li').click( function(e) {

					var $this = $(this),
						index = $this.index(),
						text = $this.text();

					$this.addClass('nosformselect-active').siblings().removeClass('nosformselect-active');
					$placeholder.text(text);

					$el.find('option').prop('selected', false).eq(index).prop('selected', true);

					if(typeof clickEvent === 'function') {
						clickEvent($el, $fauxSelect);
					};

				}); // .select li.click

			};

		}); // each

	}, // nosFormSelect
	nosAnalytics: function( ua, trackPageviewVal, eventTracker ){

		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', ua]);
		_gaq.push(['_trackPageview', trackPageviewVal]);

		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
		
		if (eventTracker == true ){

			function gatrackevent(cat,action,label,value){try{pageTracker._trackEvent(cat,action,label,value);}catch(err){}}

			if (typeof(eventTracker) == 'object' && eventTracker.selectVal == true){
				function gatrackselectvalue(cat,action,selectname,value){try{var index=document.getElementById(selectname).selectedIndex;var text=document.getElementById(selectname).options[index].text;var finaltext=text;gatrackevent(cat,action,finaltext,value);}catch(err){}}
			}

		} // if trackCode

	}, // nosAnalytics()
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

		return this.each(function(){

			var $el = $(this),
				$container = $('<div />', {
					'class'	: 'nostooltip-container'
				}),
				$tooltip = $('<div />', {
					'class'	: 'nostooltip',
					text 	: tooltipText ? tooltipText : $el.attr('data-nostooltip')
				});

			$el.wrap( $container ).after( $tooltip );

		}); // return this.each

	} // nosTooltip()
});

})( jQuery );
