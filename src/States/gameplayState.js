"use strict";
var gameplayState = function (game) {

}

const GAMEPLAY_BACKGROUND_IMAGE_KEY = "img_GameplayBackground";
const GAMEPLAY_FOREGROUND_IMAGE_KEY = "img_GameplayForeground";
const SCORE_BACKGROUND_IMAGE_KEY = "img_ScoreBackground"

const GAMEPLAY_MUSIC_KEY = "music_Gameplay";
const GAMEPLAY_MUSIC_VOLUME = .75;

// Game speed
const DEFAULT_GAME_SPEED = 1;
const SPED_UP_GAME_SPEED = DEFAULT_GAME_SPEED / 5;
const SPEED_UP_BUTTON_DOWN_IMAGE_KEY = "img_SpeedUpButtonDown";
const SPEED_UP_BUTTON_UP_IMAGE_KEY = "img_SpeedUpButtonUp";

// Level layout
const LEVEL_DIMENSIONS = {
    laneHorizontalMargin: 135,
    laneTopMargin: 313,
    laneBottomMargin: 259,
    scannerScreenWidth: 609
}

//End screen stuff
const SCORE_SCREEN_DIMENSIONS = {
    starY: 525,
    starRatingWidth: 325,
    starScaleFactor: 0.8,
    numberRightX: 750,
    wrongNumberY: 735,
    correctNumberY: 960,
    buttonY: 1600,
    buttonSpacing: 50,
    buttonScale: 1.75
}

const OBTAINED_STAR_IMAGE_KEY = "img_StarObtained"
const UNOBTAINED_STAR_IMAGE_KEY = "img_StarUnobtained"
const RETRY_BUTTON_IMAGE_KEY = "img_RetryButton"
const HOME_BUTTON_IMAGE_KEY = "img_HomeButton"

//Layers
var backgroundLayer;
var laneLayer;
var pathLayer;
var bagLayer;
var overlayLayer;

