function GraphNode(nodePosition, nextNode) {
    this.position = nodePosition;
    this.nextNode = nextNode;
}

GraphNode.prototype = {

    hasOutput : function() {
        return typeof this.nextNode !== 'undefined';
    }

}