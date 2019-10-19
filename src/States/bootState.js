"use strict";

window.PhaserGlobal = { disableWebAudio: true };

var bootState = function (game) {

}

//iconst BACKGROUND_PLAIN_COLOR = "#90aaac";
const BACKGROUND_PLAIN_COLOR = "#91bfc2";
const ASPECT_RATIO_FOR_BACKGROUND = 0.6 * 1920 / 1080;

bootState.prototype = {

    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setResizeCallback(this.onResize, this);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.sound.mute = MUTE_AUDIO;
    },

    preload: function () {
        //Initialize Phaser
        game.time.desiredFps = 60;

        //Load what we need for the loading screen
        game.load.spritesheet(PLAY_BUTTON_SHEET_KEY, "resources/sprites/UI/sheet_ButtonPlay.png", 256, 256, 4, 20, 10);
    },

    create: function () {
        if (localStorage.userLevelData !== null && localStorage.userLevelData !== undefined) {
            game.userLevelData = JSON.parse(localStorage.userLevelData);
            if (game.userLevelData.language === undefined) {
                game.userLevelData.language = Languages.English;
            }
        }
        else {
            game.userLevelData = new Map();
            game.userLevelData.levelIndexToComplete = 1;
            game.userLevelData.language = Languages.English;

            localStorage.userLevelData = JSON.stringify(game.userLevelData);
        }
        
        //console.log("localStorage" + localStorage.userLevelData);

        localizationManager.currentLanguage = game.userLevelData.language;
        game.state.start("preloadState");
    },

    onResize: function () {

        var availableWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        availableWidth -= CANVAS_MARGIN;

        var availableHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        availableHeight -= CANVAS_MARGIN;

        //console.log("Scaling for available dimensions: (" + availableWidth + ", " + availableHeight + ")");

        let availableAspectRatio = availableWidth / availableHeight;

        let newBackground = (availableAspectRatio >= ASPECT_RATIO_FOR_BACKGROUND) ? "url(resources/webpage/fondoWeb.png)" : BACKGROUND_PLAIN_COLOR;
        let docBackground = document.getElementById("backgroundId");
        
        docBackground.style.background = newBackground;
        docBackground.style.backgroundRepeat = "repeat no-repeat";
        
        if (availableAspectRatio >= ASPECT_RATIO_FOR_BACKGROUND) docBackground.style.backgroundColor = "#959595";

        let scaleFactor;
        if (POWER_OF_2_SCALING_ONLY) {
            scaleFactor = 1;

            while (GAME_WIDTH * scaleFactor > availableWidth || GAME_HEIGHT * scaleFactor > availableHeight) {
                scaleFactor *= 0.5;
            }

            while (GAME_WIDTH * scaleFactor * 2 < availableWidth && GAME_HEIGHT * scaleFactor * 2 < availableHeight) {
                scaleFactor *= 2;
            }
        }
        else {
            //Scale for width
            scaleFactor = availableWidth / GAME_WIDTH;
            //See if it works for height as well
            if (GAME_HEIGHT * scaleFactor > availableHeight) {
                scaleFactor = availableHeight / GAME_HEIGHT;
            }
        }

        game.scale.setUserScale(scaleFactor, scaleFactor, 0, 0, false, false);
    }

}
