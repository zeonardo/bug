(function(){
	window.debug = true;
	window.game = {};
	window.game.core = {};
	window.game.language = {
		available: [
			{
				name: 'English',
				code: 'enus'	
			}
		]
	};

	window.game.language.default = window.game.language.available[0];

	window.game.text = {};
	
	window.game.stage = new createjs.Stage("cnv_main");
	stage = window.game.stage;
	stage.width = 800;
	stage.height = 600;
    

    var star = new createjs.Shape();
    star.graphics.beginFill("red").drawPolyStar(100, 0, 50, 5, 0.6, -90);
    star.x = 50;
    star.y = 50;
    //stage.addChild(star);

	var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
	text.x = 100;
	text.y = 50;
	text.textBaseline = "alphabetic";
	//stage.addChild(text);

    // sky
	var sky = new createjs.Shape();
    sky.overColor = "#3281FF";//??
    sky.outColor = "#82E0FF";
    sky.graphics
	    .beginFill(sky.outColor)
	    .drawRect(0, 0, window.game.stage.width, 400)
	    .endFill();// ( [x=0]  [y=0]  [width=0]  [height=0] )
    stage.addChild(sky);

    // bg
    var circle = new createjs.Shape();
    circle.graphics.beginFill("#FFCC00").drawCircle(0, 0, 50);
    circle.x = window.game.stage.width;
    circle.y = 100;
    stage.addChild(circle);

    // land
    var land = new createjs.Shape();
    land.overColor = "#3281FF";//??
    land.outColor = "#33CC33";
    land.graphics
	    .beginFill(land.outColor)
	    .drawRect(0, 400, window.game.stage.width, 100)
	    .endFill();// ( [x=0]  [y=0]  [width=0]  [height=0] )
    stage.addChild(land);


	//UI bar
	var bar = new createjs.Shape();
    bar.overColor = "#3281FF";
    bar.outColor = "#FF0000";
    bar.graphics
	    .beginFill(bar.outColor)
	    .drawRect(0, 500, window.game.stage.width, 100)
	    .endFill();//( [x=0]  [y=0]  [width=0]  [height=0] )
    stage.addChild(bar);

    var specials  = [1, 2, 3, 4, 5];
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



	stage.update();

	//Update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick() {
     //Circle will move 10 units to the right.
        circle.x -= 1;
        //Will cause the circle to wrap back
        if (circle.x < -100) { circle.x = window.game.stage.width; }

        //Circle will move 10 units to the right.
        star.x += 5;
        //Will cause the circle to wrap back
        if (star.x > stage.canvas.width) { star.x = 0; }

        //Circle will move 10 units to the right.
        text.x -= 7;
        //Will cause the circle to wrap back
        if (text.x < 0) { text.x = stage.canvas.width; }

        stage.update();
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
