"use strict";
var preloadState = function (game) {

}

preloadState.prototype = {

    preload: function () {
        this.load.image("luggage_sprite_key",
            "/resources/sprites/luggage_placeholder.png");
    },

    create: function () {
        //https://photonstorm.github.io/phaser-ce/Phaser.StateManager.html#start
        game.state.start("levelLoadState", true, false, "resources/levels/devLevel.json");
    }

}