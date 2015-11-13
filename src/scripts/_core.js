(function(){
	window.debug = true;
	window.game = {};
	window.game.core = {};


	window.game.environment = {};
	window.game.environment.fps = 30;
	window.game.environment.cycle = {
    	started: false,
		duration: 60000,
		morning: false,
		noon: false,
		evening: false,
		twilight: false,
		get day(){ return this.morning || this.noon; },
		get night(){ return this.evening || this.twilight; },
		start: function(period){
			if(!this.started){
				this.started = true;
			}
			this.clock = function(period){
				switch(period){
					case 1:
						morning();
						break;
					case 2:
						noon();
						break;
					case 3:
						evening();
						break;
					default: //4
						twilight();
						period = 0;
						break;
				}
				function morning(){
					this.morning = true;
					this.twilight = false;
					window.game.environment.circle.command.style = '#FFCC00';
					debug && console.log('morning');
				}
				function noon(){
					this.noon = true;
					this.morning = false;
					window.game.environment.circle.command.style = '#FFFF41';
					debug && console.log('noon');
				}
				function evening(){
					this.evening = true;
					this.noon = false;
					window.game.environment.circle.command.style = '#E4E4E4';
					debug && console.log('evening');
				}
				function twilight(){
					this.twilight = true;
					this.evening = false;
					window.game.environment.circle.command.style = '#FFFFFF';
					debug && console.log('twilight');
				}
				//alert('change: ' + period);
				setTimeout(function(){
					period++;
					window.game.environment.cycle.clock(period);
				}, (this.duration / 2));
			}
			this.clock(1);
		}
	};
	debug && (window.game.environment.cycle.duration /= 4);

	window.game.environment.ticker = createjs.Ticker;
    window.game.environment.ticker.addEventListener("tick", environmentTick);
    window.game.environment.ticker.setFPS(window.game.environment.fps);
    window.game.environment.ticker.maxDelta = window.game.environment.fps + (window.game.environment.fps / 2);

	window.game.language = {
		available: [
			{
				name: 'English',
				code: 'enus'
			},
			{
				name: 'Português',
				code: 'ptbr'
			}
		]
	};


	window.game.language.default = window.game.language.available[0];

	window.game.text = {};
	
	window.game.stage = new createjs.Stage("cnv_main");
	stage = window.game.stage;
	stage.width = 800;
	stage.height = 600;


	//UI bar
	game.environment.bar = {
		index: 3,
    	width: window.game.stage.width,
    	height: 100,
    	x: 0,
    	get y() { return window.game.stage.height - this.height; },
    	color: '#FF0000',
    	ui: new createjs.Shape(),
    	render: function(){
		    this.ui.outColor = this.color;
		    this.ui.graphics
			    .beginFill(this.ui.outColor)
			    .drawRect(this.x, this.y, this.width, this.height)
			    .endFill();//( [x=0]  [y=0]  [width=0]  [height=0] )
		    game.stage.addChild(this.ui);
    	}
    };

    // land
    game.environment.land = {
    	index: 2,
    	width: window.game.stage.width,
    	height: 100,
    	x: 0,
    	get y() { return window.game.stage.height - window.game.environment.bar.height - this.height; },
    	color: '#33CC33',
    	ui: new createjs.Shape(),
    	render: function(){
		    this.ui.graphics
			    .beginFill(this.color)
			    .drawRect(this.x, this.y, this.width, this.height)
			    .endFill();// ( [x=0]  [y=0]  [width=0]  [height=0] )
		    game.stage.addChild(this.ui);
    	}
    };

    // sky
    game.environment.sky = {
    	index: 0,
    	width: window.game.stage.width,
    	get height() { return window.game.stage.height - window.game.environment.bar.height - window.game.environment.land.height; },
    	x: 0,
    	y: 0,
    	color: ["#000066","#3385FF", "#9C9CFF"],
    	ui: new createjs.Shape(),
	    render: function(){
	    	this.ui.graphics
	    	/*
	    	colors Array: An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
			ratios Array: An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
			x0 Number: The position of the first point defining the line that defines the gradient direction and size.
			y0 Number: The position of the first point defining the line that defines the gradient direction and size.
			x1 Number: The position of the second point defining the line that defines the gradient direction and size.
			y1 Number: The position of the second point defining the line that defines the gradient direction and size.
	    	*/
		    .beginLinearGradientFill(this.color, [0, 0.7, 1], 0, 100, 0, this.height)
		    .drawRect(this.x, this.y, this.width, this.height)
		    .endFill();// ( [x=0]  [y=0]  [width=0]  [height=0] )
	    	game.stage.addChild(this.ui);
	    }
    };


    // bg
    game.environment.circle = {
    	index: 1,
    	width: 100,
    	height: 100,
    	get x(){ return (window.game.stage.width - (this.width / 2)); },
    	get y(){ return (window.game.environment.sky.height + (this.height / 2)); },
    	color: '#FFCC00',
    	ui: new createjs.Shape(),
    	render: function(){

		    var _this = this;
		    this.path = {
				index: _this.index - 1,
	    		get x_start(){ return (_this.width / 4); },
				get x_end(){ return (window.game.stage.width - (_this.width / 4)); },
				y_start: window.game.environment.sky.height + (_this.height / 2),
				y_end: window.game.environment.sky.height + (_this.height / 2),
				ui: new createjs.Shape(),
				render: function(){
					var trajectory = new createjs.Shape();
					// .moveTo(0,0)
					// .curveTo(0,200,200,200)
					// .curveTo(200,0,0,0);
					trajectory.graphics.beginStroke("#666")
						.moveTo(this.x_end, this.y_end)
						.curveTo(this.y_end, -300, this.x_start, this.y_start);
					game.stage.addChild(trajectory);
				},
				animate: function(){
					createjs.MotionGuidePlugin.install();
					createjs.Tween.get(_this.ui, {loop:true})
					.to({
						guide:{
							path:[
								this.x_end, this.y_end,
								this.y_end, -300, this.x_start, this.y_start
							]
						}
					}, window.game.environment.cycle.duration);
				}
	    	};

		    debug && this.path.render();

		    this.command = this.ui.graphics.beginFill("#FFCC00").command;
		    this.ui.graphics.drawCircle(0, 0, (this.width / 2));
		    this.ui.x = this.x;
		    this.ui.y = this.y;
		    game.stage.addChild(this.ui);

		    this.path.animate();
    	}
    };

    game.environment.sky.render();
    game.environment.circle.render();
    game.environment.land.render();
    game.environment.bar.render();

	var text = new createjs.Text("debug", "12px Arial", "#fff");
	text.x = game.stage.width - 40;
	text.y = game.stage.height - 5;
	text.textBaseline = "alphabetic";
	debug && stage.addChild(text);

    var specials  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var color = '#3281FF';

    var slotPaddingX = 10;
    var slotPaddingY = 10;
    var slotHeight = 40;
    var slotWidth = Math.min(((window.game.stage.width - slotPaddingX) / (specials.length + slotPaddingX)), slotHeight);
    var slotX = slotPaddingX;
    var slotY = stage.height - slotHeight - slotPaddingY;
    for (var i = 0; i < specials.length; i++) {
    	specials[i] = new createjs.Shape();
	    specials[i].overColor = "#FF0000"
	    specials[i].outColor = color;
	    specials[i].graphics
		    .beginFill(color)
		    .drawRect(slotX, slotY, slotWidth, slotHeight)
		    .endFill();
	    stage.addChild(specials[i]);
	    slotX += (slotPaddingX + slotWidth);
    };

	//game.stage.update();


    function environmentTick(e) {

        !window.game.environment.cycle.started && (window.game.environment.cycle.start());

        game.stage.update(e);
    }
})();


