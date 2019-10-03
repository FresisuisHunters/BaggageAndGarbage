const GAME_WIDTH = 506;
const GAME_HEIGHT = 900;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

//Add states
game.state.add("bootState", bootState);
game.state.add("gameplayState", gameplayState);
game.state.add("preloadState", preloadState);
game.state.add("levelLoadState", levelLoadState);
game.state.add("graphTestingState", graphTestingState);

game.state.start("bootState");