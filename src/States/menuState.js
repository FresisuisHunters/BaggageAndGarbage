"use strict"
var menuState = function (game) {

}

const MENU_BACKGROUND_KEY = "MenuBackground";
const MENU_INTERFACE_KEY = "MenuInterface";
const EASY_LEVEL_CARD_SPRITE = "EasyLevel";
const NORMAL_LEVEL_CARD_SPRITE = "NormalLevel";
const HARD_LEVEL_CARD_SPRITE = "HardLevel";

const MENU_TEXT_X = 1080/2 - 140;
const MENU_TEXT_Y = 45;

const LEVEL_CARDS_X = 1080 / 2;
const FIRST_LEVEL_Y = 450;
const LEVEL_CARDS_Y_OFFSET = 300;

const FIRST_STAR_X = -107.5;
const STARS_X_OFFSET = 90;
const STAR_Y = -47.5;
const STAR_SPRITE_SCALE = 0.5;

menuState.prototype = {

    create: function () {
        this.backgroundLayer = game.add.group();
        this.levelCardsLayer = game.add.group();
        this.overlayLayer = game.add.group();

        this.displayMenuText();
        this.displayBackground();
        this.displayLevelCards();
    },

    displayMenuText : function() {
        let textStyle = { font: "bold Arial", fontSize: "80px", fill: "#eee", align: "left", boundsAlignH: "right", boundsAlignV: "middle" };
        let text = new Phaser.Text(game, MENU_TEXT_X, MENU_TEXT_Y, "SELECT YOUR\nDESTINATION", textStyle);
        text.anchor.set(0, 0);
        this.overlayLayer.add(text);
    },

    displayBackground: function () {
        let backgroundSprite = game.add.sprite(0, 0, MENU_BACKGROUND_KEY);
        backgroundSprite.anchor.set(0, 0);
        this.backgroundLayer.add(backgroundSprite);

        let interfaceSprite = game.add.sprite(0, 0, MENU_INTERFACE_KEY);
        interfaceSprite.anchor.set(0, 0);
        this.backgroundLayer.add(interfaceSprite);
    },

    displayLevelCards: function () {
        for (let level = 0; level < 3; ++level) {
            let key = JSON_KEY + level;
            let levelData = game.cache.getJSON(key);

            let cardSpriteKey = this.getSpriteKey(levelData.difficulty);

            let x = LEVEL_CARDS_X;
            let y = FIRST_LEVEL_Y + level * LEVEL_CARDS_Y_OFFSET;

            let card;
            if (levelData.levelIndex > game.userLevelData.levelIndexToComplete) {
                card = game.add.image(x, y, cardSpriteKey);
                //card.tint = UNSELECTED_LANGUAGE_TINT;
            } else {
                card = game.add.button(x, y, cardSpriteKey, this.onLevelCardClick);
            }

            card.anchor.set(0.5, 0.5);
            card.levelIndex = levelData.levelIndex;

            this.levelCardsLayer.add(card);

            if (level <= game.userLevelData.levelIndexToComplete) {
                this.displayPlayerScore(x, y, levelData.levelIndex);
                this.displayPlayText(x, y);
            }
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
        let levelIndex = button.levelIndex;
        if (levelIndex > game.userLevelData.levelIndexToComplete) {
            return;
        }

        let clickedLevelJSONKey = JSON_KEY + levelIndex;
        game.state.start("levelLoadState", true, false, clickedLevelJSONKey);
    },

    displayPlayerScore: function (cardX, cardY, levelIndex) {
        let playerScore = game.userLevelData[levelIndex];

        if (playerScore > 3) {
            console.error("Error displaying player scores. Unknown score value: " + playerScore);
            return;
        }

        if (playerScore === undefined) {
            playerScore = 0;
        }

        for (let i = 0; i < 3; ++i) {
            let obtainedStar = i < playerScore;
            let starSpriteKey = (obtainedStar) ? OBTAINED_STAR_IMAGE_KEY : UNOBTAINED_STAR_IMAGE_KEY;

            let x = cardX + FIRST_STAR_X + i * STARS_X_OFFSET;
            let y = cardY + STAR_Y;
            let starSprite = game.add.sprite(x, y, starSpriteKey);
            starSprite.anchor.set(0.5, 0.5);
            starSprite.scale.setTo(STAR_SPRITE_SCALE, STAR_SPRITE_SCALE);

            this.overlayLayer.add(starSprite);
        }
    },

    displayPlayText: function(cardX, cardY) {
        let textStyle = { font: "bold Arial", fontSize: "35px", fill: "#000", align: "right", boundsAlignH: "right", boundsAlignV: "middle" };
        let x = cardX + 227.5;
        let y = cardY - 58.5;
        let text = new Phaser.Text(game, x, y, "EMBARK", textStyle);
        text.anchor.set(0.5, 0.5);
        this.overlayLayer.add(text);
    }

}

