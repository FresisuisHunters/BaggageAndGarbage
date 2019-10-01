const BAG_SPEED = 2;

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
    getMovementParameters : function(bag) {
        let origin = bag.position;
        let destiny = this.graph.get(origin.toString()).nextNode.position;  // Obtiene la posicion del nodo destino
        bag.movementParameters = new MovementParameters(origin, destiny);
    },

    // Origin y destiny son Vector2D
    addPath : function(origin, destiny) {
        if (origin.y >= destiny.y) {
            console.error("Error adding a path to the graph. Origin's Y must be higher than destiny's");
            return;
        }

        if (origin.y <= this.spawnY || origin.y > (this.spawnY + this.laneHeight)
            || destiny.y <= this.spawnY || destiny.y > (this.spawnY + this.laneHeight)) {
            console.error("Error adding a path to the graph. Origin or destiny Y are not in range (spawnY, spawnY + laneHeight)");
            return;
        }

        let distance = Math.abs(origin.x - destiny.x);
        if (distance != this.horizontalOffset) {
            console.error("Error adding a path to the graph. A path must connect two adjacent conveyor belts");
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

    updateOriginColumn : function(originNode) {
        let previousNode = this.getPreviousNode(originNode.position);
        previousNode.nextNode = originNode;
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

    moveBag : function(bag) {
        let reachedANewNode = false;

        let movementParameters = bag.movementParameters;
        let s0 = movementParameters.startingNodePosition;
        let dir = movementParameters.direction;
        let t = movementParameters.t;

        // Movimiento rectilineo uniforme
        let v = dir.multiply(t * BAG_SPEED);
        let s = addVectors(s0, v);

        bag.moveBag(s);
        bag.movementParameters.t += 0.5;   // TODO: Obtener de Phaser el tiempo ocurrido entre entre frames

        if (this.bagHasReachedItsDestiny(bag)) {
            reachedANewNode = true;
            bag.position = movementParameters.endingNodePosition;

            let reachedNode = this.graph.get(bag.position.toString());
            if (reachedNode.hasOutput()) {
                // Si no es un nodo final, actualizar las variables de movimiento de la maleta
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

        return bagPosition.y >= bagDestiny.y;
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