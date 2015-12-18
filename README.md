# Calculator
Plain and simple Javascript Calculator

Instructions

1) include in header 

	<link rel="stylesheet" href="calculator.css">
2) Include just before closing </body> tag:

	<script type="text/javascript" src="calculator.js"></script>
	<script>
		var settings = {
			containerId: 'calcContainer',
			anim:		true
		}
		var myCalc = new Calculator(settings);
	</script>

That's it. No need to include Jquery nor any other library.
Style changes can be made directly to "calculator.css" file or including your own css file after calculator.css link