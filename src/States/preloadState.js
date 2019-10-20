"use strict";

const JSON_KEY = "JSONLevel_";
const LEVELS_JSON_DIR = "resources/levels/";
const LEVEL_JSON_PREFIX = "lvl_";
const LEVEL_JSON_SUFFIX = ".json";

const BAG_SPRITE_FOLDER = "resources/sprites/bags/";
const INTERIOR_SPRITE_FOLDER = "resources/sprites/bags/interiores/";

var A_TYPE_BAG_SPRITE_KEYS = [];
var B_TYPE_BAG_SPRITE_KEYS = [];
var C_TYPE_BAG_SPRITE_KEYS = [];

var SAFE_INTERIOR_SPRITE_KEYS = {};
var DANGEROUS_INTERIOR_SPRITE_KEYS = {};


//Especifica las fuentes que se van a descargar de Google Fonts
var WebFontConfig = {
    google: { families: ["Roboto Slab"] }
};


var preloadState = function (game) {

}

preloadState.prototype = {

    preload: function () {
        this.showLoadingScreen();
        
        this.loadBagSprites();
        this.loadInteriorSprites();
        this.loadLevelsJSONs();

        //Carga las fuentes de Google Fonts
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

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

        // Menu sprites
        game.load.image(MENU_BACKGROUND_KEY, "resources/sprites/img_MainMenuBackground.png");
        game.load.image(MENU_INTERFACE_KEY, "resources/sprites/img_LevelSelectBackground.png");
        game.load.image(LOGO_IMAGE_KEY, "resources/sprites/img_Logo.png");
        game.load.image(TUTORIAL_LEVEL_CARD_KEY, "resources/sprites/UI/img_LevelCardTutorial.png");
        game.load.image(EASY_LEVEL_CARD_KEY, "resources/sprites/UI/img_LevelCardEasy.png");
        game.load.image(NORMAL_LEVEL_CARD_KEY, "resources/sprites/UI/img_LevelCardNormal.png");
        game.load.image(HARD_LEVEL_CARD_KEY, "resources/sprites/UI/img_LevelCardHard.png");

        //Audio
        game.load.audio(MENU_MUSIC_KEY, "resources/audio/music_Menu.mp3");
        game.load.audio(GAMEPLAY_MUSIC_KEY, "resources/audio/music_Gameplay.mp3");
        game.load.audio(SFX_BUILT_PATH_KEY, "resources/audio/sfx_BuiltPath.mp3");
        game.load.audio(SFX_CORRECT_BAG_KEY, "resources/audio/sfx_CorrectBag.mp3");
        game.load.audio(SFX_WRONG_BAG_KEY, "resources/audio/sfx_WrongBag.mp3");

        //Fondos
        game.load.image(GAMEPLAY_BACKGROUND_IMAGE_KEY, "resources/sprites/img_GameplayBackground.png");
        game.load.image(GAMEPLAY_FOREGROUND_IMAGE_KEY, "resources/sprites/img_GameplayForeground.png");
        game.load.image(SCORE_BACKGROUND_IMAGE_KEY, "resources/sprites/img_ScoreBackground.png")
        game.load.image(CREDITS_BACKGROUND_IMAGE_KEY, "resources/sprites/img_Credits.png")

        //UI
        game.load.image("img_ScannerBelt", "resources/sprites/img_ScannerBelt.png");
        game.load.image(NEW_WAVE_OVERLAY_KEY, "resources/sprites/img_NewWaveOverlay.png");
        game.load.image(SPEED_UP_BUTTON_DOWN_IMAGE_KEY, "resources/sprites/UI/img_FastForwardActivated.png");
        game.load.image(SPEED_UP_BUTTON_UP_IMAGE_KEY, "resources/sprites/UI/img_FastForwardDeactivated.png");
        game.load.image(OBTAINED_STAR_IMAGE_KEY, "resources/sprites/UI/img_StarObtained.png");
        game.load.image(UNOBTAINED_STAR_IMAGE_KEY, "resources/sprites/UI/img_StarUnobtained.png");
        game.load.image(RETRY_BUTTON_IMAGE_KEY, "resources/sprites/UI/img_RetryButton.png");
        game.load.image(HOME_BUTTON_IMAGE_KEY, "resources/sprites/UI/img_HomeButton.png");

        game.load.spritesheet(CREDITS_BUTTON_SHEET_KEY, "resources/sprites/UI/sheet_ButtonCredits.png", 256, 256, 2, 20, 10);
        game.load.image(SPANISH_PLANE_IMAGE_KEY, "resources/sprites/UI/img_PlaneSpain.png");
        game.load.image(ENGLISH_PLANE_IMAGE_KEY, "resources/sprites/UI/img_PlaneUk.png");

        //Tutorial
        game.load.image("img_Tutorial_1", "resources/sprites/tutorial/img_Tutorial_1.png");
        game.load.image("img_Tutorial_2", "resources/sprites/tutorial/img_Tutorial_2.png");
        game.load.image("img_Tutorial_3", "resources/sprites/tutorial/img_Tutorial_3.png");
        game.load.image("img_Tutorial_4", "resources/sprites/tutorial/img_Tutorial_4.png");
        game.load.image("img_Tutorial_5", "resources/sprites/tutorial/img_Tutorial_5.png");
        game.load.image("img_Tutorial_6", "resources/sprites/tutorial/img_Tutorial_6.png");
        
    },

    showLoadingScreen: function() {
        game.stage.backgroundColor = 0x91bfc2;

        let loadingIcon = game.add.sprite(GAME_WIDTH / 2, TITLE_SCREEN_DIMENSIONS.playButtonY, PLAY_BUTTON_SHEET_KEY);
        loadingIcon.anchor.setTo(0.5, 0.5);
        loadingIcon.scale.setTo(TITLE_SCREEN_DIMENSIONS.playButtonScaleFactor, TITLE_SCREEN_DIMENSIONS.playButtonScaleFactor);
        loadingIcon.animations.add("anim_Loading", [0, 1, 2], 6, true);
        loadingIcon.animations.play("anim_Loading");
    },

    loadLevelsJSONs: function () {
        for (let level = 1; level <= 3; ++level) {
            let key = JSON_KEY + level;
            let jsonFile = LEVELS_JSON_DIR + LEVEL_JSON_PREFIX + level + LEVEL_JSON_SUFFIX;
            game.load.json(key, jsonFile, true);
        }
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
        game.state.start("titleScreenState");
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

        this.loadBagSpriteFromName("img_Maleta_C_ID13_01");
        this.loadBagSpriteFromName("img_Maleta_C_ID14_01");
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

        this.loadInteriorSpriteFromName("img_Interior_S_ID04_01");
        this.loadInteriorSpriteFromName("img_Interior_S_ID04_02");
        this.loadInteriorSpriteFromName("img_Interior_P_ID04_01");
        this.loadInteriorSpriteFromName("img_Interior_P_ID04_02");

        this.loadInteriorSpriteFromName("img_Interior_S_ID09_01");
        this.loadInteriorSpriteFromName("img_Interior_P_ID09_01");

        this.loadInteriorSpriteFromName("img_Interior_P_ID10_01");
        this.loadInteriorSpriteFromName("img_Interior_P_ID10_02");
        this.loadInteriorSpriteFromName("img_Interior_S_ID10_01");
    }
}