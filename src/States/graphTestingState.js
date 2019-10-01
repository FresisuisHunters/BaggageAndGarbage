"use strict";
var graphTestingState = function (game) {

}

graphTestingState.prototype = {

    init : function() {

    },

    create : function() {
        console.log("Entered grapthTestingState")
        
        //tolerancia en torno al punto donde se hace click
        this.clickTolerance = 20;

        game.input.onDown.add(this.startNewPath, this);

        this.graph = new Graph();
        console.log("Original state of the graph");
        this.graph.printGraph();

        let pathsToCreate = 3;
        for (let i = 0; i < pathsToCreate; ++i) {
            this.createRandomPath();
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

        console.log("Creating a path between points " + origin + " and " + destiny);
        this.graph.addPath(origin, destiny);
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

    createRandomBag : function() {
        let conveyorBeltOriginId = Math.floor(Math.random() * CONVEYOR_BELT_NUMBER);
        let x = CONVEYOR_BELT_SPAWN_X + conveyorBeltOriginId * CONVEYOR_BELT_HORIZONTAL_OFFSET;
        let y = CONVEYOR_BELT_SPAWN_Y;
        let position = new Vector2D(x, y);
        this.bag = new Bag(0, 0, position);
        this.graph.getMovementParameters(this.bag);

        console.log("Creating a bag in node " + position);
    },

    //función que se llama cuando se hace click para ver si el punto es válido para iniciar un camino
    //y guardarlo en caso afirmativo
    startNewPath(pointer)
    {
        let columns = this.graph.getColumns();
        let closestX=null;
        for(var i = 0; i ++; i<columns.length)
        {
            if(Math.abs(columns[i]-pointer.x)<=clickTolerance)
            {
                closestX=columns[i];
            }
        }
        if(closestX==null)
        {
            console.log("Selected point too far from any conveyor belt")
        }
        else
        {
            this.newBeltStartPoint=new Vector2D(closestX,pointer.y);
        }
    }

}