// component.js
(function() {

    window.game.component = {};

    window.game.createEntity = function(properties, components) {

        var prop;
        var entity = {};

        for (prop in properties) {
            entity[prop] = properties[prop];
        }

        components.forEach(function(component) {
            for (prop in component) {
                if (entity.hasOwnProperty(prop)) {
                    throw "entity property conflict: " + prop;
                }
                entity[prop] = component[prop];
            }
        });

        return entity;
    }
}());

// ui.js
(function(){
	// var background = new createjs.Shape();
 //    background.graphics.beginFill("DeepSkyBlue").Rectangle(0, 700, 800, 100);// ( [x=0]  [y=0]  [width=0]  [height=0] )
 //    background.x = 100;
 //    background.y = 100;
 //    stage.addChild(background);
 //    stage.update();
	// game.component.ui = {
	// 	this.bottom = {
			
	// 	}
	// }

})();

// entity.js
(function() {
    window.game.component.entity = {
        distanceTo: function(x, y) {
            return Math.sqrt(Math.pow(x - this.x, 2) +
                             Math.pow(y - this.y, 2));
        }
    }
}());

// dice.js
(function() {
    window.game.dice = {
        roll: function(quantity, sides) {
        	var critical = false;
    		var fail = false;
        	var q = quantity = Math.max(quantity||1, 1);
        	sides = Math.max(sides||2, 2)
        	var rolls = [];
        	var total = 0;
        	while (q > 0){
        		q--;
        		var roll = Math.floor(Math.random() * ((sides - 1) + 1) + 1);
        		total += roll;
        		rolls.push(roll);
        	}
        	debug && console.log('rolls '+quantity+'d'+sides+': ' +rolls.join('+')+
        		((quantity > 1) ? ('='+total) : ''));

        	critical = (quantity * sides) === total;
        	fail = quantity === total;
        	console.log(this);
        	this.last = {
            	rolls: rolls,
            	result: Math.max(Math.round(total), 1),
            	critical: critical,
            	fail: fail
            };
            return this.last;
        }
    }
}());

// damage.js
(function() {

    game.component.damage = {
        be_damage: function(amount) {
            this.hp -= amount;
        },
        do_damage: function(amount) {
            this.hp += amount;
        },
    }

}());

// move.js
(function() {

    game.component.move = {
        be_move: function(x, y) {
            this.x = x;
            this.y = y;
        },
        do_move: function(x, y) {

        }
    }
}());

// set up entities   
var entity1 = game.createEntity({
    name: "Entity 1",
    hp: 30,
    x: 5,
    y: 5
}, [game.component.entity, game.component.canbe_move, game.component.can_damage]);

var entity2 = game.createEntity({
    name: "Entity 2",
    hp: 30,
    x: 10,
    y: 10
}, [game.component.entity, game.component.canbe_move]);
    
// do stuff with entities
function damageIfPossible(entity) {
    if (entity.damage) {
        document.write(entity.name + " can be damaged!<br>");
        entity.damage(10);
        document.write(entity.name + " HP reduced to " + entity1.hp + "<br>");
    }
    else {
        document.write(entity.name + " cannot be damaged!<br>");
    }
}
 
//damageIfPossible(entity1);
//damageIfPossible(entity2);
