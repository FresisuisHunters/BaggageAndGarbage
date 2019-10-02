const BAG_SPRITE_SHEET_KEY = "bag_sprite_key";
const BAG_SPRITE_SHEET_PATH = "/resources/sprites/bag_placeholder.png";

const BAG_MOVEMENT_SPEED = 50;

const BagTypes = {
    A: 0,
    B_Safe: 1,
    B_Danger: 2,
    C: 3
};

/**
 * 
 * @param {Number} destiny 
 * @param {Number} bagType 
 * @param {Vector2D} position
 */
function Bag(bagType, position, graph) {
    
    this.type = bagType;
    this.position = position;
    this.graph = graph;
    
    this.reachedTheEnd = false;

    this.movementParameters = new MovementParameters(this.graph.graph.get(this.position.toString()));

    // Gizmo utilizado como alternativa para visualizarlo
    this.debugGizmo = new Phaser.Rectangle(position.x, position.y, 20, 20);
    this.debugGizmo.centerOn(position.x, position.y);
    game.debug.geom(this.debugGizmo, "FE0101");

    // TODO
    this.sprite = game.load.image(
        position.x,
        position.y,
        BAG_SPRITE_SHEET_KEY
    );

    this.insideSprite = undefined; // TODO
}

Bag.prototype = {

    update: function() {
        this.move();
        this.displayGizmo();
    },

    move : function() {
        this.graph.requestMove(this.position, this.movementParameters, BAG_MOVEMENT_SPEED * game.time.physicsElapsed);
    },

    displayGizmo: function() {
        this.debugGizmo.centerOn(this.position.x, this.position.y);
        game.debug.geom(this.debugGizmo, "FE0101");
        this.debugGizmo.x = this.position.x;
        this.debugGizmo.y = this.newPosition.y;
    },

    onDestinyMet : function(outputNode) {
        this.reachedTheEnd = true;
        console.log("The bag reached an output node");
        console.dir(outputNode);
    }

}