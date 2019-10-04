"use strict";
var bootState = function(game) {

}

bootState.prototype = {
    
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setResizeCallback(this.onResize, this);

    },

    preload: function() {
        //Initialize Phaser
        game.time.desiredFps = 60;
    },
    
    create: function() {
        game.state.start("preloadState");
    },

    onResize: function(){

        var availableWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var availableHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

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
            let widthDifference = Math.abs(availableWidth - GAME_WIDTH);
            let heightDifference = Math.abs(availableHeight - GAME_HEIGHT);

            let target;
            let real;
            if (widthDifference > heightDifference) {
                target = availableWidth;
                real = GAME_WIDTH
            } else {
                target = availableHeight;
                real = GAME_HEIGHT;
            }

            scaleFactor = target / real;
        }
        
        game.scale.setUserScale(scaleFactor);
    }

}