const CONVEYOR_BELT_SPRITESHEET_KEY = "sheet_PlaceholderBelt";

//Spritesheet dimension data
const CONVEYOR_BELT_SPRITE_SIZE = 256;
const CONVEYOR_BELT_SHEET_MARGIN = 20;
const CONVEYOR_BELT_SHEET_SPACING = 10;
const CONVEYOR_BELT_SHEET_TOTAL_FRAME_COUNT = 4;

const CONVEYOR_BELT_SHEET_RAILING_FRAME_COUNT = 3;

const CONVEYOR_LANE_SCALE_FACTOR = 0.65;
const CONVEYOR_PATH_SCALE_FACTOR = 0.5;
const CONVEYOR_BELT_Y_SCALE_FACTOR = 0.8;

const CONVEYOR_BELT_WIDTH_LANE = 151 * CONVEYOR_LANE_SCALE_FACTOR;
const CONVEYOR_BELT_WIDTH_PATH = 151 * CONVEYOR_PATH_SCALE_FACTOR;

const CONVEYOR_BELT_ROTATION_OFFSET = -Math.PI / 2;

function ConveyorBelt(group, start, end, scaleFactor, mask) {
    this.scaleFactor = scaleFactor;
    
    this.beltTileSprite = this.createBeltTileSprite();
    this.group = group;
    this.group.add(this.beltTileSprite);

    this.railingImages = [];

    this.start = start;
    this.end = end;

    this.refresh();

    //Testing the mask idea
    this.mask = mask;
    this.beltTileSprite.mask = mask;
}

ConveyorBelt.prototype = {
    createBeltTileSprite: function() {
        
        let tileSprite = new Phaser.TileSprite(game, 0, 0, CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITE_SIZE, CONVEYOR_BELT_SPRITESHEET_KEY);
        tileSprite.frame = 3;

        tileSprite.scale.set(this.scaleFactor, CONVEYOR_BELT_Y_SCALE_FACTOR);

        tileSprite.anchor.set(0.5, 0);
        tileSprite.pivot.set(0.5, 0);

        tileSprite.autoScroll(0, BAG_MOVEMENT_SPEED / tileSprite.scale.y);

        return tileSprite;
    },

    setStart: function(newStart) {
        this.start = newStart;
        this.refresh();
    },

    setEnd: function(newEnd) {
        this.end = newEnd;
        this.refresh();
    },

    setVisible: function(visible) {
        this.beltTileSprite.visible = visible;
        for (let i = 0; i < this.railingImages.length; i++) {
            this.railingImages[i].visible = visible;
        }
    },

    setColor: function(color) {
        this.beltTileSprite.tint = color;
        for (let i = 0; i < this.railingImages.length; i++) {
            this.railingImages[i].tint = color;
        }
    },

    setAlpha: function(alpha) {
        this.beltTileSprite.alpha = alpha;
        for (let i = 0; i < this.railingImages.length; i++) {
            this.railingImages[i].alpha = alpha;
        }
    },

    setMask: function(mask) {
        this.beltTileSprite.mask = mask;
        for (let i = 0; i < this.railingImages.length; i++) {
            this.railingImages[i].mask = mask;
        }
        this.mask = mask;
    },

    refresh: function() {
        let startToEndVector = substractVectors(this.end, this.start);
        let startToEndLength = startToEndVector.module();
        let rotation = startToEndVector.getRotationAngle() + CONVEYOR_BELT_ROTATION_OFFSET;

        this.refreshBelt(startToEndLength, rotation);
        this.refreshRailings(startToEndVector.normalize(), startToEndLength, rotation);
    },

    refreshBelt: function(startToEndLength, rotation) {
        
        let length = startToEndLength / CONVEYOR_BELT_Y_SCALE_FACTOR;
        
        //Position the sprite origin
        this.beltTileSprite.x = this.start.x;
        this.beltTileSprite.y = this.start.y;

        //Size and rotate the sprite
        this.beltTileSprite.height = length;
        this.beltTileSprite.rotation = rotation;
    },

    refreshRailings: function(beltDirection, startToEndLength, rotation) {
        
        //Figure out the tiling
        let numberOfPieces = Math.round(startToEndLength / (CONVEYOR_BELT_SPRITE_SIZE * this.scaleFactor));
        let scaleMultiplier = startToEndLength / (CONVEYOR_BELT_SPRITE_SIZE * this.scaleFactor * numberOfPieces);

        //If we have too many pieces, remove excess. If there's not enough, create them.
        let excess = this.railingImages.length - numberOfPieces;
        while (excess > 0) {
            this.railingImages[this.railingImages.length - 1].destroy();
            this.railingImages.splice(this.railingImages.length - 1, 1);
            excess--;
        }
        while (excess < 0) {
            let newImage = new Phaser.Image(game, 0, 0, CONVEYOR_BELT_SPRITESHEET_KEY);

            newImage.anchor.set(0.5, 0);
            newImage.pivot.set(0.5, 0);
            newImage.scale.set(this.scaleFactor, this.scaleFactor);
            
            let frame = Math.floor((Math.random() * CONVEYOR_BELT_SHEET_RAILING_FRAME_COUNT));
            newImage.frame = frame;

            this.group.add(newImage);
            this.railingImages.push(newImage);

            excess++;

            newImage.mask = this.mask;
        }

        //Place them
        let position = new Vector2D(this.start.x, this.start.y);
        let deltaPosition = beltDirection.multiply(this.scaleFactor * scaleMultiplier * CONVEYOR_BELT_SPRITE_SIZE);
        for (let i = 0; i < numberOfPieces; i++) {
            let image = this.railingImages[i];
            image.x = position.x;
            image.y = position.y;
            image.scale.y = this.scaleFactor * scaleMultiplier;
            image.rotation = rotation;

            position = addVectors(position, deltaPosition);
        }
    }
}