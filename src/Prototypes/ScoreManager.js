"use strict"
function ScoreManager() {
    this.currentMistakeCount = 0;
}

ScoreManager.prototype = {
    getStarRating: function(starThresholds) {
        if (starThresholds == null) console.error("No start thresholds were provided.");

        let rating = 0;
        for (let i = 0; i < starThresholds.length; i++) {
            if (this.currentMistakeCount <= starThresholds[i]) rating++; 
        }

        return rating;
    }
}