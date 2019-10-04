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
        availableWidth -= CANVAS_MARGIN;

        var availableHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        availableHeight -= CANVAS_MARGIN;

        console.log("Witdth: " + availableWidth);
        console.log("Height: " + availableHeight)

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