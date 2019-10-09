"use strict";
var gameplayState = function (game) {

}

const GAMEPLAY_BACKGROUND_IMAGE_KEY = "img_GameplayBackground";

const LEVEL_DIMENSIONS = {
    laneHorizontalMargin: 135,
    laneTopMargin: 313,
    laneBottomMargin: 259
}

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
        this.levelData = levelData;
        this.bags = [];
        this.scanners = [];
        this.gameHasEnded = false;
    },

    create: function () {
        console.log("Entered gameplayState")

        //El orden en el que se crean es el orden en el que dibujan. Es decir, el último se dibuja por encima del resto.
        backgroundLayer = game.add.group();
        laneLayer = game.add.group();
        pathLayer = game.add.group();
        bagLayer = game.add.group();
        overlayLayer = game.add.group();
        this.createBackground();

        //Crea managers y tal
        this.createGraph();
        this.createLaneEnds(this.graph, this.onBagKilled, this.bags);
        this.createLaneConveyorBelts(this.graph.getColumns());

        //Crea las máscaras
        this.pathMask = this.getPathMask(this.graph);
        pathLayer.mask = this.pathMask;

        let bagMask = this.getBagMask();
        bagLayer.mask = bagMask;

        this.pathCreator = new PathCreator(this.graph, this.graph.getColumns(),
            LEVEL_DIMENSIONS.laneTopMargin, GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin);
        this.waveManager = new WaveManager(this.levelData.waves, this.graph, this.onNonLastWaveEnd, this.onGameEnd, this.bags, this.lanes, LEVEL_DIMENSIONS.laneTopMargin);
        this.scoreManager = new ScoreManager();

        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createBackground: function () {
        this.background = backgroundLayer.create(0, 0, GAMEPLAY_BACKGROUND_IMAGE_KEY);
        this.background.anchor.set(0, 0);
    },

    createGraph: function (laneInfo) {
        let startX = LEVEL_DIMENSIONS.laneHorizontalMargin;
        let startY = LEVEL_DIMENSIONS.laneTopMargin;

        let distanceFromFirstToLastLane = GAME_WIDTH - (LEVEL_DIMENSIONS.laneHorizontalMargin * 2);
        let laneCount = this.levelData.lanes.count;
        let gapBetweenLanes = distanceFromFirstToLastLane / (laneCount - 1);

        let height = GAME_HEIGHT - startY - LEVEL_DIMENSIONS.laneBottomMargin;

        this.graph = new Graph(laneCount, startX, startY, gapBetweenLanes, height, this.scanners);

        this.createScanners(startX, gapBetweenLanes);
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

    createScanners: function (startx, gapBetweenLanes) {

        let scannersData = this.levelData.scannerPositions;
        for (let i = 0; i < scannersData.length; i++) {
            this.scanners.push(new Scanner(new Vector2D(scannersData[i].belt * gapBetweenLanes + startx, scannersData[i].y), scannersData[i].belt));
            this.scanners[i].sprite.inputEnabled = true;
            this.scanners[i].sprite.events.onInputDown.add(this.onScannerSelected, { 'scanner': this.scanners[i], 'scanners': this.scanners }, this);
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
            this.bags[i].update();
            for (let j = 0; j < this.scanners.length; j++) {
                if (this.scanners[j].x == this.bags[i].position.x &&
                    this.scanners[j].start <= (this.bags[i].position.y + this.bags[i].sprite.height / 2) &&
                    this.bags[i].position.y < this.scanners[j].end) {
                    this.scanners[j].EnterBag(this.bags[i]);
                }
            }
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

        state.pathCreator.unsubscribeFromInputEvents();

        state.gameHasEnded = true;
        console.log("The game has ended!");

        let starRating = state.scoreManager.getStarRating(state.levelData.starThresholds);
        console.log("You got a rating of " + starRating + " stars!");
    },

    onBagKilled: function (isCorrect) {
        let state = game.state.getCurrentState();
        state.waveManager.notifyOfBagDone();

        if (!isCorrect) state.scoreManager.currentMistakeCount++;
    },

    onScannerSelected: function () {
        for (var i = 0; i < this.scanners.length; i++) {
            this.scanners[i].SetInactive();
        }
        this.scanner.SetActive();
    }
}