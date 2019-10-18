"use strict"
const LaneEndTypes = {
    Safe: 0,
    Dangerous: 1
};

const LANE_ICON_SPRITE_KEY_SAFE = "img_LaneIcon_Safe"
const LANE_ICON_SPRITE_KEY_DANGER = "img_LaneIcon_Danger"
const LANE_ICON_SCALE_FACTOR = 0.6;

const LANE_ICON_Y_OFFSET = -30;
const LANE_END_LENGTH = 300;

const SFX_CORRECT_BAG_KEY = "sfx_CorrectBag";
const SFX_CORRECT_BAG_VOLUME = 1;
const SFX_WRONG_BAG_KEY = "sfx_WrongBag";
const SFX_WRONG_BAG_VOLUME = .5;

const CORRECT_BAG_FEEDBACK_COLOR = 0x00FF00;
const WRONG_BAG_SHAKE_SCALE = 20;
const BAG_FEEDBACK_ANIMATION_LENGTH = 1;

function LaneEnd(type, onBagKilled, bagList, position) {
    this.killThreshold = position.y + LANE_END_LENGTH;
    this.type = type;
    this.onBagKilled = onBagKilled,
    this.bags = bagList;

    //Initialize the sprite
    let iconSpriteKey;
    let beltSpriteSheet;
    switch (type) {
        case LaneEndTypes.Safe:
            iconSpriteKey = LANE_ICON_SPRITE_KEY_SAFE;
            beltSpriteSheet = CONVEYOR_BELT_SHEET_SAFE;
            break;
        case LaneEndTypes.Dangerous:
            iconSpriteKey = LANE_ICON_SPRITE_KEY_DANGER;
            beltSpriteSheet = CONVEYOR_BELT_SHEET_DANGER;
            break;
    }
    this.icon = new Phaser.Sprite(game, position.x, position.y + LANE_ICON_Y_OFFSET, iconSpriteKey, 0);
    overlayLayer.add(this.icon);
    this.icon.anchor.set(0.5, 0);
    this.icon.scale.set(LANE_ICON_SCALE_FACTOR, LANE_ICON_SCALE_FACTOR);

    //Create the ConveyorBelt
    this.conveyorBelt = new ConveyorBelt(laneLayer, position, new Vector2D(position.x, position.y + LANE_END_LENGTH), 
        CONVEYOR_LANE_SCALE_FACTOR, null, beltSpriteSheet);

    //Set up audio
    this.correctSFX = game.add.audio(SFX_CORRECT_BAG_KEY);
    this.correctSFX.volume = SFX_CORRECT_BAG_VOLUME;
    this.wrongSFX = game.add.audio(SFX_WRONG_BAG_KEY);
    this.wrongSFX.volume = SFX_WRONG_BAG_VOLUME;

    this.currentAnimation = null;
}

LaneEnd.prototype = {
    manageBag: function(bag) {
        let isCorrect = undefined;

        switch (bag.type) {
            case BagTypes.A:
            case BagTypes.B_Safe:
                isCorrect = this.type == LaneEndTypes.Safe;
                break;
            case BagTypes.B_Danger:
            case BagTypes.C:
                isCorrect = this.type == LaneEndTypes.Dangerous;
                break;
            default:
                console.error("A bag has type " + bag.type + ". That value doesn't make sense.");
        }

        if (isCorrect) {
            this.correctSFX.play();
            this.startCorrectAnimation();
        }
        else {
            this.wrongSFX.play();
            this.startWrongAnimation();
        } 

        this.onBagKilled(isCorrect);

    },

    requestMove: function(bag) {
        let newPosition = new Vector2D(bag.position.x, bag.position.y + BAG_MOVEMENT_SPEED * game.time.physicsElapsed);
        
        if (newPosition.y > this.killThreshold) {
            this.destroyBag(bag);
        }

        return newPosition;
    },

    destroyBag: function(bag) {
        let bagIndex = null;
        for (let i = 0; i < this.bags.length; i++) {
            if (this.bags[i] == bag) bagIndex = i;
        }
        if (bagIndex == null) console.error("A LaneEnd tried to kill a bag that isn't in the bags list.");

        this.bags.splice(bagIndex, 1);

        bag.sprite.destroy();
    },

    update: function() {
        if (this.currentAnimation != null) {
            if (this.currentAnimation.hasEnded) this.currentAnimation = null;
            this.currentAnimation.update();
        }
    },

    startCorrectAnimation: function() {
        if (this.currentAnimation != null) {
            this.currentAnimation.stop();
        }

        let newAnimation = {};
        newAnimation.belt = this.conveyorBelt;
        newAnimation.icon = this.icon;
        
        newAnimation.start = function() {
            this.belt.setColor(CORRECT_BAG_FEEDBACK_COLOR);
            this.icon.tint = CORRECT_BAG_FEEDBACK_COLOR;
            this.t = 0;
            this.hasEnded = false;
        }

        newAnimation.update = function() {
            let dt = game.time.physicsElapsed / BAG_FEEDBACK_ANIMATION_LENGTH;
            this.t += dt;

            if (this.t < 1) {
                let color = Phaser.Color.linear(CORRECT_BAG_FEEDBACK_COLOR, 0xFFFFFF, this.t);
                this.belt.setColor(color);
                this.icon.tint = color;
            } else {
                this.stop();
            }
        }

        newAnimation.stop = function() {
            this.belt.setColor(0xFFFFFF);
            this.icon.tint = 0xFFFFFF;
        }

        this.currentAnimation = newAnimation;
        newAnimation.start();
    },

    startWrongAnimation: function() {
        if (this.currentAnimation != null) {
            this.currentAnimation.stop();
        }

        let newAnimation = {};
        newAnimation.icon = this.icon;
        newAnimation.originalX = this.icon.x;
        newAnimation.originalY = this.icon.y;
        
        newAnimation.start = function() {
            this.t = 0;
            this.hasEnded = false;
        }

        newAnimation.update = function() {
            let dt = game.time.physicsElapsed / BAG_FEEDBACK_ANIMATION_LENGTH;
            this.t += dt;

            if (this.t < 1) {
                let xOffset = ((Math.random() - 0.5) * 2 * WRONG_BAG_SHAKE_SCALE) * (1 - this.t);
                let yOfsset = ((Math.random() - 0.5) * 2 * WRONG_BAG_SHAKE_SCALE) * (1 - this.t);

                this.icon.x = this.originalX + xOffset;
                this.icon.y = this.originalY + yOfsset;
            } else {
                this.stop();
            }
        }

        newAnimation.stop = function() {
            this.icon.x = this.originalX;
            this.icon.y = this.originalY;
        }

        this.currentAnimation = newAnimation;
        newAnimation.start();
    },
}