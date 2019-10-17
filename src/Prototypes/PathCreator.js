const PATH_DRAW_TOLERANCE = 100;

const CORRECT_PATH_COLOR = 0x00aa00;
const WRONG_PATH_COLOR = 0xAA0000;
const PREVIEW_ALPHA = 0.75;

const SFX_BUILT_PATH_KEY = "sfx_BuiltPath";
const SFX_BUILT_PATH_VOLUME = 0.75;

function PathCreator(graph, columns, minAllowedY, maxAllowedY, mask) {
    this.graph = graph;
    this.columns = columns;
    this.minAllowedY = minAllowedY;
    this.maxAllowedY = maxAllowedY;
    this.mask = mask;

    this.previewConveyorBelt = new ConveyorBelt(overlayLayer, new Vector2D(0, 0), new Vector2D(0, 0), CONVEYOR_PATH_SCALE_FACTOR, null, CONVEYOR_BELT_SHEET_LANE);
    this.previewConveyorBelt.setVisible(false);
    this.previewConveyorBelt.setAlpha(PREVIEW_ALPHA);

    this.subscribeToInputEvents();

    this.builtPathSFX = game.add.audio(SFX_BUILT_PATH_KEY);
    this.builtPathSFX.volume = SFX_BUILT_PATH_VOLUME;
}

PathCreator.prototype = {

    subscribeToInputEvents: function () {
        game.input.onDown.add(this.onTouchStart, this);
        game.input.onUp.add(this.onTouchEnd, this);
    },

    unsubscribeFromInputEvents: function () {
        game.input.onDown.remove(this.onTouchStart, this);
        game.input.onUp.remove(this.onTouchEnd, this);

        this.pathDrawProcess = null;
        this.update();
    },

    onTouchStart: function (pointer) {
        let point = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));

        if (point != null) {
            this.pathDrawProcess = {
                startPoint: point
            };

            this.previewConveyorBelt.start = point;
        }
    },

    onTouchEnd: function (pointer) {
        if (this.pathDrawProcess != null) {
            let endPoint = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));
            if (endPoint != null) {
                if (this.graph.tryAddPath(this.pathDrawProcess.startPoint, endPoint)) {
                    let conveyorBelt = new ConveyorBelt(pathLayer, this.pathDrawProcess.startPoint, endPoint, CONVEYOR_PATH_SCALE_FACTOR, null, CONVEYOR_BELT_SHEET_LANE);
                    this.graph.addConveyorBelt(conveyorBelt);
                    this.builtPathSFX.play();
                }
            }

            this.graph.returnBeltsAndScannersToOriginalColors();
            this.pathDrawProcess = null;
        }
    },

    update: function () {
        if (this.pathDrawProcess != null) {
            this.displayCurrentDrawnPath(this.pathDrawProcess);
            this.previewConveyorBelt.setVisible(true);
        } else {
            this.previewConveyorBelt.setVisible(false);
        }
    },

    displayCurrentDrawnPath: function (pathDrawProcess) {
        let currentTouchedPoint = new Vector2D(game.input.x, game.input.y);
        let graphPoint = this.getGraphPointFromTouch(currentTouchedPoint);

        let isValidPath = graphPoint != null && this.graph.pathIsValid(pathDrawProcess.startPoint, graphPoint);

        if (isValidPath) {
            this.previewConveyorBelt.setEnd(graphPoint);
            this.previewConveyorBelt.setColor(CORRECT_PATH_COLOR);
            this.previewConveyorBelt.setMask(this.mask);
        } else {
            this.previewConveyorBelt.setEnd(currentTouchedPoint);
            this.previewConveyorBelt.setColor(WRONG_PATH_COLOR);
            this.previewConveyorBelt.setMask(null);
        }
    },

    //Devuelve null si el punto no es válido para dibujar un camino, el punto tocado si no
    getGraphPointFromTouch: function (touchPoint) {
        //See if the height is fine
        if (touchPoint.y < this.minAllowedY || touchPoint.y > this.maxAllowedY) return null;

        //See which, if any, lane this is.
        let laneIndex = -1;
        let smallestDistance = 100000;
        for (let i = 0; i < this.columns.length; i++) {
            let distance = Math.abs(this.columns[i] - touchPoint.x);
            if (distance <= PATH_DRAW_TOLERANCE && distance < smallestDistance) {
                smallestDistance = distance;
                laneIndex = i;
            }
        }

        if (laneIndex != -1) {
            return new Vector2D(this.columns[laneIndex], touchPoint.y);
        }
        else return null;
    },
}