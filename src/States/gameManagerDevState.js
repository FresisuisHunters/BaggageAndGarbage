"use strict";
var gameManagerDevState = function (game) {

}

gameManagerDevState.prototype = {

    init: function(levelData) {
        this.levelData = levelData;
    },

    create: function() {
        console.log("Entered gameManagerDevSate")
        
        this.gameManager = new GameManager(this.levelData);
    }



}