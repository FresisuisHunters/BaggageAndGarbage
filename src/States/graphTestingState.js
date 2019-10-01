const DEBUG_GRAPH = false;

"use strict";
var graphTestingState = function (game) {

}

graphTestingState.prototype = {

    init : function() {

    },

    create : function() {
        console.log("Entered grapthTestingState")
        
        this.graph = new Graph(CONVEYOR_BELT_NUMBER, CONVEYOR_BELT_SPAWN_X, CONVEYOR_BELT_SPAWN_Y, CONVEYOR_BELT_HORIZONTAL_OFFSET, CONVEYOR_BELT_VERTICAL_DISTANCE);
        if (DEBUG_GRAPH) {
            console.log("Original state of the graph");
            this.graph.printGraph();
        }
        
        let pathsToCreate = 20;
        for (let i = 0; i < pathsToCreate; ++i) {
            this.createRandomPath();
        }

        if (DEBUG_GRAPH) {
            console.log("State of the graph after creating the new paths");
            this.graph.printGraph();
        }

        this.createRandomBag();
    },

    createRandomPath : function() {
        let conveyorBeltOriginId = Math.floor(Math.random() * CONVEYOR_BELT_NUMBER);
        let x0 = CONVEYOR_BELT_SPAWN_X + conveyorBeltOriginId * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y0 = Math.floor(Math.random() * (CONVEYOR_BELT_VERTICAL_DISTANCE - CONVEYOR_BELT_SPAWN_Y) + CONVEYOR_BELT_SPAWN_Y);
        let origin = new Vector2D(x0, y0);

        let conveyorBeltDestinyIdId = (conveyorBeltOriginId == 1) ? 0 : 1;
        let xF = CONVEYOR_BELT_SPAWN_X + conveyorBeltDestinyIdId * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let yF = Math.floor(Math.random() * (CONVEYOR_BELT_VERTICAL_DISTANCE - y0) + y0);
        let destiny = new Vector2D(xF, yF);

        if (DEBUG_GRAPH) {
            console.log("Creating a path between points " + origin + " and " + destiny);
        }
        this.graph.addPath(origin, destiny);
    },

    update : function() {
        this.graph.displayGraph();
        if (!this.bag.reachedTheEnd) {
            this.bag.moveBag();
        }
    },

    createRandomBag : function() {
        let conveyorBeltOriginId = Math.floor(Math.random() * CONVEYOR_BELT_NUMBER);
        let x = CONVEYOR_BELT_SPAWN_X + conveyorBeltOriginId * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y = CONVEYOR_BELT_SPAWN_Y;
        let position = new Vector2D(x, y);
        this.bag = new Bag(0, 0, position, this.graph);

        if (DEBUG_GRAPH) {
            console.log("Creating a bag in node " + position);
        }
    }

}