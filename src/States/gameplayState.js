"use strict";
var gameplayState = function (game) {

}

/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
gameplayState.prototype = {

    //INICIALIZACIÓN//
    //////////////////
    init: function (levelData) {
        this.levelData = levelData;
        this.bags = [];
        this.scanners = [];
        this.gameHasEnded = false;
    },

    create: function () {
        console.log("Entered gameplayState")

        //Crea managers y tal
        this.createGraph(this.levelData.lanes);
        this.createLaneEnds(this.graph, this.onBagKilled, this.levelData, this.bags);

        this.pathCreator = new PathCreator(this.graph, this.levelData, this.lanes);
        this.waveManager = new WaveManager(this.levelData, this.graph, this.onGameEnd, this.bags, this.lanes);
        this.scoreManager = new ScoreManager();

        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createGraph: function (laneInfo) {
        this.graph = new Graph(laneInfo.count, laneInfo.startX, laneInfo.startY, laneInfo.gap, laneInfo.height);
    },

    createLaneEnds: function (graph, onBagKilled, levelData, bags) {
        this.lanes = [];
        let columns = graph.getColumns();

        for (let i = 0; i < columns.length; i++) {
            let type;
            if (levelData.lanes.types[i] == "S") type = LaneEndTypes.Safe;
            else if (levelData.lanes.types[i] == "D") type = LaneEndTypes.Dangerous;
            else console.error("Wrong lane type in levelData: " + levelData.lanes.types[i]);

            this.lanes.push({
                x: columns[i],
                laneEnd: new LaneEnd(type, onBagKilled, bags)
            });
        }
    },

    //GAME LOOP//
    /////////////
    update: function () {
        //Visualización provisional
        this.graph.displayGraph();

        if (!this.gameHasEnded) {
            //Updatea todo lo que tenga que ser updateado
            this.pathCreator.update();

            //Se recorre hacia atrás porque una maleta puede destruirse durante su update. Hacia adelante nos saltaríamos una maleta cuando eso pasa.
            for (let i = this.bags.length - 1; i >= 0; i--) {
                this.bags[i].update();
                for (let j = 0; j < scanners.lenth; j++) {
                    if (scanners[j].belt == bag.position.x && scanners[j].start <= (bag.position.y+BAG_MOVEMENT_SPEED))
                    {
                        scanners[j].EnterBag(bags[i]);
                        bags.splice(i,1);
                        timer = game.time.create(true)
                        timer.add(SCAN_TIME,this.onBagScanned,this,scanners[j]);
                    }
                }
            }

            this.waveManager.update(game.time.physicsElapsed);
        }
    },



    //EVENTS//
    //////////
    onGameEnd: function () {
        let state = game.state.getCurrentState();

        state.gameHasEnded = true;
        console.log("The game has ended!");

        let starRating = state.scoreManager.getStarRating(state.levelData.starThresholds);
        console.log("You got a rating of " + starRating + " starts!");
    },

    onBagKilled: function (isCorrect) {
        let state = game.state.getCurrentState();
        state.waveManager.notifyOfBagDone();

        if (!isCorrect) state.scoreManager.currentMistakeCount++;
    },

    onBagScanned: function (scanner) {
        bags.push(scanner.ExitBag());
    }
}