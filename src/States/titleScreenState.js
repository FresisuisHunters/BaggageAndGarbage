"use strict"
var titleScreenState = function (game) {

}

const LOGO_IMAGE_KEY = "img_Logo";
const PLAY_BUTTON_SHEET_KEY = "sheet_PlayButton";
const CREDITS_BUTTON_SHEET_KEY = "sheet_CreditsButton";
const SPANISH_PLANE_IMAGE_KEY = "img_SpanishPlane"
const ENGLISH_PLANE_IMAGE_KEY = "img_EnglishPlane"
const UNSELECTED_LANGUAGE_TINT = 0xaaaaaa;

const TITLE_SCREEN_DIMENSIONS = {
    logoY: 500,
    logoScaleFactor: 0.6,
    playButtonY: 1150,
    playButtonScaleFactor: 1,
    buttonToTextOffset: 0,
    languageButtonMargin: 30,
    languageButtonScaleFactor: 1,
    languageButtonSeparation: 10,
    creditsButtonMargin: 30,
    creditsButtonScaleFactor: 1,
}


const MENU_MUSIC_KEY = "music_Menu"
const MENU_MUSIC_VOLUME = 0.5;
var menuMusic;

titleScreenState.prototype = {

    create: function() {
        this.backgroundLayer = game.add.group();
        this.buttonLayer = game.add.group();

        this.showBackground();
        this.showLogo();
        this.showPlayButton();
        this.showLanguageButtons();
        this.showCreditsButton();

        ensureThatMenuMusicIsPlaying();        
    },

    showBackground: function () {
        let background = new Phaser.Image(game, 0, 0, MENU_BACKGROUND_KEY);
        background.anchor.set(0, 0);
        this.backgroundLayer.add(background);
    },

    showLogo: function() {
        let logo = new Phaser.Image(game, 0, 0, LOGO_IMAGE_KEY);
        logo.anchor.setTo(0.45, 0);
        this.backgroundLayer.add(logo);

        logo.x = GAME_WIDTH / 2;
        logo.y = TITLE_SCREEN_DIMENSIONS.logoY;

        logo.scale.setTo(TITLE_SCREEN_DIMENSIONS.logoScaleFactor, TITLE_SCREEN_DIMENSIONS.logoScaleFactor);
    },

    showPlayButton: function() {
        let callback = function (button, pointer, isOver) {
            if (isOver) {
                game.state.start("levelSelectState");
            }
        }

        let button = new Phaser.Button(game, 0, 0, PLAY_BUTTON_SHEET_KEY, callback, 2, 1, 3, 2);
        button.anchor.setTo(0.5, 0.5);

        button.x = GAME_WIDTH / 2;
        button.y = TITLE_SCREEN_DIMENSIONS.playButtonY;

        button.scale.setTo(TITLE_SCREEN_DIMENSIONS.playButtonScaleFactor, TITLE_SCREEN_DIMENSIONS.playButtonScaleFactor);
        this.buttonLayer.add(button);

        let textStyle = { font: "bold Arial", fontSize: "100px", fill: "#000", align: "center", boundsAlignH: "center", boundsAlignV: "middle" };

        let text = new Phaser.Text(game, button.x, button.bottom + TITLE_SCREEN_DIMENSIONS.buttonToTextOffset, getString("PLAY"), textStyle);
        text.anchor.setTo(0.5, 0);
        this.buttonLayer.add(text);
    },

    showLanguageButtons: function() {

        let planes = [];
        
        this.createLanguagePlane(planes, Languages.Spanish, SPANISH_PLANE_IMAGE_KEY);
        this.createLanguagePlane(planes, Languages.English, ENGLISH_PLANE_IMAGE_KEY);

        for (let i = 0; i < planes.length; i++) {
            if (planes[i].language != localizationManager.currentLanguage) {
                planes[i].tint = UNSELECTED_LANGUAGE_TINT;
            }
        }
    },

    createLanguagePlane: function(planes, language, key) {

        let callback = function(button, pointer, isOver) {
            if (isOver && button.language != localizationManager.currentLanguage) {
                localizationManager.currentLanguage = button.language;
                game.state.start("titleScreenState");
            }
        }

        let y = (planes.length == 0) ? TITLE_SCREEN_DIMENSIONS.languageButtonMargin : planes[planes.length - 1].bottom + TITLE_SCREEN_DIMENSIONS.languageButtonSeparation;
        let plane = new Phaser.Button(game, GAME_WIDTH - TITLE_SCREEN_DIMENSIONS.languageButtonMargin, y, key, callback);
        plane.anchor.setTo(1, 0);
        plane.scale.setTo(TITLE_SCREEN_DIMENSIONS.languageButtonScaleFactor, TITLE_SCREEN_DIMENSIONS.languageButtonScaleFactor);
        plane.language = language;
        this.buttonLayer.add(plane);
        planes.push(plane);
        
    },

    showCreditsButton: function() {

        let callback = function (button, pointer, isOver) {
            if (isOver) {
                game.state.start("creditsState");
            }
        }

        let button = new Phaser.Button(game, TITLE_SCREEN_DIMENSIONS.creditsButtonMargin, GAME_HEIGHT - TITLE_SCREEN_DIMENSIONS.creditsButtonMargin + 20, CREDITS_BUTTON_SHEET_KEY, callback, 2, 1, 3, 2);
        button.anchor.setTo(0, 1);
        button.scale.setTo(TITLE_SCREEN_DIMENSIONS.creditsButtonScaleFactor, TITLE_SCREEN_DIMENSIONS.creditsButtonScaleFactor);
        this.buttonLayer.add(button);

        let textStyle = { font: "bold Arial", fontSize: "60px", fill: "#000", align: "left", boundsAlignH: "left", boundsAlignV: "middle" };

        let text = new Phaser.Text(game, button.right, button.bottom - 30, getString("CREDITS"), textStyle);
        text.anchor.setTo(0, 1);
        this.buttonLayer.add(text);
    },
}

function ensureThatMenuMusicIsPlaying() {
    if (menuMusic == null) menuMusic = game.add.audio(MENU_MUSIC_KEY);
    
    if (!menuMusic.isPlaying) {
        menuMusic.volume = MENU_MUSIC_VOLUME;
        menuMusic.loop = true;
        menuMusic.play();
    }
}