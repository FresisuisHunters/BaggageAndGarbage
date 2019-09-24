"use strict"
const LUGGAGE_SPAWN_DELAY = 10;
const CONVEYOR_SPAWN_COOLDOWN = 1;




function GameManager(levelData) {
    
    //Read the waves
    this.remainingWaves = [];
    for (let wave of levelData.waves) {
        this.remainingWaves.push(wave);
    }

    //Initialize the conveyor belt spawn timers
    this.timesSinceSpawnAtConveyorBelt = [];
    for (let i = 0; i < levelData.conveyorBeltCount; i++) {
        this.timesSinceSpawnAtConveyorBelt.push(100000);
    }
     
    this.wave = 0;
    this.score = 0;
    this.luggageArray = [];

    //Cached to avoid creating garbage
    this.offCooldownBelts = []
}

GameManager.prototype = {

    startNextWave: function() {
        if (this.remainingWaves.length == 0) console.error("Attempted to start next wave, but there were no remaining waves.");

        this.currentWave = this.remainingWaves.shift();

        for (let i = 0; i < 8; i++) {
            this.spawnNextLuggage();
        }
        
    },

    spawnNextLuggage: function() {
        let luggageType = this.chooseRandomLuggageTypeFromRemaining(this.remainingWaves);
        //Take it out of the pool
        switch (luggageType) {
            case LuggageTypes.A:
                this.currentWave.numA--;
                break;
            case LuggageTypes.B_Safe:
                this.currentWave.numB_Safe--;
                break;
            case LuggageTypes.B_Danger:
                this.currentWave.numB_Danger--;
                break;
            case LuggageTypes.C:
                this.currentWave.numC--;
                break;
        }

        let beltIndex = this.chooseRandomConveyorBeltIndex();
        //Reset the cooldown
        this.timesSinceSpawnAtConveyorBelt[beltIndex] = 0;

        console.log("Creating luggage of type " + luggageType + " at conveir belt nº" + beltIndex);
        
    },

    chooseRandomLuggageTypeFromRemaining: function(wave) {
        //Get the proportions
        let amountLeft = this.currentWave.numA + this.currentWave.numB_Safe + this.currentWave.numB_Danger + this.currentWave.numC; 
        if (amountLeft <= 0) console.error("There is no luggage left in this wave.");
        let aProportion = this.currentWave.numA / amountLeft;
        let bSafeProportion = this.currentWave.numB_Safe / amountLeft;
        let bDangerProportion = this.currentWave.numB_Danger / amountLeft;
        let r = Math.random();

        //Check the result
        let threshold = aProportion;
        if (r < threshold) return LuggageTypes.A;
        threshold += bSafeProportion;
        if (r < threshold) return LuggageTypes.B_Safe;
        threshold += bDangerProportion;
        if (r < threshold) return LuggageTypes.B_Danger;
        else return LuggageTypes.C;
    },

    chooseRandomConveyorBeltIndex() {
        this.offCooldownBelts.length = 0;
        for (let i = 0; i < this.timesSinceSpawnAtConveyorBelt.length; i++) {
            if (this.timesSinceSpawnAtConveyorBelt[i] > CONVEYOR_SPAWN_COOLDOWN) this.offCooldownBelts.push(i);
        }

        if (this.offCooldownBelts.length == 0) {
            console.warn("All conveyor belts are on cooldown and we're still spawning. Defaulting to the oldest one.");
            let lowestValue = 1000000;
            let lowestIndex = -1;

            for (let i = 0; i < this.timesSinceSpawnAtConveyorBelt.length; i++) {
                if (this.timesSinceSpawnAtConveyorBelt[i] < lowestValue) {
                    lowestValue = this.timesSinceSpawnAtConveyorBelt[i];
                    lowestIndex = i;
                } 
            }

            return lowestIndex;
        } else {
            return this.offCooldownBelts[Math.floor(Math.random() * this.offCooldownBelts.length)];
        }
    }



}