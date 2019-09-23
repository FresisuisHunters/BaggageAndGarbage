"use strict";
var preloadState = function (game) {

}

preloadState.prototype = {

    preload: function () {
        this.load.image("luggage_sprite_key",
            "/resources/sprites/luggage_placeholder.png");
    },

    create: function () {
        game.state.start("luggageDevState");
    }

}