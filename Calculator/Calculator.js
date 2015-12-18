/*
------------------------------------------------------------
CALCULATOR v 1.0. 11/13/15 
by Federico Rabinovich
This class implements a Calculator inside your HTML

instructions:
include in header 
	<link rel="stylesheet" href="calculator.css">
	<script type="text/javascript" src="calculator.js"></script>

Create Calc object with settings at the end of body tag:
	<script>
		var settings = {
			containerId: 'calcContainer',
			anim:		true
		}
		var myCalc = new Calculator(settings);
	</script>
*/
function Calculator(settings){

	this.settings = settings;

	//define buttons and columns
	var buttons = [['+', '7', '4', '1','0'], ['-', '8', '5', '2', '.'], ['Clear'],['9','6','3'], ['*', '/', '^'],['Enter']];
	var columns = ["colSingle", "colSingle", "colDouble", "colSingle", "colSingle", "colDouble"]; 
	
	var clearOnNumberInput = false;


	var result = 0;
	var display = '0';

	var LayMainDiv = document.createElement('div');
	var LayDisplay = document.createElement('input');

	//prepare cols and buttons elements
	var LayCol = new Array();
	var LayButton = new Array();
	
	//this method initialize the calculator's DOM elements (graphic render)
	var init = function(){

		//add main div container
		LayMainDiv.id = "calculatorMain";		
		document.getElementById(this.settings.containerId).appendChild(LayMainDiv);
				

		//add display element
		LayDisplay.id = "display";
		LayDisplay.value = display;
		LayDisplay.disabled = true;
		LayMainDiv.appendChild(LayDisplay);

		
		for (col=0; col< columns.length; col++){

			//add columns
			LayCol[col] = document.createElement('div');
			LayCol[col].className = columns[col];
			LayMainDiv.appendChild(LayCol[col]);
						
			for(var button=0; button < buttons[col].length; button++){
				
				//add buttons
				LayButton[col[button]] = document.createElement('div');
				LayButton[col[button]].className = "button";			
				LayButton[col[button]].innerHTML = buttons[col][button];
				LayCol[col].appendChild(LayButton[col[button]]);

				//add click listener to button
				LayButton[col[button]].addEventListener('click', function() {
					handleClick(this.innerHTML);
				});
			}
			
		}
		
		//add final div to clear float elements	
		var LayFinal = document.createElement('div');
		LayFinal.className = "final";
		LayMainDiv.appendChild(LayFinal);
	}

	//initialize object
	init();
	

	//capture keypress
	document.onkeydown = function (e) {

		e = e || window.event;
		var key = String.fromCharCode(e.keyCode);		
		if (!isNaN(key)) handleClick(key);
		else if(e.keyCode >=96 && e.keyCode <=105) handleClick(e.keyCode-96);
		else if(e.keyCode==111) handleClick('/');
		else if(e.keyCode==110) handleClick('.');
		else if(e.keyCode==106) handleClick('*');
		else if(e.keyCode==109) handleClick('-');
		else if(e.keyCode==107) handleClick('+');
		else if(e.keyCode==8) handleClick('Delete');
	};
	document.onkeypress = function (e) {
		e = e || window.event;
		if(e.keyCode==13) handleClick('Enter');
	}
	
	//function that handles click button events
	var handleClick = function(html){
		
		if(display == 'Error'){
			result = 0;
			display = '0';	
		}

		//anim buttons when click or keypress
		if(this.settings.anim){
			var Buttons = document.getElementsByClassName('button');
			for(var i=0; i< Buttons.length; i++){
				if(Buttons[i].innerHTML == html){
					Buttons[i].classList.add('light');
					window.setTimeout(function(){Buttons[i].classList.remove('light');}, '300');
					break;
				}						
			}
		}

		switch(html){
			
			case 'Clear':
				result = 0;
				display = '0';				
			break;
			case 'Delete':
				display = display.substring(0, display.length-1);				
			break;
			case 'Enter':
				//replace ^ with Math.pow
				display = replaceByPow(display);
				try{
					result = eval(display);
					display = result;
					clearOnNumberInput = true;
				}catch(err){
					result = 0;
					display = 'Error';
				}
			break;
			default:				
				if((!isNaN(html) && clearOnNumberInput) || display=='0'){
					display = html;
					result = 0;
				}
				else display += ""+html;
				clearOnNumberInput = false;
			break;
		}
		LayDisplay.value = display;
		LayDisplay.focus;
	}

	//function that replaces ^ by Math.pow
	var replaceByPow = function(string){
		do{
			var pos = string.indexOf('^');
			
			if(pos!=-1){
				//search for base

				var firstChain = string.substring(0, pos);
				var posBase = Math.max(firstChain.lastIndexOf('+'), firstChain.lastIndexOf('-'), firstChain.lastIndexOf('/'), firstChain.lastIndexOf('*'));
				if (posBase!=-1) firstChain = firstChain.substring(0, posBase+1) + "Math.pow(" + firstChain.substring(posBase+1, firstChain.length) + ", ";
				else firstChain = "Math.pow(" + firstChain + ", ";

				var lastChain = string.substring(pos+1, string.length);
				
				var posExp=9999;
				if(lastChain.indexOf('+')!=-1) posExp = lastChain.indexOf('+');
				if(lastChain.indexOf('-')!=-1 && lastChain.indexOf('-')<posExp) posExp = lastChain.indexOf('-');
				if(lastChain.indexOf('/')!=-1 && lastChain.indexOf('/')<posExp) posExp = lastChain.indexOf('/');
				if(lastChain.indexOf('*')!=-1 && lastChain.indexOf('*')<posExp) posExp = lastChain.indexOf('*');
				if(lastChain.indexOf('^')!=-1 && lastChain.indexOf('^')<posExp) posExp = lastChain.indexOf('^');

				if(posExp==9999) posExp = -1;

				if (posExp!=-1) lastChain = lastChain.substring(0, posExp) + ")" + lastChain.substring(posExp, lastChain.length);
				else lastChain = lastChain + ")";
				
				string = firstChain+lastChain;
			}
		}while(pos!=-1);
		return string;
	}
	
}
