const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

//Add states
game.state.add("bootState", bootState);
game.state.add("bagDevState", bagDevState);
game.state.add("waveManagerDevState", waveManagerDevState);
game.state.add("preloadState", preloadState);
game.state.add("levelLoadState", levelLoadState);
game.state.add("graphTestingState", graphTestingState);

game.state.start("bootState");