/*
El estado de gameplay no debería empezarse directamente. 
Empieza levelLoadState con un path a un JSON de nivel. 
levelLoadState se encargará de empezar el estado de gaemplay cuando todo esté listo.
*/
gameplayState.prototype = {

    //INICIALIZACIÓN//
    //////////////////
    init: function (levelData) {
        this.originalLevelData = JSON.parse(JSON.stringify(levelData));
        this.levelData = levelData;
        this.bags = [];
        this.scanners = [];
        this.gameHasEnded = false;
    },

    create: function () {
        
        //Tiempo normal
        game.time.slowMotion = DEFAULT_GAME_SPEED;
        game.time.desiredFps = 60 * game.time.slowMotion;

        //El orden en el que se crean es el orden en el que dibujan. Es decir, el último se dibuja por encima del resto.
        backgroundLayer = game.add.group();
        laneLayer = game.add.group();
        pathLayer = game.add.group();
        bagLayer = game.add.group();
        overlayLayer = game.add.group();
        this.createBackground();

        //Crea los carriles
        this.createGraph();
        this.createLaneEnds(this.graph, this.onBagKilled, this.bags);
        this.createLaneConveyorBelts(this.graph.getColumns());
        this.createSpeedUpButton();

        this.mask = this.getPathMask(this.graph);
        pathLayer.mask = this.mask;

        this.createScanners(this.levelData.scanners, this.lanes);

        //Crea las máscaras
        this.pathMask = this.getPathMask(this.graph);
        pathLayer.mask = this.pathMask;

        let bagMask = this.getBagMask();
        bagLayer.mask = bagMask;

        //Crea los managers
        this.pathCreator = new PathCreator(this.graph, this.graph.getColumns(),
            LEVEL_DIMENSIONS.laneTopMargin, GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin);
        this.waveManager = new WaveManager(this.levelData.waves, this.graph, this.onNonLastWaveEnd, this.onGameEnd, this.bags, this.lanes, LEVEL_DIMENSIONS.laneTopMargin);
        this.scoreManager = new ScoreManager();

        //Reproduce la música
        this.music = game.add.audio(GAMEPLAY_MUSIC_KEY);
        this.music.volume = GAMEPLAY_MUSIC_VOLUME;
        this.music.loop = true;
        this.music.play();

        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createBackground: function () {

        let scannerBelt = new Phaser.TileSprite(game, GAME_WIDTH, 0, 512, 256, "img_ScannerBelt");
        scannerBelt.anchor.set(1, 0);
        scannerBelt.x = GAME_WIDTH;
        scannerBelt.y = 0;
        scannerBelt.scale.set(1.2, 1.15);
        scannerBelt.autoScroll(0, BAG_MOVEMENT_SPEED / scannerBelt.scale.y);

        backgroundLayer.add(scannerBelt);

        this.background = backgroundLayer.create(0, 0, GAMEPLAY_BACKGROUND_IMAGE_KEY);
        this.background.anchor.set(0, 0);

        this.foreground = overlayLayer.create(0, 0, GAMEPLAY_FOREGROUND_IMAGE_KEY);
        this.foreground.anchor.set(0, 0);
    },

    createGraph: function (laneInfo) {
        let startX = LEVEL_DIMENSIONS.laneHorizontalMargin;
        let startY = LEVEL_DIMENSIONS.laneTopMargin;

        let distanceFromFirstToLastLane = GAME_WIDTH - (LEVEL_DIMENSIONS.laneHorizontalMargin * 2);
        let laneCount = this.levelData.lanes.count;
        let gapBetweenLanes = distanceFromFirstToLastLane / (laneCount - 1);

        let height = GAME_HEIGHT - startY - LEVEL_DIMENSIONS.laneBottomMargin;

        this.graph = new Graph(laneCount, startX, startY, gapBetweenLanes, height, this.scanners);
    },

    createLaneConveyorBelts: function (columns) {
        let startY = LEVEL_DIMENSIONS.laneTopMargin;
        let endY = GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin;

        for (let i = 0; i < columns.length; i++) {
            new ConveyorBelt(laneLayer, new Vector2D(columns[i], startY), new Vector2D(columns[i], endY), CONVEYOR_LANE_SCALE_FACTOR, null, CONVEYOR_BELT_SHEET_LANE);
        }
    },

    createLaneEnds: function (graph, onBagKilled, bags) {
        this.lanes = [];
        let columns = graph.getColumns();
        let laneTypes = this.levelData.lanes.types;

        for (let i = 0; i < columns.length; i++) {
            let type;
            if (laneTypes[i] == "S") type = LaneEndTypes.Safe;
            else if (laneTypes[i] == "D") type = LaneEndTypes.Dangerous;
            else console.error("Wrong lane type in levelData: " + laneTypes[i]);

            this.lanes.push({
                x: columns[i],
                laneEnd: new LaneEnd(type, onBagKilled, bags, new Vector2D(columns[i], GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin))
            });
        }
    },

    createScanners: function (scannerData, lanes) {
        for (let i = 0; i < scannerData.length; i++) {

            let x = lanes[scannerData[i].lane].x;
            let y = LEVEL_DIMENSIONS.laneTopMargin + scannerData[i].y;
            this.scanners.push(new Scanner(new Vector2D(x, y), scannerData[i].lane));
            this.scanners[i].sprite.inputEnabled = true;
            this.scanners[i].sprite.events.onInputDown.add(this.onScannerSelected, { 'scanner': this.scanners[i], 'scanners': this.scanners }, this);
        }

        //Activa el primer Scanner
        this.scanners[0].SetActive();
    },

    createSpeedUpButton: function () {
        let x = 20;
        let y = 20;

        this.speedUpButton = game.add.button(x, y, SPEED_UP_BUTTON_UP_IMAGE_KEY, this.speedUpButtonCallback);
        this.speedUpButton.anchor.setTo(0, 0);
        this.speedUpButton.scale.setTo(1.5, 1.5);
        this.speedUpButton.down = false;

        overlayLayer.add(this.speedUpButton);
    },

    speedUpButtonCallback: function (button, pointer, isOver) {
        if (isOver) {
            button.down = !button.down;
            let newButtonSprite = (button.down) ? SPEED_UP_BUTTON_DOWN_IMAGE_KEY : SPEED_UP_BUTTON_UP_IMAGE_KEY;
            button.loadTexture(newButtonSprite, 0);

            game.time.slowMotion = (button.down) ? SPED_UP_GAME_SPEED : DEFAULT_GAME_SPEED;
            game.time.desiredFps = 60 * game.time.slowMotion;
        }
    },

    getPathMask: function (graph) {
        let columns = graph.getColumns();
        let bottomY = GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin;

        let mask = new Phaser.Graphics(game);
        mask.beginFill(0xffffff);

        for (let i = 0; i < columns.length - 1; i++) {
            let topLeft = new Vector2D(columns[i], LEVEL_DIMENSIONS.laneTopMargin);
            let topRight = new Vector2D(columns[i + 1], LEVEL_DIMENSIONS.laneTopMargin);

            topLeft.x += CONVEYOR_BELT_WIDTH_LANE / 2;
            topRight.x -= CONVEYOR_BELT_WIDTH_LANE / 2;

            let bottomLeft = new Vector2D(topLeft.x, bottomY);
            let bottomRight = new Vector2D(topRight.x, bottomY);

            mask.drawPolygon(new Phaser.Polygon([topLeft, topRight, bottomRight, bottomLeft]));
        }

        return mask;
    },

    getBagMask: function () {
        let mask = new Phaser.Graphics(game);
        mask.beginFill(0xffffff);

        mask.drawPolygon(new Phaser.Polygon([
            { x: 0, y: LEVEL_DIMENSIONS.laneTopMargin },
            { x: GAME_WIDTH, y: LEVEL_DIMENSIONS.laneTopMargin },
            { x: GAME_WIDTH, y: GAME_HEIGHT },
            { x: 0, y: GAME_HEIGHT }
        ]));

        return mask;
    },

    //GAME LOOP//
    /////////////
    update: function () {

        if (!this.gameHasEnded) {
            this.pathCreator.update();
            this.waveManager.update(game.time.physicsElapsed);
        }

        //Se recorre hacia atrás porque una maleta puede destruirse durante su update. Hacia adelante nos saltaríamos una maleta cuando eso pasa.
        for (let i = this.bags.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.scanners.length; j++) {
                if (this.scanners[j].x == this.bags[i].position.x &&
                    this.scanners[j].start <= (this.bags[i].position.y + this.bags[i].sprite.height / 2) &&
                    this.bags[i].position.y < this.scanners[j].end) {
                    this.scanners[j].EnterBag(this.bags[i]);
                }
            }

            this.bags[i].update();

        }
        for (let j = 0; j < this.scanners.length; j++) {
            this.scanners[j].UpdateScanner();
        }

        //Hace que las maletas se dibujen en orden de su posición y - haciendo que las que estén más arriba se dibujen detrás de las que estén más abajo
        bagLayer.sort('y', Phaser.Group.SORT_ASCENDING);
    },

    //EVENTS//
    //////////
    onNonLastWaveEnd: function () {
        this.graph.resetGraph();

        pathLayer.destroy(true, true);

    },

    onGameEnd: function () {
        let state = game.state.getCurrentState();

        //Stop responding to input. 
        //TODO: Stop responding to fast forwards input as well. Also scanner switching.
        state.pathCreator.unsubscribeFromInputEvents();

        state.gameHasEnded = true;
        console.log("The game has ended!");

        let starRating = state.scoreManager.getStarRating(state.levelData.starThresholds);
        console.log("You got a rating of " + starRating + " stars!");

        if (game.userLevelData[state.levelData.levelIndex] !== null || game.userLevelData[state.levelData.levelIndex] < starRating) {
            game.userLevelData[state.levelData.levelIndex] = starRating;
            localStorage.userLevelData = JSON.stringify(game.userLevelData);

            console.log(localStorage.userLevelData);
        }

        state.showEndScreen(starRating, state.scoreManager.currentCorrectBagCount, state.scoreManager.currentWrongBagCount);
    },

    onBagKilled: function (isCorrect) {
        let state = game.state.getCurrentState();
        state.waveManager.notifyOfBagDone();

        if (isCorrect) state.scoreManager.currentCorrectBagCount++;
        else state.scoreManager.currentWrongBagCount++;
    },

    render: function () {
        if (DEBUG_SHOW_COLLIDERS) {
            for (let i = 0; i < this.bags.length; i++) {
                game.debug.body(this.bags[i].sprite);
            }
        }
    },

    onScannerSelected: function () {
        for (var i = 0; i < this.scanners.length; i++) {
            if (this.scanners[i] != this.scanner) this.scanners[i].SetInactive();
        }
        this.scanner.SetActive();
    },

    //END SCREEN//
    //////////////
    showEndScreen: function (starRating, correctBagCount, wrongBagCount) {
        //Create a new layer for the score screen
        let scoreLayer = game.add.group();

        //Show the main image
        let background = new Phaser.Image(game, 0, 0, SCORE_BACKGROUND_IMAGE_KEY);
        background.anchor.setTo(0, 0);
        scoreLayer.add(background);

        //Make the background block clicks so that the gameplay stage becomes uninteractable
        background.inputEnabled = true;

        //Show stars
        let starY = SCORE_SCREEN_DIMENSIONS.starY;
        let starSpacing = SCORE_SCREEN_DIMENSIONS.starRatingWidth / 2;
        let starX = (GAME_WIDTH / 2) - starSpacing;

        for (let i = 1; i <= 3; i++) {
            let starKey = (i <= starRating) ? OBTAINED_STAR_IMAGE_KEY : UNOBTAINED_STAR_IMAGE_KEY;
            let star = new Phaser.Image(game, starX, starY, starKey);

            star.anchor.setTo(0.5, 0.5);
            star.scale.setTo(SCORE_SCREEN_DIMENSIONS.starScaleFactor, SCORE_SCREEN_DIMENSIONS.starScaleFactor);

            scoreLayer.add(star);


            starX += starSpacing;
        }

        //Show correct and wrong bag counts
        let textStyle = { font: "bold Arial", fontSize: "140px", fill: "#fff", align: "right", boundsAlignH: "right", boundsAlignV: "middle" };

        let wrongText = new Phaser.Text(game, SCORE_SCREEN_DIMENSIONS.numberRightX, SCORE_SCREEN_DIMENSIONS.wrongNumberY, wrongBagCount, textStyle);
        wrongText.anchor.setTo(1, 0.5);
        scoreLayer.add(wrongText);

        let correctText = new Phaser.Text(game, SCORE_SCREEN_DIMENSIONS.numberRightX, SCORE_SCREEN_DIMENSIONS.correctNumberY, correctBagCount, textStyle);
        correctText.anchor.setTo(1, 0.5);
        scoreLayer.add(correctText);

        //Prepare the button callbacks
        let doRematch = function (button, pointer, isOver) {
            if (isOver) game.state.start("gameplayState", true, false, game.state.getCurrentState().originalLevelData);
        }
        //TODO: Go to menu state once it exists.
        let goToMenu = function (button, pointer, isOver) {
            //if (isOver) game.state.start("mainMenuState", true, false);
            if (isOver) console.warn("Go to menu button is not implemented yet.");
        }


        //Show buttons
        let xPos = (GAME_WIDTH / 2) - (SCORE_SCREEN_DIMENSIONS.buttonSpacing / 2);
        let rematchButton = new Phaser.Button(game, xPos, SCORE_SCREEN_DIMENSIONS.buttonY, RETRY_BUTTON_IMAGE_KEY, doRematch);
        rematchButton.scale.setTo(SCORE_SCREEN_DIMENSIONS.buttonScale, SCORE_SCREEN_DIMENSIONS.buttonScale);
        rematchButton.anchor.setTo(1, 0.5);
        scoreLayer.add(rematchButton);

        xPos = (GAME_WIDTH / 2) + (SCORE_SCREEN_DIMENSIONS.buttonSpacing / 2);
        let menuButton = new Phaser.Button(game, xPos, SCORE_SCREEN_DIMENSIONS.buttonY, HOME_BUTTON_IMAGE_KEY, goToMenu);
        menuButton.scale.setTo(SCORE_SCREEN_DIMENSIONS.buttonScale, SCORE_SCREEN_DIMENSIONS.buttonScale);
        menuButton.anchor.setTo(0, 0.5);
        scoreLayer.add(menuButton);
    },

    shutdown: function() {
        this.music.stop();
    }
}