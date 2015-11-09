// can_damage.js
(function() {

    game.component.can_damage = {
        damage: function(amount) {
            this.hp -= amount;
        }
    }

}());