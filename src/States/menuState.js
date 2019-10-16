"use strict"
var menuState = function (game) {

}

const MENU_BACKGROUND_KEY = "MenuBackground";
const EASY_LEVEL_CARD_SPRITE = "EasyLevel";
const NORMAL_LEVEL_CARD_SPRITE = "NormalLevel";
const HARD_LEVEL_CARD_SPRITE = "HardLevel";

const LEVEL_CARDS_X = 1080 / 2;
const FIRST_LEVEL_Y = 450;
const LEVEL_CARDS_Y_OFFSET = 300;

menuState.prototype = {

    create: function () {
        this.displayBackground();
        this.displayLevelCards();
    },

    displayBackground: function () {
        this.backgroundLayer = game.add.group();

        let backgroundSprite = game.add.sprite(0, 0, MENU_BACKGROUND_KEY);
        backgroundSprite.anchor.set(0, 0);
        this.backgroundLayer.add(backgroundSprite);
    },

    displayLevelCards: function () {
        this.levelCardsLayer = game.add.group();

        for (let level = 0; level < 3; ++level) {
            let key = JSON_KEY + level;
            let levelData = game.cache.getJSON(key);

            let cardSpriteKey = this.getSpriteKey(levelData.difficulty);

            let x = LEVEL_CARDS_X;
            let y = FIRST_LEVEL_Y + level * LEVEL_CARDS_Y_OFFSET;
            let levelButton = game.add.button(x, y, cardSpriteKey, this.onLevelCardClick);
            levelButton.anchor.set(0.5, 0.5);
            // levelButton.id = 0;  // TODO

            // this.displayPlayerScore(levelData.levelIndex);
        }
    },

    getSpriteKey: function (difficulty) {
        switch (difficulty) {
            case 0:
                return EASY_LEVEL_CARD_SPRITE;
            case 1:
                return NORMAL_LEVEL_CARD_SPRITE;
            case 2:
                return HARD_LEVEL_CARD_SPRITE;
            default:
                console.error("Unknow difficulty value \"" + difficulty + "\" found in level JSON");
        }
    },

    onLevelCardClick : function(button) {
        let levelId = button.id;
    },

    displayPlayerScore: function (levelId) {
        let playerScore = game.userLevelData[levelId];
        switch (playerScore) {
            default:
                console.log("ASSas");
                break;
        }
    }

}

