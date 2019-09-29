"use strict";
var waveManagerDevState = function (game) {

}

/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
waveManagerDevState.prototype = {

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