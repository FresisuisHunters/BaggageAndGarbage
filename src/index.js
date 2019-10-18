const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const CANVAS_MARGIN = 0;
const POWER_OF_2_SCALING_ONLY = false;
const USE_ANTIALIASING = false;

const SHOW_FPS = false;

const MUTE_AUDIO = false;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'gameDiv', null, false, USE_ANTIALIASING);
    var IS_MOBILE = true;
} else {
    var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'gameDiv', null, false, USE_ANTIALIASING);
    var IS_MOBILE = false;
}

localizationManager.currentLanguage = Languages.English;

//Add states
game.state.add("bootState", bootState);
game.state.add("preloadState", preloadState);
game.state.add("titleScreenState", titleScreenState);
game.state.add("creditsState", creditsState);
game.state.add("tutorialState", tutorialState);
game.state.add("levelSelectState", levelSelectState);
game.state.add("levelLoadState", levelLoadState);
game.state.add("gameplayState", gameplayState);

game.state.start("bootState");