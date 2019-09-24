"use strict"
const LUGGAGE_SPAWN_DELAY = 10;

function GameManager(levelData) {
    
    //Read the waves
    this.remainingWaves = [];
    for (let wave of levelData.waves) {
        this.remainingWaves.push(wave);
    }
    
    
    
    this.wave = 0;
    this.score = 0;
    this.luggageArray = [];
}

GameManager.prototype = {

    spawnLuggage : function() {

    }

}