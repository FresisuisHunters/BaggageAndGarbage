var GAME_WIDTH = 1280;
var GAME_HEIGHT  = 720;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

//Add states
game.state.add("bootState", bootState);
game.state.add("luggageDevState", luggageDevState);

game.state.start("bootState");