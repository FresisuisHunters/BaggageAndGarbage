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

    init: function(levelData) {
        this.levelData = levelData;
    },

    create: function() {
        console.log("Entered waveManagerDevSate")
        
        //Set up input events
        game.input.onDown.add(this.onTouchStart, this);
        game.input.onUp.add(this.onTouchEnd, this);

        this.createLanes(this.levelData.lanes);

        this.waveManager = new WaveManager(this.levelData, this.endGame);
        this.waveManager.startNextWave();
    },

    createLanes: function(laneInfo) {
        this.graph = new Graph(laneInfo.count, laneInfo.startX, laneInfo.startY, laneInfo.gap, laneInfo.height);
        this.lanes = this.graph.getColumns();
    },

    update: function() {
        this.graph.displayGraph();
        this.waveManager.update(game.time.physicsElapsed);        
    },

    onTouchStart: function(pointer) {
        let point = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));
    
        if (point != null)
        {
            this.pathDrawProcess = {
                startPoint: point
            };
        }
    },

    onTouchEnd: function(pointer) {
        if (this.pathDrawProcess != null) {
            let endPoint = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));
            if (endPoint != null) {
                console.log("Creating path");
                this.graph.addPath(this.pathDrawProcess.startPoint, endPoint);
                
            }

            this.pathDrawProcess = null;
        }
    },

    //Devuelve null si el punto no es válido para dibujar un camino, el punto tocado si no
    getGraphPointFromTouch: function(touchPoint) {
        //See if the height is fine
        let minAllowedY = this.levelData.lanes.startY;
        let maxAllowedY = minAllowedY + this.levelData.lanes.height;

        if (touchPoint.y < minAllowedY || touchPoint.y > maxAllowedY) return null;
        
        //See which, if any, lane this is.
        let laneIndex = -1;
        let smallestDistance = 100000;
        for(let i = 0; i < this.lanes.length; i++)
        {
            let distance = Math.abs(this.lanes[i] - touchPoint.x);
            if (distance <= PATH_DRAW_TOLERANCE && distance < smallestDistance) {
                smallestDistance = distance;
                laneIndex = i;
            }
        }

        if (laneIndex != -1) {
            return new Vector2D(this.lanes[laneIndex], touchPoint.y);
        }
        else return null;
    },

    endGame: function() {
        console.log("Game ended!");
    }


}