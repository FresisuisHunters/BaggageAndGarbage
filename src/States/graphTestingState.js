const DEBUG_GRAPH = false;

"use strict";
var graphTestingState = function (game) {
    this.CONVEYOR_BELT_NUMBER = 2;
    this.CONVEYOR_BELT_SPAWN_X = 100;
    this.CONVEYOR_BELT_SPAWN_Y = 100;
    this.CONVEYOR_BELT_HORIZONTAL_OFFSET = 200;
    this.CONVEYOR_BELT_VERTICAL_DISTANCE = 100;
}

graphTestingState.prototype = {

    init : function() {

    },

    create : function() {
        console.log("Entered grapthTestingState")
        
        this.graph = new Graph(this.CONVEYOR_BELT_NUMBER, this.CONVEYOR_BELT_SPAWN_X, this.CONVEYOR_BELT_SPAWN_Y, 
            this.CONVEYOR_BELT_HORIZONTAL_OFFSET, this.CONVEYOR_BELT_VERTICAL_DISTANCE);
        if (DEBUG_GRAPH) {
            console.log("Original state of the graph");
            this.graph.printGraph();
        }

        this.pathCreator = new PathCreator(this.graph, this.graph.getColumns(), this.CONVEYOR_BELT_SPAWN_Y, this.CONVEYOR_BELT_SPAWN_Y + this.CONVEYOR_BELT_VERTICAL_DISTANCE);

        let pathsToCreate = 20;
        for (let i = 0; i < pathsToCreate; ++i) {
            this.createRandomPath();
        }

        if (DEBUG_GRAPH) {
            console.log("State of the graph after creating the new paths");
            this.graph.printGraph();
        }

        //this.createRandomBag();
    },

    createRandomPath : function() {
        let conveyorBeltOriginId = Math.floor(Math.random() * this.CONVEYOR_BELT_NUMBER);
        let x0 = this.CONVEYOR_BELT_SPAWN_X + conveyorBeltOriginId * this.CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y0 = Math.floor(Math.random() * (this.CONVEYOR_BELT_VERTICAL_DISTANCE - this.CONVEYOR_BELT_SPAWN_Y) + this.CONVEYOR_BELT_SPAWN_Y);
        let origin = new Vector2D(x0, y0);

        let conveyorBeltDestinyIdId = (conveyorBeltOriginId == 1) ? 0 : 1;
        let xF = this.CONVEYOR_BELT_SPAWN_X + conveyorBeltDestinyIdId * this.CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let yF = Math.floor(Math.random() * (this.CONVEYOR_BELT_VERTICAL_DISTANCE - y0) + y0);
        let destiny = new Vector2D(xF, yF);

        if (DEBUG_GRAPH) {
            console.log("Creating a path between points " + origin + " and " + destiny);
        }
        this.graph.addPath(origin, destiny);
    },

    update : function() {
        this.graph.displayGraph();
        if (this.bag && !this.bag.reachedTheEnd) {
            this.bag.moveBag();
        }

        this.pathCreator.update();
    },

    createRandomBag : function() {
        //Obsoleto, el constructor de maletas es muy diferente ahora. Mirar WaveManager para ver ejemplo de uso.
        let conveyorBeltOriginId = Math.floor(Math.random() * this.CONVEYOR_BELT_NUMBER);
        let x = this.CONVEYOR_BELT_SPAWN_X + conveyorBeltOriginId * this.CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y = this.CONVEYOR_BELT_SPAWN_Y;
        let position = new Vector2D(x, y);
        this.bag = new Bag(0, 0, position, this.graph);

        if (DEBUG_GRAPH) {
            console.log("Creating a bag in node " + position);
        }
    }

}