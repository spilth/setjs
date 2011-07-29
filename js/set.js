dojo.declare("set.Game", null, {
	deck: null,
	table: null,
	selected: null,
	tableDiv: null,
	score: 0,
	found: new Array(),
	
	initializeGame: function() {
		this.tableDiv = dojo.byId("theTable");

		this.deck = new set.Deck();
		this.deck.shuffle();
		
		this.table = new set.Table();
		this.table.add(this.deck.draw(12));

		this.selected = new Array();

		this.renderTable();
	},
	
	renderTable: function() {
		dojo.empty(this.tableDiv);
		for (i = 0; i < this.table.cards.length; i++) {
			var card = dojo.create("img", {src: this.table.cards[i].imageUrl, id: i, class: "card"}, this.tableDiv);
			dojo.connect(card, "onclick", function(evt) {
				game.selectCard(evt);
			});
		}
	},
	
	renderScore: function() {
		dojo.byId("score").innerHTML = this.score;
	},

	selectCard: function(evt) {
		var cardId = evt.target.id;
		var card = dojo.byId(cardId);

		dojo.toggleClass(card, "selected");
		
		this.selected = dojo.query(".selected");
		
		if (this.selected.length == 3) {
			this.checkForSet();
		}
	},
	
	checkForSet: function() {
		if (this.isValidSetSelected()) {
			this.score++;
			
			this.selected.forEach(function(node, index, nodelist){
				game.table.cards[node.id] = game.deck.drawOne();
			});
			
			this.renderTable();
			
		} else {
			alert("Nope!");
			this.score--;
		}
		
		this.renderScore();

		this.selected.forEach(function(node, index, nodelist){
		    dojo.removeClass(node, "selected");
		});

	},
	
	isValidSetSelected: function() {
		var a = game.table.cards[this.selected[0].id];
		var b = game.table.cards[this.selected[1].id];
		var c = game.table.cards[this.selected[2].id];

		var count = a.count + b.count + c.count;
		if (count % 3 > 0) return false;
		
		var color = a.color + b.color + c.color;
		if (color % 3 > 0) return false;

		var symbol = a.symbol + b.symbol + c.symbol;
		if (symbol % 3 > 0) return false;

		var shading = a.shading + b.shading + c.shading;
		if (shading % 3 > 0) return false;
				
		return true;
	}

});

dojo.declare("set.Table", null, {
	cards: new Array(),
	
	constructor: function() {

	},

	add: function(cards) {
		this.cards = this.cards.concat(cards);
	},
	
	remove: function(index) {
		this.cards.splice(parseInt(index),1);
	}
});

dojo.declare("set.Deck", null, {
	cards: new Array(),

	constructor: function() {
		for (i = 0; i < 3; i++) {
			for (j =0; j < 3; j++) {
				for (k = 0; k < 3; k++) {
					for (l = 0; l < 3; l++) {
						this.cards.push(new set.Card(i,j,k,l));
					}
				}
			}
		}
	},

	shuffle: function() {
		this.cards = this.cards.sort(function(a,b) {
			return a.order < b.order;
		});
	},
	
	draw: function(count) {
		var draw = new Array();
		for (i = 0; i < count; i++) {
			draw.push(this.cards.pop());
		}
		return draw;
	},
	
	drawOne: function() {
		return this.cards.pop();
	}
});

dojo.declare("set.Card", null, {
	count: null,
	color: null,
	symbol: null,
	shading: null,
	imageUrl: null,
	order: null,
	
	constructor: function(count, color, symbol, shading) {
		this.id = "" + count + color + symbol + shading;
		this.count = count;
		this.color = color;
		this.symbol = symbol;
		this.shading = shading;
		this.imageUrl = "images/cards/card" + this.id + ".png";
		this.order = Math.floor(Math.random()*100000);
	}
});
