const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const CANVAS_MARGIN = 0;
const POWER_OF_2_SCALING_ONLY = false;
const USE_ANTIALIASING = true;

const MUTE_AUDIO = false;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'gameDiv', null, false, USE_ANTIALIASING);

localizationManager.currentLanguage = Languages.English;

//Add states
game.state.add("bootState", bootState);
game.state.add("preloadState", preloadState);
game.state.add("menuState", menuState);
game.state.add("levelLoadState", levelLoadState);
game.state.add("gameplayState", gameplayState);

game.state.start("bootState");