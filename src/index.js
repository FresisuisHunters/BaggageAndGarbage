const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;
const POWER_OF_2_SCALING_ONLY = false;
const USE_ANTIALIASING = true;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'gameDiv', null, false, USE_ANTIALIASING);

//Add states
game.state.add("bootState", bootState);
game.state.add("gameplayState", gameplayState);
game.state.add("preloadState", preloadState);
game.state.add("levelLoadState", levelLoadState);
game.state.add("graphTestingState", graphTestingState);

game.state.start("bootState");