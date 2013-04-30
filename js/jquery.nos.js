/*
* jQuery NOs 0.1.7
*
* Copyright 2011
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

			$el.val( val ).focus(function() {

				if ( $el.val() == val ){
						$el.val("");
				};
			   
			}).blur(function(){

				if ( $el.val() == '' ) {
					$el.val( val );
				};

			});

			if ( typeof( callback ) == 'function' ) callback( $el );
			
		});

	}, // nosPlaceholder()
	nosFormSelect: function( placeholder, defaultDropdown, zIndex ){

		return this.each(function(){
		
			function toggleFormList() {
				$fauxSelect.toggleClass('nosformselect-active').find( $list ).toggle();
			}

			var $el = $(this);

			var selectInputs = document.getElementsByTagName('select');

			if ( defaultDropdown == true ) {

				var activeClass = 'nosformselect-default-active';

				$el.wrap(
					$('<div />', {
						'class': 'nosformselect-default'
					})
				);
				var $fauxSelect = $el.parent();

				// Adding select placeholder text
				var $placeholderText = $('<span />', {
					'class': 'nosformselect-default-placeholder',
					text: placeholder
				}).prependTo( $fauxSelect );


				// Events
				$el.click( function(e) {

					$fauxSelect.toggleClass( activeClass );

				}).change( function() {

					var text = $el.find(':selected').text();
					$placeholderText.text(text);

				}).blur(function() {
					$fauxSelect.removeClass( activeClass );
				}); // .select li.click

			} else {

				var $fauxSelect = $('<div />', {
					'class': 'nosformselect'
				});

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


				// Events
				$fauxSelect.click( function(e) {
					toggleFormList();
				});

				$fauxSelect.find('li').click( function(e) {

					var $this = $(this),
						index = $this.index(),
						text = $this.text();

					$this.addClass('nosformselect-active').siblings().removeClass('nosformselect-active');
					$placeholder.text(text);

					$el.find('option').removeAttr('selected').eq(index).attr('selected', 'selected');

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
	nosFormInputCheckbox: function(){

		return this.each(function(){

			var $el = $(this),
				$fauxCheckbox = $('<div />', {
				'class': 'nosformcheckbox'
			}).insertBefore( $el.hide() );

			$fauxCheckbox.click( function(){ 
				var $this = $(this);

				$this.toggleClass('nosformcheckbox-checked nosforminput');

				!$el.attr('checked') ? $el.attr('checked', 'checked') : $el.removeAttr('checked'); 
			});
			
		}); // this.each()

	}, // nosFormCheckbox()
	nosFormInputRadio: function(){

		return this.each(function(){

			var $el = $(this),
				$fauxCheckbox = $('<div />', {
				'class': 'nosformradio nosforminput'
			}).insertBefore( $el.hide() );

			$fauxCheckbox.click( function(){ 
				var $this = $(this);

				$this.addClass('nosformradio-checked').siblings('.nosformradio').removeClass('nosformradio-checked');
				$el.attr('checked', 'checked').siblings('input[name="' + $el.attr('name') + '"]').removeAttr('checked');

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