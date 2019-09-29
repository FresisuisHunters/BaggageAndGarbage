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
 * @param {Number} xSpawn 
 * @param {Number} ySpawn 
 */
function Bag(destiny, bagType, xSpawn, ySpawn) {
    this.position = new Vector2D(xSpawn, ySpawn);

    this.sprite = game.load.image(
        xSpawn,
        ySpawn,
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

    }

}