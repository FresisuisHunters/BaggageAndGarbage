"use strict"

const TIME_BETWEEN_BAG_SPAWNS = 1;
const CONVEYOR_SPAWN_COOLDOWN = 2;

const TIME_BETWEEN_WAVES = 4;

/*
Para utilizar WaveManger desde un estado de gameplay, hay que hacer estas cosas:
- Llamar startNextWave() para empezar la primera oleada.
- Llamar update() desde el update() del estado.
- Pasar un callback onLastWaveDone al constructor. El callback se llamará cuando se acabé la última oleada.
*/
function WaveManager(waves, graph, onNonLastWaveDone, onLastWaveDone, bagList, lanes, startY) {
    
    this.waves = waves;
    this.graph = graph;
    this.bags = bagList;
    this.lanes = lanes;
    this.startY = startY;

    //Read the waves
    this.remainingWaves = [];
    for (let wave of waves) {
        this.remainingWaves.push(wave);
    }

    //Initialize the conveyor belt spawn timers
    this.timesSinceSpawnAtConveyorBelt = [];
    for (let i = 0; i < lanes.length; i++) {
        this.timesSinceSpawnAtConveyorBelt.push(100000);
    }

    //Cached to avoid creating garbage
    this.offCooldownBelts = []

    //Assign the callbacks
    this.onNonLastWaveDone = onNonLastWaveDone;
    this.onLastWaveDone = onLastWaveDone;
}

WaveManager.prototype = {

    startNextWave: function() {
        if (this.remainingWaves.length == 0) console.error("Attempted to start next wave, but there were no remaining waves.");

        this.currentWave = this.remainingWaves.shift();
        
        this.currentWave.totalBagAmount = this.currentWave.numA + this.currentWave.numB_Safe + this.currentWave.numB_Danger + this.currentWave.numC;
        this.currentWaveDoneBagAmount = 0;
        this.tSinceLastSpawn = 0;
    },

    update: function(dt) {
        //If we're currently on a wave
        if (this.currentWave) {
            //Are there bags to spawn left?
            if (!this.waveIsEmpty(this.currentWave)) {
                
                //Increment the timers
                this.tSinceLastSpawn += dt;
                for (let i = 0; i < this.timesSinceSpawnAtConveyorBelt.length; i++) {
                    this.timesSinceSpawnAtConveyorBelt[i] += dt;
                }

                //Spawn a bag if it's been long enough
                if (this.tSinceLastSpawn > TIME_BETWEEN_BAG_SPAWNS) {
                    this.spawnNextBag();
                    this.tSinceLastSpawn -= TIME_BETWEEN_BAG_SPAWNS;
                }
            }
        } 
        //If there is no current wave
        else {
            //If there are no more waves
            if (this.remainingWaves.length == 0) {
                this.onLastWaveDone();
            }
            else {
                //Wait until it's time to start the next wave
                this.timeSinceWaveEnd += dt;

                if (this.timeSinceWaveEnd > TIME_BETWEEN_WAVES) {
                    this.startNextWave();
                }
            }
        } 
    },

    notifyOfBagDone: function() {
        if (!this.currentWave) { 
            console.error("A bag was notified as done, but there was no current wave. Was the wave finished too soon?.");
            return;
        }

        this.currentWaveDoneBagAmount++;

        if (this.currentWaveDoneBagAmount == this.currentWave.totalBagAmount) {
            this.endCurrentWave();
        }
    },

    //#region Internal Stuff
    spawnNextBag: function() {

        if (this.waveIsEmpty(this.currentWave)) console.error("Attempting to spawn the next bag of an empty wave.");

        let bagType = this.chooseRandomBagTypeFromRemaining(this.currentWave);
        
        //Take it out of the pool
        switch (bagType) {
            case BagTypes.A:
                this.currentWave.numA--;
                break;
            case BagTypes.B_Safe:
                this.currentWave.numB_Safe--;
                break;
            case BagTypes.B_Danger:
                this.currentWave.numB_Danger--;
                break;
            case BagTypes.C:
                this.currentWave.numC--;
                break;
        }

        let beltIndex = this.chooseRandomConveyorBeltIndex();

        //Reset the belt's cooldown
        this.timesSinceSpawnAtConveyorBelt[beltIndex] = 0;

        this.spawnBag(bagType, beltIndex);
        
    },

    spawnBag: function(type, beltIndex) {
        let bag = new Bag(type, new Vector2D(this.lanes[beltIndex].x, this.startY), this.graph, this.lanes);
        this.bags.push(bag);
    },

    waveIsEmpty: function(wave) {
        return wave.numA == 0 && wave.numB_Safe == 0 && wave.numB_Danger == 0 && wave.numC == 0;
    },

    endCurrentWave: function() {
        this.currentWave = null;
        this.timeSinceWaveEnd = 0;

        if (this.remainingWaves.length != 0) {
            this.onNonLastWaveDone();
        }
    },

    chooseRandomBagTypeFromRemaining: function(wave) {
        //Get the proportions
        let amountLeft = wave.numA + wave.numB_Safe + wave.numB_Danger + wave.numC; 
        let aProportion = wave.numA / amountLeft;
        let bSafeProportion = wave.numB_Safe / amountLeft;
        let bDangerProportion = wave.numB_Danger / amountLeft;
        let r = Math.random();

        //Check the result
        let threshold = aProportion;
        if (r < threshold) return BagTypes.A;
        threshold += bSafeProportion;
        if (r < threshold) return BagTypes.B_Safe;
        threshold += bDangerProportion;
        if (r < threshold) return BagTypes.B_Danger;
        else return BagTypes.C;
    },

    chooseRandomConveyorBeltIndex() {
        this.offCooldownBelts.length = 0;
        for (let i = 0; i < this.timesSinceSpawnAtConveyorBelt.length; i++) {
            if (this.timesSinceSpawnAtConveyorBelt[i] > CONVEYOR_SPAWN_COOLDOWN) this.offCooldownBelts.push(i);
        }

        if (this.offCooldownBelts.length == 0) {
            console.warn("All conveyor belts are on cooldown and we're still spawning. Defaulting to the least recent one.");
            let highestValue = -1;
            let lowestIndex = -1;

            for (let i = 0; i < this.timesSinceSpawnAtConveyorBelt.length; i++) {
                if (this.timesSinceSpawnAtConveyorBelt[i] > highestValue) {
                    highestValue = this.timesSinceSpawnAtConveyorBelt[i];
                    lowestIndex = i;
                } 
            }

            return lowestIndex;
        } else {
            return this.offCooldownBelts[Math.floor(Math.random() * this.offCooldownBelts.length)];
        }
    }

    //#endregion

}