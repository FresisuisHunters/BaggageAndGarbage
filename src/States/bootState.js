"use strict";
var bootState = function(game) {

}

bootState.prototype = {
    
    preload: function() {
        //Initialize Phaser
        game.time.desiredFps = 60;
    },
    
    create: function() {
        game.state.start("luggageDevState");
    }

}