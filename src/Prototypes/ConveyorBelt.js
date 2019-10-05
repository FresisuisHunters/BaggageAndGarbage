const CONVEYOR_BELT_SPRITE_KEY = "img_PlaceholderBelt.png";
const CONVEYOR_BELT_SPRITE_SIZE = 256;
const CONVEYOR_BELT_ROTATION_OFFSET = -Math.PI / 2;

function ConveyorBelt(group, start, end) {
    this.tileSprite = this.createTileSprite();
    group.add(this.tileSprite);

    this.start = start;
    this.end = end;

    this.refreshSprite();
}

ConveyorBelt.prototype = {
    createTileSprite: function() {
        let tileSprite = new Phaser.TileSprite(game, 0, 0, CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_KEY);
        tileSprite.scale.set(0.5, 0.5);
        tileSprite.anchor.set(0.5, 0);
        tileSprite.pivot.set(0.5, 0);


        tileSprite.autoScroll(0, BAG_MOVEMENT_SPEED / tileSprite.scale.y);


        return tileSprite;
    },

    setStart: function(newStart) {
        this.start = newStart;
        this.refreshSprite();
    },

    setEnd: function(newEnd) {
        this.end = newEnd;
        this.refreshSprite();
    },

    setVisible: function(visible) {
        this.tileSprite.visible = visible;
    },

    setColor: function(color) {
        this.tileSprite.tint = color;
    },

    setAlpha: function(alpha) {
        this.tileSprite.alpha = alpha;
    },

    refreshSprite: function() {
        //Position the sprite origin
        this.tileSprite.x = this.start.x;
        this.tileSprite.y = this.start.y;

        //Size and rotate the sprite
        let startToEndVector = substractVectors(this.end, this.start);
        this.tileSprite.height = startToEndVector.module() / this.tileSprite.scale.y;
        this.tileSprite.rotation = startToEndVector.getRotationAngle() + CONVEYOR_BELT_ROTATION_OFFSET;

        //Set the tiling so that it looks right
        this.tileSprite.tileScale.y = 1;

        //Animate the sprite
        this.tileSprite.tileScaleOffset.y = 1;

    }
}