"use strict";
var graphTestingState = function (game) {

}

graphTestingState.prototype = {

    init : function() {

    },

    create : function() {
        console.log("Entered grapthTestingState")
        
        this.graph = new Graph(true);
        console.log("Original state of the graph");
        this.graph.printGraph();

        this.createFirstPath();
        this.createSecondPath();
        this.createThirdPath();
        this.createBag();

        if (this.graph.visible) {
            this.graph.displayGraph();
        }
    },

    update : function() {
        this.graph.displayGraph();
        if (!this.bag.reachedTheEnd) {
            let reachedANode = this.graph.moveBag(this.bag);
            if (reachedANode) {
                console.log("The bag reached a node");
                console.dir(this.bag);
            }
        }
    },

    createFirstPath : function() {
        let x0 = CONVEYOR_BELT_SPAWN_X;
        let y0 = 150;
        let origin = new Vector2D(x0, y0);

        let xF = CONVEYOR_BELT_SPAWN_X + CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let yF = 170;
        let destiny = new Vector2D(xF, yF);

        console.log("Creating a path between points " + origin + " and " + destiny);

        this.graph.addPath(origin, destiny);

        console.log("Graph after adding this path");
        this.graph.printGraph();
    },

    createSecondPath : function() {
        let x0 = CONVEYOR_BELT_SPAWN_X + CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y0 = 110;
        let origin = new Vector2D(x0, y0);

        let xF = CONVEYOR_BELT_SPAWN_X;
        let yF = 125;
        let destiny = new Vector2D(xF, yF);

        console.log("Creating a path between points " + origin + " and " + destiny);

        this.graph.addPath(origin, destiny);

        console.log("Graph after adding this path");
        this.graph.printGraph();
    },

    createThirdPath : function() {
        let x0 = CONVEYOR_BELT_SPAWN_X + 3 * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y0 = 175;
        let origin = new Vector2D(x0, y0);

        let xF = CONVEYOR_BELT_SPAWN_X + 2 * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let yF = 190;
        let destiny = new Vector2D(xF, yF);

        console.log("Creating a path between points " + origin + " and " + destiny);

        this.graph.addPath(origin, destiny);

        console.log("Graph after adding this path");
        this.graph.printGraph();
    },

    createBag : function() {
        let x = CONVEYOR_BELT_SPAWN_X + 1 * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y = CONVEYOR_BELT_SPAWN_Y;
        let position = new Vector2D(x, y);
        this.bag = new Bag(0, 0, position);
        this.graph.getMovementParameters(this.bag);

        console.log("Creating a bag in node " + position);
    }

}