"use strict"
var tutorialState = function (game) {

}

const TUTORIAL_PAGE_COUNT = 6;
const TUTORIAL_PAGE_IMAGE_KEY_PREFIX = "img_Tutorial_";
const TUTORIAL_PAGE_TEXT_KEY_PREFIX = "TUTORIAL_PAGE_";

const TUTORIAL_ARROW_IMAGE_KEY = "img_Arrow";

const TUTORIAL_TEXT_DIMENSIONS = {
    startY: 1300,
    width: 775,
    height: 100,
    fontSize: 42,
    firstPageFontSize: 35,
    lineSpacing: 0
}


tutorialState.prototype = {
    create: function() {
        ensureThatMenuMusicIsPlaying();
        
        this.pages = [];
        this.pageLayer = game.add.group();
        this.buttonLayer = game.add.group();

        let background = new Phaser.Image(game, 0, 0, MENU_BACKGROUND_KEY);
        background.anchor.set(0, 0);
        this.pageLayer.add(background);

        this.createPages();
        this.createButtons();
        this.createText();

        this.currentPageIndex = 0;
        this.setPageIndex(0);
    },

    createPages: function() {
        for (let i = 1; i <= TUTORIAL_PAGE_COUNT; i++) {
            let newPage = new Phaser.Image(game, 0, 0, TUTORIAL_PAGE_IMAGE_KEY_PREFIX + i);
            newPage.anchor.setTo(0, 0);
            this.pageLayer.add(newPage);
            newPage.visible = false;

            this.pages.push(newPage);
        }
    },

    createButtons: function() {

        this.homeButton = createBackButton("levelSelectState");
        
        this.homeButton.anchor.setTo(0.5, 0.5);
        this.homeButton.x = GAME_WIDTH / 2;
        this.homeButton.y = GAME_HEIGHT - 120;
        this.buttonLayer.add(this.homeButton);


        let margin = 30;
        let arrowButtonScaleFactor = 1;

        this.previousButton = new Phaser.Button(game, margin, this.homeButton.y, TUTORIAL_ARROW_IMAGE_KEY, this.showPreviousPageButtonCallback, this);
        this.previousButton.scale.x *= -arrowButtonScaleFactor;
        this.previousButton.scale.y = arrowButtonScaleFactor;
        this.previousButton.anchor.setTo(1, 0.5);
        this.buttonLayer.add(this.previousButton);
        
        this.nextButton = new Phaser.Button(game, GAME_WIDTH - this.previousButton.x, this.previousButton.y, TUTORIAL_ARROW_IMAGE_KEY, this.showNextPageButtonCallback, this);
        this.nextButton.anchor.setTo(1, 0.5);
        this.nextButton.scale.setTo(arrowButtonScaleFactor, arrowButtonScaleFactor);
        this.buttonLayer.add(this.nextButton);
    },

    createText: function() {
        let textStyle = { font: "Roboto Slab", fontSize: TUTORIAL_TEXT_DIMENSIONS.fontSize + "px", fill: "#000", align: "center", 
            boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = new Phaser.Text(game, 0, 0, "", textStyle);
        this.text.wordWrap = true;
        this.text.wordWrapWidth = TUTORIAL_TEXT_DIMENSIONS.width;
        this.text.lineSpacing = TUTORIAL_TEXT_DIMENSIONS.lineSpacing;

        this.text.strokeThickness = 1;

        this.text.setTextBounds((GAME_WIDTH / 2) - (TUTORIAL_TEXT_DIMENSIONS.width / 2), 
            TUTORIAL_TEXT_DIMENSIONS.startY, TUTORIAL_TEXT_DIMENSIONS.width, TUTORIAL_TEXT_DIMENSIONS.height);
        

        this.buttonLayer.add(this.text);
    },

    setPageIndex: function(newIndex) {
        this.pages[this.currentPageIndex].visible = false;
        this.currentPageIndex = newIndex;
        this.pages[newIndex].visible = true;

        if (newIndex == 0){
            this.disableButton(this.previousButton);
            this.enableButton(this.nextButton);
        } else if (newIndex == TUTORIAL_PAGE_COUNT - 1) {
            this.disableButton(this.nextButton);
            this.enableButton(this.previousButton);
        } else {
            this.enableButton(this.nextButton);
            this.enableButton(this.previousButton);
        }

        //Show the appropiate text. Index 0 has no text.
        if(newIndex == 0) {
            this.text.visible = false;
        } else {
            let string = getString(TUTORIAL_PAGE_TEXT_KEY_PREFIX + newIndex);
            this.text.text = string;
            this.text.visible = true;
        }

        if (newIndex == 1) this.text.fontSize = TUTORIAL_TEXT_DIMENSIONS.firstPageFontSize + "px";
        else this.text.fontSize = TUTORIAL_TEXT_DIMENSIONS.fontSize + "px";
        
    },

    showPreviousPageButtonCallback: function(button, pointer, isOver) {
        if (isOver) {
            let index = this.currentPageIndex - 1;
            this.setPageIndex(index);
        }
    },

    showNextPageButtonCallback: function(button, pointer, isOver) {
        if (isOver) {
            let index = this.currentPageIndex + 1;
            this.setPageIndex(index);
        }
    },

    disableButton: function(button) {
        button.visible = false;
    },

    enableButton: function(button) {
        button.visible = true;
    }
}