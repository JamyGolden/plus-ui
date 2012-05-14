# nosFramework

## nosTabs
	$( el ).nosTabs();

### HTML required:
	<div class="nostabs">
		<nav class="nostabs-nav">
			<ul>
				<li>One</li>
				<li>Two</li>
				<li>Three</li>
			</ul>
		</nav> <!-- .nostabs-nav -->
		<div class="nostabs-content">
			<div>One</div>
			<div>Two</div>
			<div>Three</div>
		</div> <!-- .nostabs-content -->
	</div> <!-- .nostabs -->

## nosAccordion
	$( el ).nosTabs();

### HTML required:
	<div class="nosaccordion">
		<h2 class="nosaccordion-title">First accordion</h2>
		<div>
			Content goes here
		</div>
		<h2 class="nosaccordion-title">First accordion</h2>
		<div>
			Content goes here
		</div>
	</div>

## nosPlaceholder
	$( el ).nosPlaceholder( 'Placeholder text here' );
or
	$( el ).nosPlaceholder(); // el must have HTML5 placeholder attribute - this will be used as the val

### HTML required:
	<input type="text" />
Or
	<input type="text" placeholder="Placeholder Text" />
	
### Extra Info
The second example should be used with Modernizr to make sure browsers that support the placeholder attribute don't use that as well as nosPlaceholder() function