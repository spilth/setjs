function initializeBoard() {
	$("#message").hide();
}

function initialDraw() {
	showMessage("Drawing cards...");
	deck = new Deck();
	table = new Table();
	deck.shuffle();
	table.add(deck.draw(12));
	table.draw();
}

function showMessage(message) {
	$("#message").text(message);
	$("#message").fadeIn('slow').delay(500).fadeOut();
}

var Card = Class.create({
	initialize: function(count, color, shading, symbol) {
		this.count = count;
		this.color = color;
		this.shading = shading;
		this.symbol = symbol;
		this.imageUrl = "images/cards/card" + count + color + shading + symbol + ".png";
	}
})

var Deck = Class.create({
	initialize: function() {
		this.cards = new Array();
		this.generateDeck();
	},

	generateDeck: function() {
		for (var count = 0; count < 3; count++) {
			for (var color = 0; color < 3; color++) {
				for (var shading = 0; shading < 3; shading++) {
					for (var symbol = 0; symbol < 3; symbol++) {
						this.cards.push(new Card(count, color, shading, symbol));
					}
				}
			}
		}		
	},
	
	shuffle: function() {

	},
	
	draw: function(count) {
		var draw = new Array();
		for(var i = 0; i < count; i++) {
			draw.push(this.cards.pop());
		}
		return draw;
	}
});

var Table = new Class.create({
	initialize: function() {
		this.cards = new Array();
	},
	add: function(cards) {
		this.cards = this.cards.concat(cards);
	},
	draw: function() {
		$("#table").empty();
		for (var i = 0; i < this.cards.length; i++) {
			$("#table").append('<img src="' + this.cards[i].imageUrl +'"/>');
		}
	}
});
