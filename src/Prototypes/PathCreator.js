const PATH_DRAW_TOLERANCE = 60;

function PathCreator(graph, columns, minAllowedY, maxAllowedY) {
    this.graph = graph;
    this.columns = columns;
    this.minAllowedY = minAllowedY;
    this.maxAllowedY = maxAllowedY;

    this.subscribeToInputEvents();
}

PathCreator.prototype = {

    subscribeToInputEvents: function() {
        game.input.onDown.add(this.onTouchStart, this);
        game.input.onUp.add(this.onTouchEnd, this);
    },

    unsubscribeFromInputEvents: function() {
        game.input.onDown.remove(this.onTouchStart, this);
        game.input.onUp.remove(this.onTouchEnd, this);
    },

    onTouchStart: function(pointer) {
        let point = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));
    
        if (point != null)
        {
            this.pathDrawProcess = {
                startPoint: point
            };
        }
    },

    onTouchEnd: function(pointer) {
        if (this.pathDrawProcess != null) {
            let endPoint = this.getGraphPointFromTouch(new Vector2D(pointer.x, pointer.y));
            if (endPoint != null) {
                this.graph.addPath(this.pathDrawProcess.startPoint, endPoint);
                new ConveyorBelt(pathLayer, this.pathDrawProcess.startPoint, endPoint);
            }

            this.pathDrawProcess = null;
        }
    },

    
    update: function() {
        if (this.pathDrawProcess != null) this.displayCurrentDrawnPath(this.pathDrawProcess);
    },

    displayCurrentDrawnPath: function(pathDrawProcess) {
        let currentTouchedPoint = new Vector2D(game.input.x, game.input.y);
        let graphPoint = this.getGraphPointFromTouch(currentTouchedPoint);

        let wrongPathColor = "rgb(128, 0, 0)";
        let correctPathColor = "rgb(0, 128, 0)";
        let isValidPath = graphPoint != null && this.graph.pathIsValid(pathDrawProcess.startPoint, graphPoint);


        if (isValidPath) {
            this.graph.displaySection(pathDrawProcess.startPoint, graphPoint, correctPathColor);
        } else {    
            this.graph.displaySection(pathDrawProcess.startPoint, currentTouchedPoint, wrongPathColor);
        }
    },

    //Devuelve null si el punto no es válido para dibujar un camino, el punto tocado si no
    getGraphPointFromTouch: function(touchPoint) {
        //See if the height is fine
        if (touchPoint.y < this.minAllowedY || touchPoint.y > this.maxAllowedY) return null;
        
        //See which, if any, lane this is.
        let laneIndex = -1;
        let smallestDistance = 100000;
        for(let i = 0; i < this.columns.length; i++)
        {
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