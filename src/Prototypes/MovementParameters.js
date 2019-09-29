function MovementParameters(startingNodePosition, endingNodePosition) {
    this.startingNodePosition = startingNodePosition;
    this.endingNodePosition = endingNodePosition;
    this.direction = new Vector2D(
        endingNodePosition.x - startingNodePosition.x,
        endingNodePosition.y - startingNodePosition.y
    ).normalize();
    this.t = 0;
}