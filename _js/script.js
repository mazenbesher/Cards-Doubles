$(document).ready(function(){

//game object
var game = {
	init: function( config ){
		$.extend( this.config , config );
		var cardsObject = {
			first: null,
			cards: new Array(),
			closePhase: false,
			wins: 0,
			losses: 0,
		};
		sessionStorage.setItem('cardsObject', JSON.stringify(cardsObject));
		this.generate_carads();
	},
	config: {
		double_classes_arr: [],
		time_close: "500", //in milisecounds
	},
	generate_carads: function(){
		var $this = game;
		//read cardsObject
		var cardsObject = JSON.parse( sessionStorage.getItem('cardsObject'));
		
		$this.config_classes_arr();
		
		for( var i=1 ; i <= $this.config.cards_length ; i++){
			//create divs of cards
			$("<div></div>",{
				class: $this.config.cards_class + " " + $this.config.close_class ,
				"data-number": i 
				})
				.appendTo( $this.config.cards_holder );
		}
		
		if( cardsObject.closePhase === false){
			$( "." + this.config.cards_class ).on("click" , this.card_click );
		}
	},
	config_classes_arr: function(){
		var $this = game;
		var classesArr = $this.config.cards_classes_arr;
		var classesLength = classesArr.length;
		
		//make double of classes Array
		for( var i=0 ; i < classesLength ; i++ ){
			classesArr.push( classesArr[i] );
		}
		
		
		$this.config.double_classes_arr = classesArr;
	},
	card_click: function(){
		var $this = game;
		var classesArr = $this.config.double_classes_arr;
		var classesLength = classesArr.length;
		var randomNumber = Math.floor(Math.random()*classesLength);
		var randomClass = classesArr[randomNumber];
		//read cardsObject
		var cardsObject = JSON.parse( sessionStorage.getItem('cardsObject'));
		
		//exit function causes:
		//1- close phase
		if( cardsObject.closePhase === true){ return; };
		//2- if the same card clicked again
		if( $(this).data("number") === cardsObject.cards[0] ){ return; }; 
		
		//add card number to cards array in cards object
		cardsObject.cards.push( $(this).data("number") );
		
		//check if the first card to open
		if( cardsObject.first === true ){//not the first
			cardsObject.first = false;
		}else {//first 
			cardsObject.first = true;
		}
		
		//save new cardsObject
		sessionStorage.setItem('cardsObject', JSON.stringify( cardsObject ));
		
		if( $(this).attr("class") === $this.config.cards_class + " " + $this.config.close_class ){
			//this card has cards normal class & close
				$(this).addClass( randomClass );
				$(this).removeClass( $this.config.close_class );
				//delete this class from the array
				classesArr.splice( randomNumber , 1 );
		}else{
			//card already have class with special kine
				$(this).addClass( $this.config.cards_class );
				$(this).removeClass( $this.config.close_class );
		}
		
		
		//if cards match open them
		var firstCard = $("div[data-number="+ cardsObject.cards[ cardsObject.cards.length-1 ] +"]");
		var secondCard = $("div[data-number="+ cardsObject.cards[ cardsObject.cards.length-2 ] +"]");
		if( firstCard.attr("class") === secondCard.attr("class") ){
			cardsObject.wins++;
			//save new cardsObject
			sessionStorage.setItem('cardsObject', JSON.stringify( cardsObject ))
			//assign new class for the matched cards
			firstCard.addClass( $this.config.win_class );
			secondCard.addClass( $this.config.win_class );
		}else{
			//close cards
				if( cardsObject.first === false){
					cardsObject.losses++;
					cardsObject.closePhase = true;
					//save new cardsObject
					sessionStorage.setItem('cardsObject', JSON.stringify( cardsObject ))
					//close cards
					setTimeout( $this.close_cards , $this.config.time_close)
				};//end if
		};
	
		//save new spliced classesArr
		$this.config.double_classes_arr = classesArr;
		
		//just tow cards remian
		if( cardsObject.wins === (($this.config.cards_length/2)-1) ){
			$("div" + $this.config.cards_holder + " div").addClass( $this.config.win_class );
			cardsObject.wins++;
			//save new cardsObject
			sessionStorage.setItem('cardsObject', JSON.stringify( cardsObject ))
		};
		
		$this.update_scores();
	},
	close_cards: function(){
		var $this = game;
		var cardsObject = JSON.parse( sessionStorage.getItem('cardsObject'));
		
		$("div[data-number="+ cardsObject.cards[ cardsObject.cards.length-1 ] +"]").addClass( $this.config.close_class );
		$("div[data-number="+ cardsObject.cards[ cardsObject.cards.length-2 ] +"]").addClass( $this.config.close_class );
		cardsObject.cards = [];
		
		cardsObject.closePhase = false;
		//save new cardsObject
		sessionStorage.setItem('cardsObject', JSON.stringify( cardsObject ))
	},
	update_scores: function(){
		var $this = game;
		//read cardsObject
		var cardsObject = JSON.parse( sessionStorage.getItem('cardsObject'));
		
		$( $this.config.wins_selector ).html( cardsObject.wins );
		$( $this.config.loses_selector ).html( cardsObject.losses );
		
		//win the game
		if( cardsObject.wins === $this.config.cards_length/2 ){
			$this.win();
		}
	},
	win: function(){
		var con = confirm("you win!! \n Play again?");
		if(con){
			location.reload();
		}
	}
}

//play game
game.init({
	cards_class: "card",
	cards_length: "12",
	cards_holder: ".cards", //selectoer
	cards_classes_arr: ["ca","ch","fr","ie","op","sa"],
	close_class: "close",
	time_close: "500", //in milisecounds
	wins_selector: "#wins",
	loses_selector: "#loses",
	win_class: "win",
});

	
});
