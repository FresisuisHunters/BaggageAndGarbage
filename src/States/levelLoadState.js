"use strict"
var levelLoadState = function (game) {

}
const CURRENT_LEVEL_DATA_KEY = "currentLevelDataJSON";

/*
Hay que utilizar este estado para empezar un nivel.
Recibe el path a un JSON de nivel, y se enmcarga de cargar todo lo necesario. 
Empezará el estado de gameplay una vez esté todo listo.
*/
levelLoadState.prototype = {
    
    //Save the recieved parameter
    init: function(levelJSONKey) {
        if (levelJSONKey == undefined) {
            console.error("levelLoadState must be started with a path to a level JSON file, but none was given.");
        }
        this.levelJSONKey = levelJSONKey;
    },

    create: function() {
        let levelData = game.cache.getJSON(this.levelJSONKey);
        game.state.start("gameplayState", true, false, levelData);
    }
}

