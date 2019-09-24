const LUGGAGE_SPRITE_SHEET_KEY = "luggage_sprite_key";
const LUGGAGE_SPRITE_SHEET_PATH = "/resources/sprites/luggage_placeholder.png";

const LuggageTypes = {
    A: 0,
    B_Safe: 1,
    B_Danger: 2,
    C: 3
};


/**
 * 
 * @param {Number} destiny 
 * @param {Number} luggageType 
 * @param {Number} xSpawn 
 * @param {Number} ySpawn 
 */
function Luggage(destiny, luggageType, xSpawn, ySpawn) {
    this.destiny = destiny;

    this.sprite = game.load.image(
        xSpawn,
        ySpawn,
        LUGGAGE_SPRITE_SHEET_KEY
    );

    this.insideSprite = undefined; // TODO
}

Luggage.prototype = {

    moveLuggage : function(newX, newY) {
        this.sprite.x = this.insideSprite.x = newX;
        this.sprite.y = this.insideSprite.y = newY;
    },

    onDestinyMet : function(destiny) {

    }

}