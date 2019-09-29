function GraphNode(nodePosition, nextNode) {
    this.position = nodePosition;
    this.nextNode = nextNode;
}

GraphNode.prototype = {

    hasOutput : function() {
        return typeof this.nextNode !== 'undefined';
    },

    toString : function() {
        let nextNodeString = (this.hasOutput()) ? this.nextNode.position : new Vector2D(-1, -1);
        return "Node at " + this.position + ", being its next node at " + nextNodeString;
    }

}