(function(){
	window.debug = true;
	window.game = {};
	window.game.utils = {};
	window.game.utils.hexToRgba = function(hex){
	    hex = (hex || '#ffffff').replace('#','').toLowerCase();

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	};
	window.game.utils.changeToColor = function(command, hexto){
		var hexfrom = command.style;
		console.log(command.style);
		var rgbafrom = window.game.utils.hexToRgba(hexfrom);
		var rgbato = window.game.utils.hexToRgba(hexto);
		var rsteps = Math.max(rgbafrom.r, rgbato.r) - Math.min(rgbafrom.r, rgbato.r);
		var gsteps = Math.max(rgbafrom.g, rgbato.g) - Math.min(rgbafrom.g, rgbato.g);
		var bsteps = Math.max(rgbafrom.b, rgbato.b) - Math.min(rgbafrom.b, rgbato.b);
		var maxsteps = Math.max(Math.max(rsteps, gsteps), bsteps);

		var change = [];
		while(maxsteps > 0){

		}

        var dr = (rgbato.r - rgbafrom.r) / maxsteps, // how much red should be added each time
        dg = (rgbato.g - rgbafrom.g) / maxsteps, // green
        db = (rgbato.b - rgbafrom.b) / maxsteps, // blue
        i = 0, // step counter
        interval = setInterval(function() {
            command.style = 'rgb(' + Math.round(rgbafrom.r + dr * i) + ','
                                   + Math.round(rgbafrom.g + dg * i) + ','
                                   + Math.round(rgbafrom.b + db * i) + ')';
            i++;
            if(i === maxsteps) { // stop if done
                clearInterval(interval);
            }
        }, 30);
	};
	window.game.core = {};
	window.game.core.grid = {
        dimension: 10,
        render: function(){
            var x_start = x_end = 0;
            var y_start = y_end = 0;
            var width = (window.game.stage.width / this.dimension);
            var height = (window.game.stage.height / this.dimension);


            var trajectory;
        	// grid
            while(x_end < window.game.stage.width && y_end < window.game.stage.height){
                x_end = x_start + width;
                y_end = y_start + height;

                trajectory = new createjs.Shape();
                trajectory.graphics.beginStroke("#999").drawRect(x_start, y_start, x_end, y_end);
                trajectory.alpha = 0.3;
                game.stage.addChild(trajectory);

                if (x_end + width >= window.game.stage.width){//new line
                    x_start = 0;
                    y_start = y_end;
                }
                else{
                    x_start += width;
                }
            }

            // vertical center
            trajectory = new createjs.Shape();
            trajectory.graphics.beginStroke("#fff").drawRect((window.game.stage.width / 2), 0, (window.game.stage.width / 2), window.game.stage.height);
            trajectory.alpha = 0.3;
            game.stage.addChild(trajectory);

            // horizontal center
            trajectory = new createjs.Shape();
            trajectory.graphics.beginStroke("#fff").drawRect(0, (window.game.stage.height / 2), window.game.stage.width, (window.game.stage.height / 2));
            trajectory.alpha = 0.3;
            game.stage.addChild(trajectory);
        }
    };

	window.game.environment = {};
	window.game.environment.fps = 30;
	window.game.environment.cycle = {
    	started: false,
		duration: 60000,
		days: 0,
		quarter: 1,
		tick: function(e) {
	        window.game.environment.cycle.update(e);
	        window.game.stage.update(e);
	    },
		start: function(){

			this.ismorning = false;
			this.isnoon = false;
			this.isevening = false;
			this.istwilight = false;
			this.issetting = false;
			this.isrising = false;
			this.ispeaking = false;

			this.isday = function(){
				return this.ismorning || this.isnoon;
			};
			this.isrise = function(){
				return this.ismorning || this.isevening;
			};

			this.morning = function(){
				var command = window.game.environment.circle.command;
				//console.log(command.style);
				//window.game.utils.changeToColor(command, '#ffcc00');
				//window.game.environment.circle.command.style = '#ffcc00';
				//debug && console.log('morning');
			};
			this.noon = function(){
				var command = window.game.environment.circle.command;
				//console.log(command.style);
				//window.game.utils.changeToColor(command, '#ffff41');
				//window.game.environment.circle.command.style = '#ffff41';
				//debug && console.log('noon');
			};
			this.evening = function(){
				var command = window.game.environment.circle.command;
				//console.log(command.style);
				//window.game.utils.changeToColor(command, '#e4e4e4');
				//window.game.environment.circle.command.style = '#e4e4e4';
				//debug && console.log('evening');
			};
			this.twilight = function(){
				var command = window.game.environment.circle.command;
				//console.log(command.style);
				//window.game.utils.changeToColor(command, '#ffffff');
				//window.game.environment.circle.command.style = '#ffffff';
				//debug && console.log('twilight');
			};
			this.started = true;
			debug && console.log('cycle started');
			this.changequarter();//cycle start
		},
		changequarter: function(event){
			
			window.game.environment.cycle.ismorning = window.game.environment.cycle.quarter === 1;
			window.game.environment.cycle.isnoon = window.game.environment.cycle.quarter === 2;
			window.game.environment.cycle.isevening = window.game.environment.cycle.quarter === 3;
		    window.game.environment.cycle.istwilight = window.game.environment.cycle.quarter === 4;

			if(debug){
				console.log('quarter: ' + window.game.environment.cycle.quarter);
				window.game.environment.cycle.ismorning && console.log('ismorning: ' + window.game.environment.cycle.ismorning);
				window.game.environment.cycle.isnoon && console.log('isnoon: ' + window.game.environment.cycle.isnoon);
				window.game.environment.cycle.isevening && console.log('isevening: ' + window.game.environment.cycle.isevening);
				window.game.environment.cycle.istwilight && console.log('istwilight: ' + window.game.environment.cycle.istwilight);
			}

		    var command = window.game.environment.circle.command;
			//console.log(command.style);
			if(window.game.environment.cycle.ismorning){
				window.game.environment.cycle.days++;
				debug && !window.game.environment.cycle.ismorning && console.log('day number: ' + window.game.environment.cycle.days);
				console.log('(change color for sunrise)');
				//window.game.utils.changeToColor(command, '#ffcc00');
			}
			else if(window.game.environment.cycle.isnoon){
				console.log('(change color for midday)');
				//window.game.utils.changeToColor(command, '#ffcc00');
			}
			else if(window.game.environment.cycle.isevening){
				console.log('(change color for moonrise)');
				//window.game.utils.changeToColor(command, '#ffcc00');
			}
			else if(window.game.environment.cycle.istwilight){
				console.log('(change color for midnight)');
				//window.game.utils.changeToColor(command, '#e4e4e4');
			}

			if(window.game.environment.cycle.quarter === 4)
			{
				window.game.environment.cycle.quarter = 1;
			}
			else{
				window.game.environment.cycle.quarter++;
			}
		},
		update: function(event){
			if(!this.started){
				this.start();
			}

			this.circle_rising = game.environment.circle.ui.globalToLocal(window.game.stage.width, 0);
	        this.circle_peak = game.environment.circle.ui.globalToLocal((window.game.stage.width / 2), 0);
	        this.circle_setting = game.environment.circle.ui.globalToLocal(0, 0);
			
			if (game.environment.circle.ui.hitTest(this.circle_rising.x, 0)) {
				if (!this.isrising){
					this.isrising = true;
			    	debug && console.log('the ' + (this.isday() ? 'sun' : 'moon') + ' is rising');
				}
			} else if (game.environment.circle.ui.hitTest(this.circle_peak.x, 0)) {
				if (!this.ispeaking) {
					this.ispeaking = true;
				}
			}
			else if (game.environment.circle.ui.hitTest(this.circle_setting.x, 0)) {
				if (!this.issetting){
					this.issetting = true;
			    	debug && console.log('the ' + (this.isday() ? 'sun' : 'moon') + ' is setting');
				}
			}
			else{
				this.isrising = false;
				this.issetting = false;
				this.ispeaking = false;
			}

			this.ismorning && this.morning();
			this.isnoon && this.noon();
			this.isevening && this.evening();
			this.istwilight && this.twilight();
		}
	};
	//debug && (window.game.environment.cycle.duration /= 8);

	window.game.environment.ticker = createjs.Ticker;
    window.game.environment.ticker.setFPS(window.game.environment.fps);
    window.game.environment.ticker.maxDelta = window.game.environment.fps + (window.game.environment.fps / 2);
    window.game.environment.ticker.addEventListener("tick", window.game.environment.cycle.tick);

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


	window.game.language.main = window.game.language.available[0];

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
    	get radius(){ return (this.width / 2); },
    	get x(){ return (window.game.stage.width); },
    	get y(){ return (window.game.environment.sky.height + this.radius); },
    	color: '#FFCC00',
    	ui: new createjs.Shape(),
    	render: function(){

		    var _this = this;
		    this.path = {
				index: _this.index - 1,
	    		get x_start(){ return (0); },
				get x_end(){ return (window.game.stage.width); },
				y_start: window.game.environment.sky.height + _this.radius,
				y_mid: _this.radius,
				y_end: window.game.environment.sky.height + _this.radius,
				get curve_start(){ return (window.game.stage.width  - _this.radius);},
				get curve_mid(){ return (window.game.stage.width / 2); },
				get curve_end(){ return (_this.radius); },
				ui: new createjs.Shape(),
				render: function(){
					var trajectory = new createjs.Shape();
					trajectory.graphics.beginStroke("#666")
						.moveTo(this.x_end, this.y_end)
						.curveTo(this.curve_start, this.curve_end, this.curve_mid, this.y_mid)
						.curveTo(this.y_mid, this.curve_end, this.x_start, this.curve_mid + this.y_mid);
					game.stage.addChild(trajectory);
				},
				animate: function(){
					createjs.MotionGuidePlugin.install();
					createjs.Tween.get(_this.ui, { loop:true })
					.to({guide:{path:[
							this.x_end, this.y_end,
							this.curve_start, this.curve_end, this.curve_mid, this.y_mid
						]}}, window.game.environment.cycle.duration / 2)
					.call(window.game.environment.cycle.changequarter)//midway
					.to({guide:{path:[
							this.curve_mid, this.y_mid,
							this.y_mid, this.curve_end, this.x_start, this.curve_mid + this.y_mid
						]}}, window.game.environment.cycle.duration / 2)
					.call(window.game.environment.cycle.changequarter);//cycle end

				}
	    	};


		    this.command = this.ui.graphics.beginFill("#FFCC00").command;
		    this.ui.graphics.drawCircle(0, 0, this.radius);
		    this.ui.x = this.x;
		    this.ui.y = this.y;
		    debug && this.path.render();
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
	    specials[i].overColor = "#FF0000";
	    specials[i].outColor = color;
	    specials[i].graphics
		    .beginFill(color)
		    .drawRect(slotX, slotY, slotWidth, slotHeight)
		    .endFill();
	    stage.addChild(specials[i]);
	    slotX += (slotPaddingX + slotWidth);
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
    };
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
    };
}());

// dice.js
(function() {
    window.game.core.dice = {
        roll: function(quantity, sides) {
        	var critical = false;
    		var fail = false;
        	var q = quantity = Math.max(quantity||1, 1);
        	sides = Math.max(sides||2, 2);
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
    };
}());

// damage.js
(function() {

    game.component.damage = {
        be_damage: function(amount) {
            this.hp -= amount;
        },
        do_damage: function(amount) {
            this.hp += amount;
        }
    };

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
    };
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
