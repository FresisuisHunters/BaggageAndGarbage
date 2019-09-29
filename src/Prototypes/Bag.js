const BAG_SPRITE_SHEET_KEY = "bag_sprite_key";
const BAG_SPRITE_SHEET_PATH = "/resources/sprites/bag_placeholder.png";

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
function Bag(destiny, bagType, position) {
    this.position = position;
    this.debugGizmo = new Phaser.Rectangle(position.x, position.y, 20, 20);
    this.debugGizmo.centerOn(position.x, position.y);
    game.debug.geom(this.debugGizmo, "FE0101");

    this.reachedTheEnd = false;

    this.sprite = game.load.image(
        position.x,
        position.y,
        BAG_SPRITE_SHEET_KEY
    );

    this.insideSprite = undefined; // TODO
}

Bag.prototype = {

    moveBag : function(newPosition) {
        this.position = newPosition;
        this.debugGizmo.centerOn(newPosition.x, newPosition.y);
        game.debug.geom(this.debugGizmo, "FE0101");
        this.debugGizmo.x = newPosition.x;
        this.debugGizmo.y = newPosition.y;
    },

    onDestinyMet : function() {
        this.reachedTheEnd = true;
        console.log("The bag reached the end");
    }

}