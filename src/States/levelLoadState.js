"use strict"
var levelLoadState = function (game) {

}
const CURRENT_LEVEL_DATA_KEY = "currentLevelDataJSON";

levelLoadState.prototype = {
    
    //Save the recieved parameter
    init: function(levelJSONPath) {
        if (levelJSONPath == undefined) {
            console.error("levelLoadState must be started with a path to a level JSON file, but none was given.");
        }
        this.levelJSONPath = levelJSONPath;
    },

    preload: function() {
        //Load the json and overwrite the the previous currentLevelData
        game.load.json(CURRENT_LEVEL_DATA_KEY, this.levelJSONPath, true);
    },

    create: function() {
        let levelData = game.cache.getJSON(CURRENT_LEVEL_DATA_KEY)
        game.state.start("waveManagerDevState", true, false, levelData);
    }
}

