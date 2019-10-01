const BAG_SPEED = 50;

function Graph(laneCount, spawnX, spawnY, horizontalOffset, laneHeight) {
    this.graph = new Map();
    this.initializeGraph(laneCount, spawnX, spawnY, horizontalOffset, laneHeight);
}

Graph.prototype = {

    // Inicializa usando las constantes definidas en ConveyorBelt.cs
    initializeGraph : function(laneCount, spawnX, spawnY, horizontalOffset, laneHeight) {

        this.laneCount = laneCount;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.horizontalOffset = horizontalOffset;
        this.laneHeight = laneHeight;

        for (let i = 0; i < laneCount; ++i) {
            let x = spawnX + i * horizontalOffset;
            let originNodePosition = new Vector2D(x, spawnY);
            let destinyNodePosition = new Vector2D(x, spawnY + laneHeight);

            let destinyNode = new GraphNode(destinyNodePosition, undefined);
            let originNode = new GraphNode(originNodePosition, destinyNode);

            this.graph.set(originNodePosition.toString(), originNode);
            this.graph.set(destinyNodePosition.toString(), destinyNode);
        }
    },

    // Esta funcion se debe llamar cuando se cree una maleta. El grafo la llama cada vez que una maleta alcanza un nodo no final
    getMovementParameters : function(position) {
        let origin = position;
        let destiny = this.graph.get(origin.toString()).nextNode.position;  // Obtiene la posicion del nodo destino
        return new MovementParameters(origin, destiny);
    },

    // Origin y destiny son Vector2D
    addPath : function(origin, destiny) {
        if (!this.pointsBelongToAdjacentConveyors(origin, destiny)) {
            console.error("Error adding a path to the graph. A path must connect two adjacent conveyor belts");
            return;
        }
        
        if (this.pointIsOnScanner(origin) || this.pointIsOnScanner(destiny)) {
            console.error("Error adding a path to the graph. Either origin or destiny are placed on top of a scanner");
            return;
        }

        if (this.pathIntersectsAnyOfTheExistent(origin, destiny)) {
            console.error("Error adding a path to the graph. Paths can't intersect");
            return;
        }

        if (this.graph.has(origin) || this.graph.has(destiny)) {
            console.error("Error adding a path to the graph. Either origin or destiny already exist in the graph");
            return;
        }

        let destinyNode = new GraphNode(destiny, undefined);
        let originNode = new GraphNode(origin, destinyNode);

        this.updateOriginColumn(originNode);
        this.updateDestinyColumn(destinyNode);
        this.graph.set(origin.toString(), originNode);
        this.graph.set(destiny.toString(), destinyNode);
    },

    pointsBelongToAdjacentConveyors : function(origin, destiny) {
        let distance = Math.abs(origin.x - destiny.x);
        return distance == CONVEYOR_BELT_HORIZONTAL_OFFSET;
    },

    pointIsOnScanner : function(point) {
        // TODO
        return false;
    },

    pathIntersectsAnyOfTheExistent : function(origin, destiny) {
        let graph = this;
        let intersects = false;
        this.graph.forEach(function(value, key) {
            let node = value;

            // Ignore input nodes
            if (node.hasOutput() && node.position.y != CONVEYOR_BELT_SPAWN_Y) {
                let p1 = origin;
                let q1 = destiny;
                let p2 = node.position;
                let q2 = node.nextNode.position;

                if (graph.linesIntersect(p1, q1, p2, q2)) {
                    intersects = true;
                    return;
                }
            }
        });
        return intersects;
    },

    linesIntersect : function(p1, q1, p2, q2) {
        // Source: https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);

        if (o1 != o2 && o3 != o4) {
            return true;
        }

        if (o1 == 0 && this.onSegment(p1, p2, q1)) {
            return true;
        } else if (o2 == 0 && this.onSegment(p1, q2, q1)) {
            return true;
        } else if (o3 == 0 && this.onSegment(p2, p1, q2)) {
            return true;
        } else if (o4 == 0 && this.onSegment(p2, q1, q2)) {
            return true;
        }

        return false;
    },

    orientation : function(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0) {
            return 0;
        }

        return (val > 0) ? 1 : 2;
    },

    onSegment : function(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
    },

    updateOriginColumn : function(originNode) {
        let previousNode = this.getPreviousNode(originNode.position);
        if (!previousNode.outputIsInDifferentColumn()) {
            previousNode.nextNode = originNode;
        }
    },

    updateDestinyColumn : function(destinyNode) {
        let previousNode  = this.getPreviousNode(destinyNode.position);
        let nextNode = this.getNextNode(destinyNode.position);

        if (!previousNode.outputIsInDifferentColumn()) {
            previousNode.nextNode = destinyNode;
        }
        destinyNode.nextNode = nextNode;
    },

    getPreviousNode : function(position) {
        let nodesInColumn = this.getNodesInSameColumn(position);

        // Descarta los nodos que estan por debajo de la posicion argumento
        let i = nodesInColumn.length;
        while (i--) {
            let node = nodesInColumn[i];
            if (node.position.y >= position.y) {
                nodesInColumn.splice(i, 1);
            }
        }

        // Ordena los nodos restantes de tal forma que el primero sea el previo a la posicion argumento
        nodesInColumn.sort(function(n1, n2) {
            if (n1.position.y > n2.position.y) {
                return -1;
            } else if (n1.position.y < n2.position.y) {
                return 1;
            } else {
                return 0;
            }
        });

        return nodesInColumn[0];
    },

    getNextNode : function(position) {
        let nodesInColumn = this.getNodesInSameColumn(position);
        
        // Descarta de los nodos que estan por encima de la posicion argumento
        let i = nodesInColumn.length;
        while (i--) {
            let node = nodesInColumn[i];
            if (node.position.y <= position.y) {
                nodesInColumn.splice(i, 1);
            }
        }

        // Ordena los nodos restantes de tal forma que el primero sea el siguiente a la posicion argumento
        nodesInColumn.sort(function(n1, n2) {
            if (n1.position.y < n2.position.y) {
                return -1;
            } else if (n1.position.y > n2.position.y) {
                return 1;
            } else {
                return 0;
            }
        });

        return nodesInColumn[0];
    },

    getColumns: function()
    {
        let columns = [];
        for(let i = 0; i < this.laneCount; i++)
        {
            columns[i] = this.spawnX + i * this.horizontalOffset;
        }
        return columns;
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

    calculateNewPosition : function(bag) {
        if (this.bagHasReachedItsDestiny(bag)) {
            let bagDestiny = bag.movementParameters.endingNodePosition;
            let reachedNode = this.graph.get(bagDestiny.toString());

            if (reachedNode.hasOutput()) {
                // Si no es un nodo final, actualizar las variables de movimiento de la maleta
                bag.movementParameters = this.getMovementParameters(reachedNode.position);
            } else {
                bag.onDestinyMet(reachedNode);
            }
            return reachedNode.position;
        }

        let movementParameters = bag.movementParameters;
        let s0 = movementParameters.startingNodePosition;
        let dir = movementParameters.direction;
        let t = movementParameters.t;

        // Movimiento rectilineo uniforme
        let v = dir.multiply(t * BAG_SPEED);
        let s = addVectors(s0, v);
        bag.movementParameters.t += game.time.physicsElapsed;

        return s;
    },

    bagHasReachedItsDestiny(bag) {
        let bagPosition = bag.position;
        let bagDestiny = bag.movementParameters.endingNodePosition;
        let distance = Math.sqrt(
            Math.pow(bagPosition.x - bagDestiny.x, 2)
            + Math.pow(bagPosition.y - bagDestiny.y, 2));

        let previousDistance = bag.movementParameters.distanceToEndingNode;
        if (previousDistance < distance) {
            // Quiere decir que ha alcanzado el nodo y se esta alejando de el
            return true;
        }

        bag.movementParameters.distanceToEndingNode = distance;
        return false;
    },

    displayGraph : function() {
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