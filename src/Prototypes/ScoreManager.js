"use strict"
function ScoreManager() {
    this.currentCorrectBagCount = 0;
    this.currentWrongBagCount = 0;
}

ScoreManager.prototype = {
    getStarRating: function(starThresholds) {
        if (starThresholds == null) console.error("No start thresholds were provided.");

        let rating = 0;
        for (let i = 0; i < starThresholds.length; i++) {
            if (this.currentWrongBagCount <= starThresholds[i]) rating++; 
        }

        return rating;
    }
}