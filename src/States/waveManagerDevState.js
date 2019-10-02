"use strict";
var waveManagerDevState = function (game) {

}

const PATH_DRAW_TOLERANCE = 20;
/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
waveManagerDevState.prototype = {


    //INITIALIZACIÓN//
    //////////////////
    init: function(levelData) {
        this.levelData = levelData;
    },

    create: function() {
        console.log("Entered waveManagerDevSate")
        
        //Create managers and such
        this.createGraph(this.levelData.lanes);
        this.pathCreator = new PathCreator(this.graph, this.levelData, this.lanes);
        this.waveManager = new WaveManager(this.levelData, this.endGame);

        //this.waveManager.startNextWave();
        this.testBag = new Bag(0, new Vector2D(this.levelData.lanes.startX, this.levelData.lanes.startY), this.graph);
    },

    createGraph: function(laneInfo) {
        this.graph = new Graph(laneInfo.count, laneInfo.startX, laneInfo.startY, laneInfo.gap, laneInfo.height);
        this.lanes = this.graph.getColumns();
    },

    //GAME LOOP//
    /////////////
    update: function() {
        //Visualización provisional
        this.graph.displayGraph();
        
        this.pathCreator.update();
        this.waveManager.update(game.time.physicsElapsed);        

        this.testBag.update();
    },

    

    endGame: function() {
        console.log("Game ended!");
    }


}