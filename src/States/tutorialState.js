"use strict"
var tutorialState = function (game) {

}

const TUTORIAL_PAGE_COUNT = 2;
const TUTORIAL_PAGE_IMAGE_KEY_PREFIX = "img_Tutorial_";

tutorialState.prototype = {
    create: function() {
        this.pages = [];
        this.pageLayer = game.add.group();
        this.buttonLayer = game.add.group();

        this.createPages();
        this.createButtons();

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

        this.homeButton = createBackButton("titleScreenState");
        
        this.previousButtonEnabled = new Phaser.Button(game, this.homeButton.left, this.homeButton.bottom, SPEED_UP_BUTTON_DOWN_IMAGE_KEY, this.showPreviousPageButtonCallback, this);
        this.previousButtonEnabled.scale.x *= -1;
        this.previousButtonEnabled.anchor.setTo(1, 1);

        this.previousButtonDisabled = new Phaser.Button(game, this.homeButton.left, this.homeButton.bottom, SPEED_UP_BUTTON_DOWN_IMAGE_KEY, this.showPreviousPageButtonCallback, this);
        this.previousButtonDisabled.scale.x *= -1;
        this.previousButtonDisabled.anchor.setTo(1, 1);
        
        this.buttonLayer.add(this.previousButtonEnabled);

        this.homeButton.anchor.setTo(0.5, 1);
        this.homeButton.x = GAME_WIDTH / 2;
        this.homeButton.y = this.previousButton.bottom;
        this.buttonLayer.add(this.homeButton);

        this.nextButton = new Phaser.Button(game, GAME_WIDTH - this.previousButtonEnabled.x, this.homeButton.bottom, SPEED_UP_BUTTON_DOWN_IMAGE_KEY, this.showNextPageButtonCallback, this);
        this.nextButton.anchor.setTo(1, 1);
        this.buttonLayer.add(this.nextButton);
    },

    setPageIndex: function(newIndex) {
        this.pages[this.currentPageIndex].visible = false;
        this.currentPageIndex = newIndex;
        this.pages[newIndex].visible = true;

        if (newIndex == 0){
            //this.
        }
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
        button.inputEnabled = false;
    }
}