"use strict";

window.PhaserGlobal = { disableWebAudio: true };

var bootState = function (game) {

}

bootState.prototype = {

    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setResizeCallback(this.onResize, this);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        

        /*
        if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) {
            this.game.sound.touchLocked = true;
            this.game.input.touch.addTouchLockCallback(function () {
                if (this.noAudio || !this.touchLocked || this._unlockSource !== null) {
                    return true;
                }
                if (this.usingWebAudio) {
                    // Create empty buffer and play it
                    // The SoundManager.update loop captures the state of it and then resets touchLocked to false
        
                    var buffer = this.context.createBuffer(1, 1, 22050);
                    this._unlockSource = this.context.createBufferSource();
                    this._unlockSource.buffer = buffer;
                    this._unlockSource.connect(this.context.destination);
        
                    if (this._unlockSource.start === undefined) {
                        this._unlockSource.noteOn(0);
                    }
                    else {
                        this._unlockSource.start(0);
                    }
        
                    //Hello Chrome 55!
                    if (this._unlockSource.context.state === 'suspended') {
                        this._unlockSource.context.resume();
                    }
                }
        
                //  We can remove the event because we've done what we needed (started the unlock sound playing)
                return true;
        
            }, this.game.sound, true);
        }

        */
        
        //game.sound.mute = MUTE_AUDIO;
    },

    preload: function () {
        //Initialize Phaser
        game.time.desiredFps = 60;

        //Load what we need for the loading screen
        game.load.spritesheet(PLAY_BUTTON_SHEET_KEY, "resources/sprites/sheet_ButtonPlay.png", 256, 256, 4, 20, 10);
    },

    create: function () {
        if (localStorage.userLevelData !== null && localStorage.userLevelData !== undefined) {
            game.userLevelData = JSON.parse(localStorage.userLevelData);
        }
        else {
            game.userLevelData = new Map();
            game.userLevelData.levelIndexToComplete = 1;
        }
            
        console.log("localStorage" + localStorage.userLevelData);

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

        console.log("Scaling for available dimensions: (" + availableWidth + ", " + availableHeight + ")");

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