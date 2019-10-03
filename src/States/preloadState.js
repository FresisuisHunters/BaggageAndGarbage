"use strict";
var preloadState = function (game) {

}

preloadState.prototype = {

    preload: function () {
        this.load.image("bag_sprite_key",
            "/resources/sprites/bag_placeholder.png");
    },

    create: function () {
        // TODO: Borrar la siguiente linea y descomentar la segunda
        //game.state.start("graphTestingState");

        //https://photonstorm.github.io/phaser-ce/Phaser.StateManager.html#start
        game.state.start("levelLoadState", true, false, "resources/levels/devLevel.json");
    }

}