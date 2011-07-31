dojo.require("dojo.fx");

dojo.declare("set.Game", null, {
	deck: null,
	table: null,
	selected: null,
	tableDiv: null,
	messageDiv: null,
	score: null,
	
	initializeGame: function() {
		this.tableDiv = dojo.byId("theTable");
		this.messageDiv = dojo.byId("message");

		dojo.connect(dojo.byId("drawMore"), "onclick", function(evt) {
			game.drawMore();
		});

		dojo.connect(dojo.byId("hint"), "onclick", function(evt) {
			game.showHint();
		});

		dojo.connect(dojo.byId("new"), "onclick", function(evt) {
			game.newGame();
		});

		this.newGame();
	},

	newGame: function() {
		this.deck = new set.Deck();
		this.deck.shuffle();
		
		this.table = new set.Table();
		this.table.add(this.deck.draw(12));

		this.selected = new Array();

		this.score = 0;
		
		this.renderTable();
		this.renderScore();

		this.showMessage("Click 3 cards to select a Set!");
	},

	drawMore: function() {
		this.table.add(this.deck.draw(3));
		this.renderTable();
	},
	
	showHint: function() {
		var count = this.findSets();
		this.showMessage("There are " + count + " possible sets...");
		this.score -= count;
		this.renderScore();
	},
	
	findSets: function() {
		var setCount = 0;
		var first, second, third;
		
		for (var i = 0; i < this.table.cards.length; i++) {
			first = this.table.cards[i];
			for (var j = i+1; j < this.table.cards.length; j++) {
				second = this.table.cards[j];
				for (var k = j+1; k < this.table.cards.length; k++) {
					third = this.table.cards[k];
					if (this.isValidSet(first, second, third)) {
						setCount++;
					}
				}
			}
		}
		
		return setCount;
	},
	
	renderTable: function() {
		dojo.empty(this.tableDiv);
		var table = dojo.create("table", null, this.tableDiv);
		var row;

		for (i = 0; i < this.table.cards.length; i++) {
			if (i % 3 == 0) {
				row = dojo.create("tr", null, table);
			}
			var td = dojo.create("td", null, row);
			
			var card = dojo.create("img", {src: this.table.cards[i].imageUrl, id: i, "class": "card"}, td);
			dojo.connect(card, "onclick", function(evt) {
				game.selectCard(evt.target.id);
			});
			
		}
	},
	
	renderScore: function() {
		dojo.byId("score").innerHTML = this.score;
	},

	showMessage: function(text) {
		this.messageDiv.innerHTML = text;
		var messageNode = dojo.byId("message");
		dojo.fx.chain([
			dojo.fadeIn({node: messageNode, duration:1000}),
			dojo.fadeOut({node: messageNode, duration:2000}),
		]).play();
	},

	selectCard: function(cardId) {
		var card = dojo.byId(cardId);

		dojo.toggleClass(card, "selected");
		
		this.selected = dojo.query(".selected");
		
		if (this.selected.length == 3) {
			this.validateSelectedSet();
		}
	},
	
	validateSelectedSet: function() {
		var a = game.table.cards[this.selected[0].id];
		var b = game.table.cards[this.selected[1].id];
		var c = game.table.cards[this.selected[2].id];
		
		if (this.isValidSet(a, b, c)) {
			this.showMessage("You found a Set!");
			
			this.score++;
			
			var offset = 0;
			this.selected.forEach(function(node, index, nodelist){
				var card = game.deck.drawOne();
				if (card != null) {
					// table.replaceCard(node.id, card)
					game.table.cards[node.id] = card;
				} else {
					// table.removeCard(node.id - offset)
					game.table.cards.splice(parseInt(node.id - offset),1);
					offset++;					
				}
			});
			
			this.renderTable();
			
		} else {
			this.showMessage("Sorry, that's an invalid Set!");
			this.score--;
		}
		
		this.renderScore();

		this.selected.forEach(function(node, index, nodelist){
		    dojo.removeClass(node, "selected");
		});

	},
	
	isValidSet: function(a, b, c) {
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
	cards: null,
	
	constructor: function() {
		this.cards = new Array();
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
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
			return a.order - b.order;
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
