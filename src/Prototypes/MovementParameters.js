function MovementParameters(startingNodePosition, endingNodePosition) {
    this.startingNodePosition = startingNodePosition;   // Posicion del nodo en el que la maleta comenzo el movimiento
    this.endingNodePosition = endingNodePosition;       // Posicion del nodo al que se tiene que dirigir
    this.direction = new Vector2D(
        endingNodePosition.x - startingNodePosition.x,
        endingNodePosition.y - startingNodePosition.y
    ).normalize();
    this.t = 0;     // Tiempo transcurrido desde que comenzo el movimiento desde startingNode a endingNode
}