"use strict";
var waveManagerDevState = function (game) {

}

waveManagerDevState.prototype = {

    //When starting the state game.state.start(), an already parsed levelData must be given.
    //This state should only be started from levelLoadState, which receieves the path to the JSON and reads the data.
    init: function(levelData) {
        this.levelData = levelData;
    },

    create: function() {
        console.log("Entered waveManagerDevSate")
        
        this.waveManager = new WaveManager(this.levelData, this.endGame);
        this.waveManager.startNextWave();
    },

    update: function() {
        this.waveManager.update(game.time.physicsElapsed);
    },

    endGame: function() {
        console.log("Game ended!");
    }





}