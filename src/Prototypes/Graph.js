const MIN_DISTANCE_BETWEEN_NODES = 115;

function Graph(laneCount, spawnX, spawnY, horizontalOffset, laneHeight, scanners) {
    this.laneCount = laneCount;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.horizontalOffset = horizontalOffset;
    this.laneHeight = laneHeight;
    this.scanners = scanners;
    this.conveyorBelts = new Array();

    this.graph = new Map();
    this.initializeGraph();
    this.verboseMode = false;
}

Graph.prototype = {

    initializeGraph: function () {
        for (let i = 0; i < this.laneCount; ++i) {
            let x = this.spawnX + i * this.horizontalOffset;
            let originNodePosition = new Vector2D(x, this.spawnY);
            let destinyNodePosition = new Vector2D(x, this.spawnY + this.laneHeight);

            let destinyNode = new GraphNode(destinyNodePosition, undefined);
            let originNode = new GraphNode(originNodePosition, destinyNode);

            originNode.isLaneStart = true;
            destinyNode.isLaneEnd = true;

            this.graph.set(originNodePosition.toString(), originNode);
            this.graph.set(destinyNodePosition.toString(), destinyNode);
        }
    },

    addConveyorBelt : function(conveyorBelt) {
        this.conveyorBelts.push(conveyorBelt);
    },

    returnBeltsToOriginalColor : function() {
        this.conveyorBelts.forEach(function(conveyor) {
            conveyor.setColor("0xFFFFFF");
        });
    },

    //CAMINOS//
    ///////////
    // Origin y destiny son Vector2D
    tryAddPath: function (origin, destiny) {

        if (!this.pathIsValid(origin, destiny)) return false;

        let destinyNode = new GraphNode(destiny, undefined);
        let originNode = new GraphNode(origin, destinyNode);

        this.updateOriginColumn(originNode);
        this.updateDestinyColumn(destinyNode);
        this.graph.set(origin.toString(), originNode);
        this.graph.set(destiny.toString(), destinyNode);

        originNode.isTheStartOfAPath = true;
        destinyNode.isTheEndOfAPath = true;

        return true;
    },

    pathIsValid: function (origin, destiny) {
        if (!this.pointsBelongToAdjacentConveyors(origin, destiny)) {
            if (this.verboseMode) console.error("Error adding a path to the graph. A path must connect two adjacent conveyor belts");
            conflictNonAdjacentConveyors(this.conveyorBelts, origin, destiny);
            return false;
        }

        if (this.pointIsOnScanner(origin) || this.pointIsOnScanner(destiny)) {
            if (this.verboseMode) console.error("Error adding a path to the graph. Either origin or destiny are placed on top of a scanner");
            conflictConveyorOnScanner(this.scanners, origin, destiny);
            return false;
        }

        if (this.pathIntersectsOtherPaths(origin, destiny)) {
            if (this.verboseMode) console.error("Error adding a path to the graph. Paths can't intersect");
            conflictPathIntersection(this.conveyorBelts, origin, destiny);
            return false;
        }

        if (this.graph.has(origin) || this.graph.has(destiny)) {
            if (this.verboseMode) console.error("Error adding a path to the graph. Either origin or destiny already exist in the graph");
            return false;
        }

        if (this.positionIsTooCloseToExistingNodes(origin) ||
            this.positionIsTooCloseToExistingNodes(destiny)) {
            if (this.verboseMode) console.error("Error adding a path to the graph. Either origin or destiny are too close to existing objects");
            conflictNewBeltCloseToExistent(this.conveyorBelts, origin, destiny);
            return false;
        }

        return true;
    },

    pointsBelongToAdjacentConveyors: function (origin, destiny) {
        let distance = Math.abs(origin.x - destiny.x);
        return distance == this.horizontalOffset;
    },

    pointIsOnScanner: function (point) {
        for (let i = 0; i < this.scanners.length; i++) {
            if (this.scanners[i].IsInScanner(point))
                return true;
        }
        return false;
    },

    pathIntersectsOtherPaths: function (origin, destiny) {
        let pathsFromOriginSide = this.getPathOriginsFromLaneToLane(origin.x, destiny.x);
        let pathsFromDestinySide = this.getPathOriginsFromLaneToLane(destiny.x, origin.x);

        for (let i = 0; i < pathsFromOriginSide.length; i++) {
            let checkedIsHigherOnOriginSide = origin.y > pathsFromOriginSide[i].position.y;
            let checkedIsHigherOnDestinySide = destiny.y > pathsFromOriginSide[i].nextNode.position.y;

            if (checkedIsHigherOnOriginSide != checkedIsHigherOnDestinySide) return true;
        }

        for (let i = 0; i < pathsFromDestinySide.length; i++) {
            let checkedIsHigherOnDestinySide = destiny.y > pathsFromDestinySide[i].position.y;
            let checkedIsHigherOnOriginSide = origin.y > pathsFromDestinySide[i].nextNode.position.y;

            if (checkedIsHigherOnDestinySide != checkedIsHigherOnOriginSide) return true;
        }

        //Si hemos llegado aquí, es que no intersecta ningún camino existente.
        return false;
    },

    getPathOriginsFromLaneToLane: function (originLaneX, destinyLaneX) {
        let nodes = [];
        this.graph.forEach(function (value, key) {
            let node = value;
            if (node.isTheStartOfAPath) {
                if (node.position.x == originLaneX && node.nextNode.position.x == destinyLaneX) {
                    nodes.push(node);
                }
            }
        }, this);

        return nodes;
    },

    positionIsTooCloseToExistingNodes: function (position) {
        let previousNode = this.getPreviousNode(position);
        // Ignore distances if it's an input node
        if (previousNode.position.y != this.spawnY) {
            let distanceToPreviousNode = Math.abs(position.y - previousNode.position.y);
            if (distanceToPreviousNode <= MIN_DISTANCE_BETWEEN_NODES) {
                return true;
            }
        }

        let nextNode = this.getNextNode(position);
        // Ignore distances if it's an output node
        if (nextNode.hasOutput()) {    
            let distanceToNextNode = Math.abs(position.y - nextNode.position.y);
            if (distanceToNextNode <= MIN_DISTANCE_BETWEEN_NODES) {
                return true;
            }
        }

        return false;
    },

    updateOriginColumn: function (originNode) {
        let previousNode = this.getPreviousNode(originNode.position);
        if (!previousNode.outputIsInDifferentColumn()) {
            previousNode.nextNode = originNode;
        }
    },

    updateDestinyColumn: function (destinyNode) {
        let previousNode = this.getPreviousNode(destinyNode.position);
        let nextNode = this.getNextNode(destinyNode.position);

        if (!previousNode.outputIsInDifferentColumn()) {
            previousNode.nextNode = destinyNode;
        }
        destinyNode.nextNode = nextNode;
    },

    getPreviousNode: function (position) {
        let nodesInColumn = this.getNodesInSameColumn(position);

        // Descarta los nodos que estan por debajo de la posicion argumento
        let i = nodesInColumn.length;
        while (i--) {
            let node = nodesInColumn[i];
            if (node.position.y > position.y) {
                nodesInColumn.splice(i, 1);
            }
        }

        // Ordena los nodos restantes de tal forma que el primero sea el previo a la posicion argumento
        nodesInColumn.sort(function (n1, n2) {
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

    getNextNode: function (position) {
        let nodesInColumn = this.getNodesInSameColumn(position);

        // Descarta de los nodos que estan por encima de la posicion argumento
        let i = nodesInColumn.length;
        while (i--) {
            let node = nodesInColumn[i];
            if (node.position.y < position.y) {
                nodesInColumn.splice(i, 1);
            }
        }

        // Ordena los nodos restantes de tal forma que el primero sea el siguiente a la posicion argumento
        nodesInColumn.sort(function (n1, n2) {
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

    getColumns: function () {
        let columns = [];
        for (let i = 0; i < this.laneCount; i++) {
            columns[i] = this.spawnX + i * this.horizontalOffset;
        }
        return columns;
    },

    getNodesInSameColumn: function (position) {
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

    resetGraph: function () {
        this.graph.clear();
        this.conveyorBelts.splice(0, this.conveyorBelts.length);
        this.initializeGraph();
    },

    requestMove: function (currentPosition, movementParameters, distance) {

        let previousNode = movementParameters.previousNode;
        let nextNode;

        if (previousNode.isTheStartOfAPath) {

            //Nuestro siguiente nodo es el final de este camino.
            nextNode = previousNode.nextNode;
        }
        else {
            //Busca el siguiente nodo en este carril
            let currentClosestNode = null;
            let nodesInColumn = this.getNodesInSameColumn(currentPosition);
            for (let i = 0; i < nodesInColumn.length; i++) {
                let node = nodesInColumn[i];

                //El nodo debe estar por debajo de nuestra posición actual, y no puede ser el final de un camino
                if (node.position.y > currentPosition.y && !node.isTheEndOfAPath) {

                    //¿Es este el nodo válido más cercano que hemos encontrado?
                    if (currentClosestNode == null || node.position.y < currentClosestNode.position.y) {
                        currentClosestNode = nodesInColumn[i];
                    }
                }
            }

            nextNode = currentClosestNode;
        }

        let vectorToNextNode = substractVectors(nextNode.position, currentPosition)
        let distanceToNextNode = vectorToNextNode.module();

        //Se mueve lo que sea menos, la distancia normal o la distancia hasta el nodo. 
        //En el segundo caso se llama requestMove otra vez, con la distancia que no se haya viajado.
        let movedDistance;
        let passedNextNode;
        if (distanceToNextNode <= distance) {
            movedDistance = distanceToNextNode;
            movementParameters.previousNode = nextNode;
            passedNextNode = true;
        } else {
            movedDistance = distance;
            passedNextNode = false;
        }

        let hasReachedEnd = false;

        //Comprobar si hemos llegado al final
        if (passedNextNode && movementParameters.previousNode.isLaneEnd) {
            hasReachedEnd = true;
        }

        //Hacer el movimiento
        let finalPosition = addVectors(currentPosition, vectorToNextNode.normalize().multiply(movedDistance));
        distance -= movedDistance;

        //Preparar salida
        if (hasReachedEnd) {
            return {
                hasReachedEnd: true,
                position: movementParameters.previousNode.position
            }
        } else if (distance == 0) {
            return {
                hasReachedEnd: false,
                position: finalPosition
            }
        } else {
            return this.requestMove(finalPosition, movementParameters, distance);
        }
    },

    /*
    getIntoScanner(bag, scanner)
    {
        this.activeScanner = scanner;
        scanner.EnterBag(bag);
        new 
    },
    */

    displayGraph: function () {
        this.graph.forEach(function (value, key) {
            let nodePosition = value.position;
            let circle = new Phaser.Circle(nodePosition.x, nodePosition.y, 40);
            game.debug.geom(circle);

            let node = value;
            if (node.hasOutput()) {
                let outputNode = node.nextNode;

                let nodePosition = node.position;
                let outputNodePosition = outputNode.position;
                this.displaySection(nodePosition, outputNodePosition, "rgb(0, 255, 0)");
            }
        }, this)
    },

    //Recibe el color en formato color de CSS. Ej: "rgb(255, 255, 255)"
    displaySection: function (origin, destiny, color) {

        let line = new Phaser.Line(origin.x, origin.y, destiny.x, destiny.y);
        //game.graphics.lineWidth(4);
        //game.graphics.lineColor(color);
        //game.graphics.drawShape(line);

        game.debug.lineWidth = 8;
        game.debug.geom(line, color);
    },

    getNodes: function () {
        return this.graph.values();
    },

    printGraph: function () {
        this.graph.forEach(function (value, key) {
            console.log(value.toString());
        })
    }

}