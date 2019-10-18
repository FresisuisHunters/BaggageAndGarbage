"use strict"
var creditsState = function (game) {

}

const CREDITS_BACKGROUND_IMAGE_KEY = "MenuBackground";
const BACK_BUTTON_MARGIN = 30;
const BACK_BUTTON_SCALE_FACTOR = 1;

creditsState.prototype = {

    create: function() {
        this.backgroundLayer = game.add.group();
        this.buttonLayer = game.add.group();

        this.showBackground();
        this.buttonLayer.add(createBackButton("titleScreenState"));


        ensureThatMenuMusicIsPlaying();
    },

    showBackground: function () {
        let background = new Phaser.Image(game, 0, 0, CREDITS_BACKGROUND_IMAGE_KEY);
        background.anchor.set(0, 0);
        this.backgroundLayer.add(background);
    },

    showBackButton: function() {
        
    }
}

