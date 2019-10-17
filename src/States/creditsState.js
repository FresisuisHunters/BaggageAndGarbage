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
        this.showBackButton();
    },

    showBackground: function () {
        let background = new Phaser.Image(game, 0, 0, CREDITS_BACKGROUND_IMAGE_KEY);
        background.anchor.set(0, 0);
        this.backgroundLayer.add(background);
    },

    showBackButton: function() {
        let callback = function (button, pointer, isOver) {
            if (isOver) {
                game.state.start("titleScreenState");
            }
        }

        let button = new Phaser.Button(game, 0, 0, HOME_BUTTON_IMAGE_KEY, callback);
        button.anchor.setTo(0, 1);
        this.buttonLayer.add(button);

        button.x = BACK_BUTTON_MARGIN;
        button.y = GAME_HEIGHT - BACK_BUTTON_MARGIN;

        button.scale.setTo(BACK_BUTTON_SCALE_FACTOR, BACK_BUTTON_SCALE_FACTOR);
    }
}

