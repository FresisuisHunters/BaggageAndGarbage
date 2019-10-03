"use strict";
var gameplayState = function (game) {

}

/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
gameplayState.prototype = {

    //INITIALIZACIÓN//
    //////////////////
    init: function(levelData) {
        this.levelData = levelData;
        this.bags = [];
    },

    create: function() {
        console.log("Entered waveManagerDevSate")
        
        //Crea managers y tal
        this.createGraph(this.levelData.lanes);
        this.createLaneEnds(this.graph, this.onBagKilled, this.levelData, this.bags);
        
        this.pathCreator = new PathCreator(this.graph, this.levelData, this.lanes);
        this.waveManager = new WaveManager(this.levelData, this.graph, this.endGame, this.bags, this.lanes);
        
        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createGraph: function(laneInfo) {
        this.graph = new Graph(laneInfo.count, laneInfo.startX, laneInfo.startY, laneInfo.gap, laneInfo.height);
    },

    createLaneEnds: function(graph, onBagKilled, levelData, bags) {
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
    update: function() {
        //Visualización provisional
        this.graph.displayGraph();
        
        //Updatea todo lo que tenga que ser updateado
        this.pathCreator.update();
        this.waveManager.update(game.time.physicsElapsed);        

        //Se recorre hacia atrás porque una maleta puede destruirse durante su update. Hacia adelante nos saltaríamos una maleta cuando eso pasa.
        for (let i = this.bags.length - 1; i >= 0; i--) {
            this.bags[i].update();
        }
    },

    endGame: function() {
        console.log("Game ended!");
    },

    //EVENTS//
    //////////
    onBagKilled: function(isCorrect) {
        let state = game.state.getCurrentState();
        state.waveManager.notifyOfBagDone();
    }
}