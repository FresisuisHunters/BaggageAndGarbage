"use strict";
var gameplayState = function (game) {

}

// Game speed
const DEFAULT_GAME_SPEED = 1;
const SPED_UP_GAME_SPEED = 1.5;
const SPEED_UP_BUTTON_DOWN_SPRITE = LANE_ICON_SPRITE_KEY_SAFE;
const SPEED_UP_BUTTON_UP_SPRITE = LANE_ICON_SPRITE_KEY_DANGER;

var gameSpeed = DEFAULT_GAME_SPEED;

// Level layout
const LEVEL_DIMENSIONS = {
    laneHorizontalMargin: 135,
    laneTopMargin: 420,
    laneBottomMargin: 250,
}

//Layers
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
        laneLayer = game.add.group();
        pathLayer = game.add.group();
        
        bagLayer = game.add.group();
        overlayLayer = game.add.group();
        
        //Crea todo lo relacionado con los carriles
        this.createGraph(this.levelData.lanes);
        this.createLaneEnds(this.graph, this.onBagKilled, this.levelData.lanes.types, this.bags);
        this.createLaneConveyorBelts(this.graph.getColumns());
        this.createSpeedUpButton();
        
        this.mask = this.getPathMask(this.graph);
        pathLayer.mask = this.mask;

        this.pathCreator = new PathCreator(this.graph, this.graph.getColumns(), 
            LEVEL_DIMENSIONS.laneTopMargin, GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin, this.mask);
        this.waveManager = new WaveManager(this.levelData.waves, this.graph, this.onNonLastWaveEnd, this.onGameEnd, this.bags, this.lanes, LEVEL_DIMENSIONS.laneTopMargin);
        this.scoreManager = new ScoreManager();

        //Empieza la primera oleada
        this.waveManager.startNextWave();
    },

    createGraph: function(laneInfo) {
        let startX = LEVEL_DIMENSIONS.laneHorizontalMargin;
        let startY = LEVEL_DIMENSIONS.laneTopMargin;
        
        let distanceFromFirstToLastLane = GAME_WIDTH - (LEVEL_DIMENSIONS.laneHorizontalMargin * 2);
        let laneCount = laneInfo.count;
        let gapBetweenLanes = distanceFromFirstToLastLane / (laneCount - 1);

        let height = GAME_HEIGHT - startY - LEVEL_DIMENSIONS.laneBottomMargin;

        this.graph = new Graph(laneCount, startX, startY, gapBetweenLanes, height, this.scanners);
    },

    createLaneConveyorBelts: function(columns) {
        let startY = LEVEL_DIMENSIONS.laneTopMargin;
        let endY = GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin;

        for (let i = 0; i < columns.length; i++) {
            new ConveyorBelt(laneLayer, new Vector2D(columns[i], startY), new Vector2D(columns[i], endY), CONVEYOR_LANE_SCALE_FACTOR);
        }
    },

    createLaneEnds: function(graph, onBagKilled, laneTypes, bags) {
        this.lanes = [];
        let columns = graph.getColumns();

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

    createSpeedUpButton : function() {
        let x = 20;
        let y = 20;

        this.speedUpButton = game.add.button(x, y, SPEED_UP_BUTTON_UP_SPRITE, this.speedUpButtonCallback, this);
        this.speedUpButton.anchor.setTo(0, 0);
        this.speedUpButton.down = false;

        overlayLayer.add(this.speedUpButton);
    },

    speedUpButtonCallback : function() {
        this.speedUpButton.down = !this.speedUpButton.down;
        // this.speedUpButton.key = (this.speedUpButton.down) ? SPEED_UP_BUTTON_DOWN_SPRITE : SPEED_UP_BUTTON_UP_SPRITE;
        // TODO: Cambiar sprite del boton cuando esta pulsado
        gameSpeed = (this.speedUpButton.down) ? SPED_UP_GAME_SPEED : DEFAULT_GAME_SPEED;
    },

    getPathMask: function(graph) {
        let columns = graph.getColumns();
        let bottomY = GAME_HEIGHT - LEVEL_DIMENSIONS.laneBottomMargin;

        let mask = new Phaser.Graphics(game);
        mask.beginFill(0xffffff);

        for (let i = 0; i < columns.length - 1; i++) {
            let topLeft = new Vector2D(columns[i], LEVEL_DIMENSIONS.laneTopMargin);
            let topRight = new Vector2D(columns[i + 1], LEVEL_DIMENSIONS.laneTopMargin);

            topLeft.x += CONVEYOR_BELT_WIDTH / 2;
            topRight.x -= CONVEYOR_BELT_WIDTH / 2;

            let bottomLeft = new Vector2D(topLeft.x, bottomY);
            let bottomRight = new Vector2D(topRight.x, bottomY);

            mask.drawPolygon(new Phaser.Polygon([topLeft, topRight, bottomRight, bottomLeft]));
        }
        
        return mask;
    },

    //GAME LOOP//
    /////////////
    update: function() {
        
        if (!this.gameHasEnded) {
            //Updatea todo lo que tenga que ser updateado
            this.pathCreator.update();
            this.waveManager.update(game.time.physicsElapsed);

            //Se recorre hacia atrás porque una maleta puede destruirse durante su update. Hacia adelante nos saltaríamos una maleta cuando eso pasa.
            for (let i = this.bags.length - 1; i >= 0; i--) {
                this.bags[i].update();
                for (let j = 0; j < this.scanners.lenth; j++) {
                    if (scanners[j].belt == bag.position.x && scanners[j].start <= (bag.position.y+BAG_MOVEMENT_SPEED))
                    {
                        scanners[j].EnterBag(bags[i]);
                        bags.splice(i,1);
                        timer = game.time.create(true)
                        timer.add(SCAN_TIME,this.onBagScanned,this,scanners[j]);
                    }
                }
            }

            //Hace que las maletas se dibujen en orden de su posición y - haciendo que las que estén más arriba se dibujen detrás de las que estén más abajo
            bagLayer.sort('y', Phaser.Group.SORT_ASCENDING);
        }
    },

    //EVENTS//
    //////////
    onNonLastWaveEnd: function() {
        this.graph.resetGraph();

        for (let i = pathLayer.length - 1; i >= 0; i--) {
            if (pathLayer[i] != null) pathLayer[i].destroy();
        }
    },

    onGameEnd: function() {
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

    onBagScanned: function (scanner) {
        bags.push(scanner.ExitBag());
    },

    render: function() {
        if (DEBUG_SHOW_COLLIDERS) {
            for (let i = 0; i < this.bags.length; i++) {
                game.debug.body(this.bags[i].sprite);
            }
        }
    }
}