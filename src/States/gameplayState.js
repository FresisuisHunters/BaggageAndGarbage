"use strict";
var gameplayState = function (game) {

}

const LEVEL_DIMENSIONS = {
    laneHorizontalMargin: 135,
    laneTopMargin: 420,
    laneBottomMargin: 250,
}
/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
gameplayState.prototype = {

    //INICIALIZACIÓN//
    //////////////////
    init: function(levelData) {
        this.levelData = levelData;
        this.bags = [];
        this.gameHasEnded = false;
    },

    create: function() {
        console.log("Entered gameplayState")
        
        //Crea managers y tal
        this.createGraph(this.levelData.lanes);
        this.createLaneEnds(this.graph, this.onBagKilled, this.levelData.lanes.types, this.bags);
        
        this.pathCreator = new PathCreator(this.graph, this.graph.getColumns(), 
            LEVEL_DIMENSIONS.laneTopMargin, GAME_HEIGHT - LEVEL_DIMENSIONS.laneTopMargin - LEVEL_DIMENSIONS.laneBottomMargin);
        this.waveManager = new WaveManager(this.levelData.waves, this.graph, this.onGameEnd, this.bags, this.lanes, LEVEL_DIMENSIONS.laneTopMargin);
        this.scoreManager = new ScoreManager();
        
        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createGraph: function(laneInfo) {
        let startX = LEVEL_DIMENSIONS.laneHorizontalMargin;
        let startY = LEVEL_DIMENSIONS.laneTopMargin;
        
        let distanceFromFirstToLastLane = GAME_WIDTH - (LEVEL_DIMENSIONS.laneHorizontalMargin * 2);
        let laneCount = laneInfo.count;
        let gapBetweenLanes = distanceFromFirstToLastLane / (laneCount - 1);

        let height = GAME_HEIGHT - startY - LEVEL_DIMENSIONS.laneBottomMargin;

        this.graph = new Graph(laneCount, startX, startY, gapBetweenLanes, height);
    },

    createLaneEnds: function(graph, onBagKilled, laneTypes, bags) {
        this.lanes = [];
        let columns = graph.getColumns();
        
        for (let i = 0; i < columns.length; i++) {
            let type;
            if (laneTypes[i] == "S") type = LaneEndTypes.Safe;
            else if (laneTypes[i] == "D") type = LaneEndTypes.Dangerous;
            else console.error("Wrong lane type in levelData: " + laneTypes[i]);

            this.lanes.push({
                x: columns[i],
                laneEnd: new LaneEnd(type, onBagKilled, bags)
            });
        }
    },

    //GAME LOOP//
    /////////////
    update: function() {
        //Visualización provisional
        this.graph.displayGraph();
        
        if (!this.gameHasEnded) {
            //Updatea todo lo que tenga que ser updateado
            this.pathCreator.update();
            
            //Se recorre hacia atrás porque una maleta puede destruirse durante su update. Hacia adelante nos saltaríamos una maleta cuando eso pasa.
            for (let i = this.bags.length - 1; i >= 0; i--) {
                this.bags[i].update();
            }

            this.waveManager.update(game.time.physicsElapsed);        
        }
    },

    

    //EVENTS//
    //////////
    onGameEnd: function() {
        let state = game.state.getCurrentState();

        state.gameHasEnded = true;
        console.log("The game has ended!");
        
        let starRating = state.scoreManager.getStarRating(state.levelData.starThresholds);
        console.log("You got a rating of " + starRating + " starts!");
    },

    onBagKilled: function(isCorrect) {
        let state = game.state.getCurrentState();
        state.waveManager.notifyOfBagDone();

        if (!isCorrect) state.scoreManager.currentMistakeCount++;
    }
}