"use strict";

const BAG_SPRITE_FOLDER = "resources/sprites/bags/";
const INTERIOR_SPRITE_FOLDER = "resources/sprites/interiors/";

var A_TYPE_BAG_SPRITE_KEYS = [];
var B_TYPE_BAG_SPRITE_KEYS = [];
var C_TYPE_BAG_SPRITE_KEYS = [];

var preloadState = function (game) {

}

preloadState.prototype = {

    preload: function () {
        this.loadBagSprites();
        this.loadInteriorSprites();

        //Cintas
        game.load.spritesheet(CONVEYOR_BELT_SHEET_LANE.KEY, "resources/sprites/sheet_ConveyorBelt.png", CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_SIZE, 
            CONVEYOR_BELT_SHEET_LANE.FRAME_COUNT, CONVEYOR_BELT_SHEET_MARGIN, CONVEYOR_BELT_SHEET_SPACING);
        game.load.spritesheet(CONVEYOR_BELT_SHEET_SAFE.KEY, "resources/sprites/sheet_ConveyorAccept.png", CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_SIZE, 
            CONVEYOR_BELT_SHEET_SAFE.FRAME_COUNT, CONVEYOR_BELT_SHEET_MARGIN, CONVEYOR_BELT_SHEET_SPACING);
        game.load.spritesheet(CONVEYOR_BELT_SHEET_DANGER.KEY, "resources/sprites/sheet_ConveyorReject.png", CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_SIZE, 
            CONVEYOR_BELT_SHEET_DANGER.FRAME_COUNT, CONVEYOR_BELT_SHEET_MARGIN, CONVEYOR_BELT_SHEET_SPACING);

        game.load.image(LANE_ICON_SPRITE_KEY_SAFE, "resources/sprites/img_LaneIcon_Safe.png");
        game.load.image(LANE_ICON_SPRITE_KEY_DANGER, "resources/sprites/img_LaneIcon_Danger.png");

        game.load.image(GAMEPLAY_BACKGROUND_IMAGE_KEY, "resources/sprites/img_GameplayBackground.png");
    },

    loadBagSpriteFromName: function(name) {
        game.load.image(name, BAG_SPRITE_FOLDER + name + ".png");

        if (name.includes("_A_")) A_TYPE_BAG_SPRITE_KEYS.push(name);
        else if (name.includes("_B_")) B_TYPE_BAG_SPRITE_KEYS.push(name);
        else if (name.includes("_C_")) C_TYPE_BAG_SPRITE_KEYS.push(name);
    },

    loadInteriorSpriteFromName: function(name) {
        game.load.image(name, INTERIOR_SPRITE_FOLDER + name + ".png");
    },

    create: function () {
        // TODO: Borrar la siguiente linea y descomentar la segunda
        //game.state.start("graphTestingState");

        //https://photonstorm.github.io/phaser-ce/Phaser.StateManager.html#start
        game.state.start("levelLoadState", true, false, "resources/levels/devLevel.json");
        console.log(game.cache.getKeys(Phaser.Cache.IMAGE));
    },

    loadBagSprites: function() {
        this.loadBagSpriteFromName("img_Maleta_A_ID01_01");
        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_00");
        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_01");
        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_02");
        this.loadBagSpriteFromName("img_Maleta_A_ID07_02_00");
        this.loadBagSpriteFromName("img_Maleta_A_ID07_02_01");
        this.loadBagSpriteFromName("img_Maleta_B_ID03_01");
        this.loadBagSpriteFromName("img_Maleta_B_ID04_01");
        this.loadBagSpriteFromName("img_Maleta_C_ID05_01");
        this.loadBagSpriteFromName("img_Maleta_C_ID06_01");

    },

    loadInteriorSprites: function() {

    }

}