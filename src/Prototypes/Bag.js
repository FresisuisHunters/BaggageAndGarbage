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

    this.reachedTheEnd = false;

    this.sprite = game.load.image(
        position.x,
        position.y,
        BAG_SPRITE_SHEET_KEY
    );

    this.insideSprite = undefined; // TODO
}

Bag.prototype = {

    moveBag : function(newX, newY) {
        this.sprite.x = this.insideSprite.x = newX;
        this.sprite.y = this.insideSprite.y = newY;
    },

    onDestinyMet : function() {
        this.reachedTheEnd = true;
        console.log("The bag reached the end");
    }

}