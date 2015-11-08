//@include character/ai/ai.js
(function(){
	var stage = new createjs.Stage("cnv_main");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
})();
