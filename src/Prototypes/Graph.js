const EPSILON = 0.1;

function Graph() {
    this.graph = new Map();
    this.initializeGraph();
}

Graph.prototype = {

    initializeGraph : function() {
        for (let i = 0; i < CONVEYOR_BELT_NUMBER; ++i) {
            let x = CONVEYOR_BELT_SPAWN_X + i * CONVEYOR_BELT_DISTANCE_OFFSET;
            let originNodePosition = new Vector2D(x, CONVEYOR_BELT_SPAWN_Y);
            let destinyNodePosition = new Vector2D(x, CONVEYOR_BELT_VERTICAL_DISTANCE);

            let destinyNode = new GraphNode(destinyNodePosition, undefined);
            let originNode = new GraphNode(originNodePosition, destinyNode);

            this.graph.set(originNodePosition, originNode);
            this.graph.set(destinyNodePosition, destinyNode);
        }
    },

    getMovementParams : function(bag) {
        let origin = bag.position;
        let destiny = this.graph.get(origin).destiny.position;
        return new MovementParams(origin, destiny);
    },

    addPath : function(origin, destiny) {
        if (origin.x >= destiny.y) {
            return;
        }

        let distance = Math.abs(origin.x - destiny.x);
        if (distance != CONVEYOR_BELT_DISTANCE_OFFSET) {
            return;
        }

        if (this.graph.has(origin) || this.graph.has(destiny)) {
            return;
        }

        let destinyNode = new GraphNode(destiny, undefined);
        let originNode = new GraphNode(origin, destinyNode);

        this.updateOriginColumn(originNode);
        this.updateDestinyColumn(destinyNode);
        this.graph.set(origin, originNode);
        this.graph.set(destiny, destinyNode);
    },

    updateOriginColumn : function(originNode) {
        let previousNode = this.getPreviousNode(originNode.position);
        previousNode.destiny = originNode;
    },

    updateDestinyColumn : function(destinyNode) {
        let previousNode  = this.getPreviousNode(destinyNode.position);
        let nextNode = this.getNextNode(destinyNode.position);

        previousNode.destiny = destinyNode;
        destinyNode.destiny = nextNode;
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
        let nodes = new Array(this.graph.values());
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

        let movementParams = bag.movementParams;
        let s0 = movementParams.startingNodePosition;
        let dir = movementParams.direction;
        let t = movementParams.t;

        let v = dir.multiply(t * BAG_SPEED);
        let s = addVectors(s0, v);

        bag.position = s;
        bag.movementParams.t = t;   // TODO: Obtener de Phaser el tiempo ocurrido entre entre frames

        if (this.bagHasReachedItsDestiny(bag)) {
            reachedANewNode = true;
            bag.position = movementParams.destiny;

            let currentNode = this.graph.get(bag.position);
            if (currentNode.hasOutput()) {
                bag.movementParams = this.getMovementParams(bag);
            } else {
                bag.onDestinyMet();
            }
        }

        return reachedANewNode;
    },

    bagHasReachedItsDestiny(bag) {
        let bagPosition = bag.position;
        let bagDestiny = bag.movementParams.destiny;

        let nearX = Math.abs(bagDestiny.x - bagPosition.x) < EPSILON;
        let nearY = Math.abs(bagDestiny.y - bagPosition.y) < EPSILON;
        return nearX && nearY;
    },

    getNodes : function() {
        return this.graph.values();
    },

    printGraph : function() {
        this.graph.forEach(function(value, key) {
            console.dir(value);
        })
    }

}