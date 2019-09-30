function GraphNode(nodePosition, nextNode) {
    this.position = nodePosition;
    this.nextNode = nextNode;   // Los nodos finales almacenan undefined
}

GraphNode.prototype = {

    hasOutput : function() {
        return typeof this.nextNode !== 'undefined';
    },

    outputIsInDifferentColumn() {
        return this.position.x != this.nextNode.position.x;
    },

    toString : function() {
        let nextNodeString = (this.hasOutput()) ? this.nextNode.position : new Vector2D(-1, -1);
        return "Node at " + this.position + ", being its next node at " + nextNodeString;
    }

}