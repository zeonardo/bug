// set up entities   
var entity1 = game.createEntity({
    name: "Entity 1",
    hp: 30,
    x: 5,
    y: 5
}, [game.component.entity,
        game.component.moveable,
        game.component.damageable]);

var entity2 = game.createEntity({
    name: "Entity 2",
    hp: 30,
    x: 10,
    y: 10
}, [game.component.entity,
        game.component.moveable]);
    
// do stuff with entities

var dist = entity1.distanceTo(entity2.x, entity2.y);

document.write("Distance between 1 and 2: " + dist + "<br>");

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
 
damageIfPossible(entity1);
damageIfPossible(entity2);