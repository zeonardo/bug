(function(){
	window.debug = true;
	window.game = {};
	window.game.core = {};
	
	window.game.stage = new createjs.Stage("cnv_main");
	stage = window.game.stage;
    
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);

    var star = new createjs.Shape();
    star.graphics.beginFill("red").drawPolyStar(100, 0, 50, 5, 0.6, -90);
    star.x = 50;
    star.y = 50;
    stage.addChild(star);

	var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
	text.x = 100;
	text.y = 50;
	text.textBaseline = "alphabetic";
	stage.addChild(text);

	stage.update();

	//Update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick() {
     //Circle will move 10 units to the right.
        circle.x += 10;
        //Will cause the circle to wrap back
        if (circle.x > stage.canvas.width) { circle.x = 0; }

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
        	fail = 1 === total;
        	console.log(this);
            return {
            	rolls: rolls,
            	result: Math.max(Math.round(total), 1),
            	critical: critical,
            	fail: fail
            };
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
