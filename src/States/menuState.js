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

const LEVEL_CARDS_X = 50;
const FIRST_LEVEL_Y = 50;
const LEVEL_CARDS_Y_OFFSET = 50;

menuState.prototype = {

    init: function () {
    },

    preload: function () {
        this.loadJSONs();
    },

    loadJSONs: function () {
        for (let level = 0; level < 3; ++level) {
            let key = JSON_KEY + level;
            let jsonFile = LEVELS_JSON_DIR + LEVEL_JSON_PREFIX + level + LEVEL_JSON_SUFFIX;

            console.dir(key);
            console.dir(jsonFile);  

            game.load.json(key, jsonFile, true);
            let levelData = game.cache.getJSON(key);
            // let parsedData = JSON.parse(JSON.stringify(levelData));

            console.dir(levelData);
            // console.dir(parsedData);
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
    },

    displayPlayerScores: function () {

    }

}

