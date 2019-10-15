"use strict"
var menuState = function (game) {

}

const MENU_BACKGROUND_KEY = "MenuBackground";
const EASY_LEVEL_CARD_SPRITE = "EasyLevel";
const NORMAL_LEVEL_CARD_SPRITE = "NormalLevel";
const HARD_LEVEL_CARD_SPRITE = "HardLevel";

const JSON_KEY = "JSONLevel_";
const LEVELS_JSON_DIR = "resources/levels/";
const LEVEL_JSON_PREFIX = "devLevel_";
const LEVEL_JSON_SUFFIX = ".json";

const LEVEL_CARDS_X = 1080 / 2;
const FIRST_LEVEL_Y = 450;
const LEVEL_CARDS_Y_OFFSET = 300;

menuState.prototype = {

    init: function () {
    },

    preload: function () {
        this.loadJSONs();
    },

    // TODO: Cargar JSON en preloadState
    loadJSONs: function () {
        for (let level = 0; level < 3; ++level) {
            let key = JSON_KEY + level;
            let jsonFile = LEVELS_JSON_DIR + LEVEL_JSON_PREFIX + level + LEVEL_JSON_SUFFIX;
            game.load.json(key, jsonFile, true);
        }
    },

    create: function () {
        this.displayBackground();
        this.displayLevelCards();
        this.displayPlayerScores();
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
            let levelCard = game.add.sprite(x, y, cardSpriteKey);
            levelCard.anchor.set(0.5, 0.5);
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

    displayPlayerScores: function () {

    }

}

