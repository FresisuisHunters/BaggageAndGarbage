"use strict";

const BAG_SPRITE_FOLDER = "resources/sprites/bags/";
const INTERIOR_SPRITE_FOLDER = "resources/sprites/bags/interiores/";

var A_TYPE_BAG_SPRITE_KEYS = [];
var B_TYPE_BAG_SPRITE_KEYS = [];
var C_TYPE_BAG_SPRITE_KEYS = [];

var SAFE_INTERIOR_SPRITE_KEYS = {};
var DANGEROUS_INTERIOR_SPRITE_KEYS = {};

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

        //Objetos del escenario
        game.load.image(LANE_ICON_SPRITE_KEY_SAFE, "resources/sprites/img_LaneIcon_Safe.png");
        game.load.image(LANE_ICON_SPRITE_KEY_DANGER, "resources/sprites/img_LaneIcon_Danger.png");
        game.load.spritesheet(SCANNER_SHEET_KEY,"resources/sprites/sheet_Scanner.png", 256, 256, 3,20, 10);

        //Audio
        game.load.audio(GAMEPLAY_MUSIC_KEY, "resources/audio/music_Gameplay.mp3");
        game.load.audio(SFX_BUILT_PATH_KEY, "resources/audio/sfx_BuiltPath.mp3");
        game.load.audio(SFX_CORRECT_BAG_KEY, "resources/audio/sfx_CorrectBag.mp3");
        game.load.audio(SFX_WRONG_BAG_KEY, "resources/audio/sfx_WrongBag.mp3");
        game.load.audio(SFX_SCANNER_RUNNING_KEY, "resources/audio/sfx_ScannerRunning.mp3");
        game.load.audio(SFX_SCANNER_DETECTED_DANGER_KEY, "resources/audio/sfx_ScannerDetectedDanger.mp3");

        game.load.image(GAMEPLAY_BACKGROUND_IMAGE_KEY, "resources/sprites/img_GameplayBackground.png");
        game.load.image(GAMEPLAY_FOREGROUND_IMAGE_KEY, "resources/sprites/img_GameplayForeground.png");
        game.load.image("img_ScannerBelt", "resources/sprites/img_ScannerBelt.png");
    },

    loadBagSpriteFromName: function(name) {
        game.load.image(name, BAG_SPRITE_FOLDER + name + ".png");

        if (name.includes("_A_")) A_TYPE_BAG_SPRITE_KEYS.push(name);
        else if (name.includes("_B_")) B_TYPE_BAG_SPRITE_KEYS.push(name);
        else if (name.includes("_C_")) C_TYPE_BAG_SPRITE_KEYS.push(name);
    },

    loadInteriorSpriteFromName: function(name) {
        game.load.image(name, INTERIOR_SPRITE_FOLDER + name + ".png");

        let indexOfID = name.indexOf("ID", 0);
        let endOfID = name.indexOf("_", indexOfID);
        let ID = name.substring(indexOfID, endOfID);

        let dictionary;
        if (name.includes("_S_")) dictionary = SAFE_INTERIOR_SPRITE_KEYS;
        else if (name.includes("_P_")) dictionary = DANGEROUS_INTERIOR_SPRITE_KEYS; //P de Peligroso

        if (dictionary[ID] == undefined) dictionary[ID] = [];

        dictionary[ID].push(name);
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
        this.loadBagSpriteFromName("img_Maleta_A_ID01_02");
        this.loadBagSpriteFromName("img_Maleta_A_ID01_03");

        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_00");
        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_01");
        this.loadBagSpriteFromName("img_Maleta_A_ID02_01_02");

        this.loadBagSpriteFromName("img_Maleta_B_ID03_01");
        this.loadBagSpriteFromName("img_Maleta_B_ID03_02");
        this.loadBagSpriteFromName("img_Maleta_B_ID03_03");

        this.loadBagSpriteFromName("img_Maleta_B_ID04_01_00");
        this.loadBagSpriteFromName("img_Maleta_B_ID04_01_01");

        this.loadBagSpriteFromName("img_Maleta_C_ID05_01_00");
        this.loadBagSpriteFromName("img_Maleta_C_ID05_01_01");
        
        this.loadBagSpriteFromName("img_Maleta_C_ID06_01");

        this.loadBagSpriteFromName("img_Maleta_A_ID07_02_00");
        this.loadBagSpriteFromName("img_Maleta_A_ID07_02_01");


        this.loadBagSpriteFromName("img_Maleta_A_ID08_01");
        this.loadBagSpriteFromName("img_Maleta_A_ID08_02");
        this.loadBagSpriteFromName("img_Maleta_A_ID08_03");

        this.loadBagSpriteFromName("img_Maleta_B_ID09_02_00");

        this.loadBagSpriteFromName("img_Maleta_B_ID10_03_00");

        this.loadBagSpriteFromName("img_Maleta_C_ID11_02_00");

        this.loadBagSpriteFromName("img_Maleta_B_ID12_01");
        this.loadBagSpriteFromName("img_Maleta_B_ID12_02");
        this.loadBagSpriteFromName("img_Maleta_B_ID12_03");

    },

    loadInteriorSprites: function() {
        game.load.image(INTERIOR_SPRITE_KEY_A, INTERIOR_SPRITE_FOLDER + "img_Interior_A.png");
        game.load.image(INTERIOR_SPRITE_KEY_C, INTERIOR_SPRITE_FOLDER + "img_Interior_C.png");

        this.loadInteriorSpriteFromName("img_Interior_P_ID03_01");
        this.loadInteriorSpriteFromName("img_Interior_S_ID03_01");

        this.loadInteriorSpriteFromName("img_Interior_P_ID12_01");
        this.loadInteriorSpriteFromName("img_Interior_P_ID12_02");
        this.loadInteriorSpriteFromName("img_Interior_S_ID12_01");
        this.loadInteriorSpriteFromName("img_Interior_S_ID12_02");
    
    }

}