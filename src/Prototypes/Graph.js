const EPSILON = 0.1;
const BAG_SPEED = 2;

function Graph(visible) {
    this.graph = new Map();
    this.initializeGraph();
    this.visible = visible;
}

Graph.prototype = {

    initializeGraph : function() {
        for (let i = 0; i < CONVEYOR_BELT_NUMBER; ++i) {
            let x = CONVEYOR_BELT_SPAWN_X + i * CONVEYOR_BELT_HORIZONTAL_OFFSET;
            let originNodePosition = new Vector2D(x, CONVEYOR_BELT_SPAWN_Y);
            let destinyNodePosition = new Vector2D(x, CONVEYOR_BELT_SPAWN_X + CONVEYOR_BELT_VERTICAL_DISTANCE);

            let destinyNode = new GraphNode(destinyNodePosition, undefined);
            let originNode = new GraphNode(originNodePosition, destinyNode);

            this.graph.set(originNodePosition.toString(), originNode);
            this.graph.set(destinyNodePosition.toString(), destinyNode);
        }
    },

    getMovementParameters : function(bag) {
        let origin = bag.position;
        let destiny = this.graph.get(origin.toString()).nextNode.position;
        bag.movementParameters = new MovementParameters(origin, destiny);
    },

    addPath : function(origin, destiny) {
        if (origin.y >= destiny.y) {
            console.log("Error adding a path to the graph. Origin's Y must be higher than destiny's");
            return;
        }

        if (origin.y <= CONVEYOR_BELT_SPAWN_Y || origin.y > (CONVEYOR_BELT_SPAWN_Y + CONVEYOR_BELT_VERTICAL_DISTANCE)
            || destiny.y <= CONVEYOR_BELT_SPAWN_Y || destiny.y > (CONVEYOR_BELT_SPAWN_Y + CONVEYOR_BELT_VERTICAL_DISTANCE)) {
            console.log("Error adding a path to the graph. Origin or destiny Y are not in range (SPAWN_Y, SPAWN_Y + VERTICAL_DISTANCE)");
            return;
        }

        let distance = Math.abs(origin.x - destiny.x);
        if (distance != CONVEYOR_BELT_HORIZONTAL_OFFSET) {
            console.log("Error adding a path to the graph. A path must connect two adjacent conveyor belts");
            return;
        }

        if (this.graph.has(origin) || this.graph.has(destiny)) {
            console.log("Error adding a path to the graph. Either origin or destiny already exists in the graph");
            return;
        }

        let destinyNode = new GraphNode(destiny, undefined);
        let originNode = new GraphNode(origin, destinyNode);

        this.updateOriginColumn(originNode);
        this.updateDestinyColumn(destinyNode);
        this.graph.set(origin.toString(), originNode);
        this.graph.set(destiny.toString(), destinyNode);
    },

    updateOriginColumn : function(originNode) {
        let previousNode = this.getPreviousNode(originNode.position);
        previousNode.nextNode = originNode;
    },

    updateDestinyColumn : function(destinyNode) {
        let previousNode  = this.getPreviousNode(destinyNode.position);
        let nextNode = this.getNextNode(destinyNode.position);

        previousNode.nextNode = destinyNode;
        destinyNode.nextNode = nextNode;
    },

    getPreviousNode : function(position) {
        let nodeList = this.getNodesInSameColumn(position);

        let i = nodeList.length;
        while (i--) {
            let node = nodeList[i];
            let distance = node.position.y - position.y;
            if (distance >= 0) {
                nodeList.splice(i, 1);
            }
        }

        nodeList.sort(function(n1, n2) {
            if (n1.position.y > n2.position.y) {
                return -1;
            } else if (n1.position.y < n2.position.y) {
                return 1;
            } else {
                return 0;
            }
        });

        return nodeList[0];
    },

    getNextNode : function(position) {
        let nodeList = this.getNodesInSameColumn(position);
        
        let i = nodeList.length;
        while (i--) {
            let node = nodeList[i];
            let distance = node.position.y - position.y;
            if (distance <= 0) {
                nodeList.splice(i, 1);
            }
        }

        nodeList.sort(function(n1, n2) {
            if (n1.position.y < n2.position.y) {
                return -1;
            } else if (n1.position.y > n2.position.y) {
                return 1;
            } else {
                return 0;
            }
        });

        return nodeList[0];
    },

    getNodesInSameColumn(position) {
        let nodes = Array.from(this.graph.values());
        let i = nodes.length;

        while (i--) {
            let node = nodes[i];
            if (node.position.x != position.x) {
                nodes.splice(i, 1);
            }
        }
        
        return nodes;
    },

    resetGraph : function() {
        this.graph.clear();
        this.initializeGraph();
    },

    moveBag : function(bag) {
        let reachedANewNode = false;

        let movementParameters = bag.movementParameters;
        let s0 = movementParameters.startingNodePosition;
        let dir = movementParameters.direction;
        let t = movementParameters.t;

        let v = dir.multiply(t * BAG_SPEED);
        let s = addVectors(s0, v);

        bag.position = s;
        bag.movementParameters.t += 0.5;   // TODO: Obtener de Phaser el tiempo ocurrido entre entre frames

        if (this.bagHasReachedItsDestiny(bag)) {
            console.log(bag);

            reachedANewNode = true;
            bag.position = movementParameters.endingNodePosition;

            let currentNode = this.graph.get(bag.position.toString());
            if (currentNode.hasOutput()) {
                this.getMovementParameters(bag);
            } else {
                bag.onDestinyMet();
            }
        }

        return reachedANewNode;
    },

    bagHasReachedItsDestiny(bag) {
        let bagPosition = bag.position;
        let bagDestiny = bag.movementParameters.endingNodePosition;

        let nearX = Math.abs(bagDestiny.x - bagPosition.x) < EPSILON;
        let nearY = Math.abs(bagDestiny.y - bagPosition.y) < EPSILON;
        return nearX && nearY;
    },

    displayGraph : function() {
        // TODO: Tal cual y como esta ahora, si se llama muchas veces se dibuja un grafo sobre otro
        this.graph.forEach(function(value, key) {
            let nodePosition = value.position;
            let circle = new Phaser.Circle(nodePosition.x, nodePosition.y, 10);
            game.debug.geom(circle);

            let node = value;
            if (node.hasOutput()) {
                let outputNode = node.nextNode;

                let nodePosition = node.position;
                let outputNodePosition = outputNode.position;
                let line = new Phaser.Line(nodePosition.x, nodePosition.y, outputNodePosition.x, outputNodePosition.y);
                game.debug.geom(line);
            }
        })
    },

    getNodes : function() {
        return this.graph.values();
    },

    printGraph : function() {
        this.graph.forEach(function(value, key) {
            console.log(value.toString());
        })
    }

}