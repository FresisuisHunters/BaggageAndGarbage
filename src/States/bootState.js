"use strict";
var bootState = function (game) {

}

bootState.prototype = {

    init: function () {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.setResizeCallback(this.onResize, this);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.context = this.createAudioContext(game);
        this.locked = this.context.state === 'suspended' && ('ontouchstart' in window || 'onclick' in window);
        if (this.locked)
        {
            this.unlock();
        }
        game.sound.mute = MUTE_AUDIO;
    },

    preload: function () {
        //Initialize Phaser
        game.time.desiredFps = 60;
    },

    create: function () {
        if (localStorage.userLevelData !== null && localStorage.userLevelData !== undefined) {
            game.userLevelData = JSON.parse(localStorage.userLevelData);
        }
        else {
            game.userLevelData = new Map();
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
    },

    unlock: function ()
    {
        var _this = this;

        var unlockHandler = function unlockHandler ()
        {
            _this.context.resume().then(function ()
            {
                document.body.removeEventListener('touchstart', unlockHandler);
                document.body.removeEventListener('touchend', unlockHandler);
                document.body.removeEventListener('click', unlockHandler);

                _this.unlocked = true;
            });
        };

        if (document.body)
        {
            document.body.addEventListener('touchstart', unlockHandler, false);
            document.body.addEventListener('touchend', unlockHandler, false);
            document.body.addEventListener('click', unlockHandler, false);
        }
    },
    createAudioContext: function (game)
    {
        var audioConfig = game.config.audio;

        if (audioConfig && audioConfig.context)
        {
            audioConfig.context.resume();

            return audioConfig.context;
        }

        return new AudioContext();
    }

}