const BAG_MOVEMENT_SPEED = 75;
const BAG_SPRITE_SIZE = 256;
const BAG_SCALE_FACTOR = 0.6;

const DEBUG_SHOW_COLLIDERS = true;
const MIN_DISTANCE_BETWEEN_BAGS = 100;
const MAX_DISTANCE_TO_LANE_FOR_PRIORITY = 100;

const BagTypes = {
    A: "A",
    B_Safe: "B_Safe",
    B_Danger: "B_Danger",
    C: "C"
};
var ScanSprites = {
    A: LANE_ICON_SPRITE_KEY_SAFE,
    B_Safe: LANE_ICON_SPRITE_KEY_SAFE,
    B_Danger: LANE_ICON_SPRITE_KEY_DANGER,
    C: LANE_ICON_SPRITE_KEY_DANGER
};

/**
 * 
 * @param {Number} destiny 
 * @param {Number} bagType 
 * @param {Vector2D} position
 */
function Bag(bagType, position, graph, lanes) {

    this.type = bagType;
    this.position = position;
    this.graph = graph;
    this.lanes = lanes;

    this.hasReachedEnd = false;
    this.movementParameters = new MovementParameters(this.graph.graph.get(this.position.toString()));

    this.inScan = false;

    this.initializeSprite();

    this.insideSprite = undefined; // TODO
}

Bag.prototype = {

    initializeSprite: function () {

        this.scanSprite = ScanSprites[this.type];

        //Get out options depending on the bag type
        availableSpriteNames = null;
        switch (this.type) {
            case BagTypes.A:
                availableSpriteNames = A_TYPE_BAG_SPRITE_KEYS;
                break;
            case BagTypes.B_Safe:
            case BagTypes.B_Danger:
                availableSpriteNames = B_TYPE_BAG_SPRITE_KEYS;
                break;
            case BagTypes.C:
                availableSpriteNames = C_TYPE_BAG_SPRITE_KEYS;
                break;
        }

        if (availableSpriteNames == null) console.error("Se ha creado una maleta de tipo " + bagType + ". Este valor no está permitido.");
        else if (availableSpriteNames.length == 0) console.error("No existe ningún sprite de maleta de tipo " + bagType + ".");

        //Create and congifure the sprite
        let spriteIndex = Math.floor(Math.random() * availableSpriteNames.length);
        this.sprite = bagLayer.create(this.position.x, this.position.y, availableSpriteNames[spriteIndex]);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.pivot.set(0.5, 0.5);
        this.sprite.scale.set(BAG_SCALE_FACTOR, BAG_SCALE_FACTOR);
        
        //Rotate randomly
        let rotation = Math.random() * 2 * Math.PI;
        this.sprite.rotation = rotation;

        // Collision purposes
        game.physics.arcade.enable(this.sprite);
        this.sprite.enableBody = true;
        this.sprite.body.immovable = true; 
        
        let radius = MIN_DISTANCE_BETWEEN_BAGS / BAG_SCALE_FACTOR;
        let offset = -radius + (0.5 * BAG_SPRITE_SIZE);
        this.sprite.body.setCircle(radius, offset, offset);

        
        this.sprite.lastPosition = this.position;
    },

    update: function () {
        // Update collisions
        this.sprite.blockCountThisFrame = 0;
        game.physics.arcade.collide(this.sprite, bagLayer, this.collisionHandler, null, this);

        // Movement
        if (!this.hasReachedEnd) {
            if (this.sprite.blockCountThisFrame == 0) {
                this.moveInGraph();
            }
        } else {
            this.moveAfterEnd();
        }
        
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    },

    moveInGraph: function () {

        let movementResult = this.graph.requestMove(this.position, this.movementParameters, BAG_MOVEMENT_SPEED * game.time.physicsElapsed);
        this.sprite.positionBeforeBeingBlocked = this.position;
        this.sprite.lastPosition = this.position;
        this.position = movementResult.position;

        if (movementResult.hasReachedEnd) {
            this.hasReachedEnd = true;
            this.laneEnd = this.getLaneEndFromLaneX(this.position.x);
            this.laneEnd.manageBag(this);
        }
    },

    moveAfterEnd: function () {
        this.position = this.laneEnd.requestMove(this);
    },

    collisionHandler: function (thisBagSprite, collidedBagSprite) {
        let thisBagIsInLane = this.bagIsInLane(thisBagSprite.x);
        let otherBagIsInLane = this.bagIsInLane(collidedBagSprite.x);

        if (thisBagIsInLane && otherBagIsInLane) {
            //We are both in a lane. Are they the same lane?
            if (thisBagSprite.x == collidedBagSprite.x) {
                if (thisBagSprite.y < collidedBagSprite.y) {
                    //If I'm higher, let them pass
                    thisBagSprite.blockCountThisFrame++;
                }
                //If we aren't on the same lane, we don't care.
            }
        } else if ((thisBagIsInLane && !otherBagIsInLane) || (!thisBagIsInLane && otherBagIsInLane)) {
            //One is a lane and one is in a path. Priority is slightly complicated.
            this.bagsAreInDifferentWaysCollision(thisBagSprite, collidedBagSprite);
        } else if (!thisBagIsInLane && !otherBagIsInLane) {
            //None of us is in a lane. Whoever's further gets priority.
            //Ignore this collision if we aren't moving in the same direction
            let thisIsMovingToTheRight = thisBagSprite.x - thisBagSprite.lastPosition.x > 0;
            let otherIsMovingToTheRight = collidedBagSprite.x - collidedBagSprite.lastPosition.x > 0;  
            
            if (thisIsMovingToTheRight == otherIsMovingToTheRight) {
                if (thisIsMovingToTheRight) {
                    if (thisBagSprite.x < collidedBagSprite.x) thisBagSprite.blockCountThisFrame++;
                } else {
                    if (thisBagSprite.x > collidedBagSprite.x) thisBagSprite.blockCountThisFrame++;
                }
            }
        }
    },

    bagsAreInDifferentWaysCollision : function(thisBagSprite, collidedBagSprite) {
        let thisBagIsInLane = this.bagIsInLane(thisBagSprite.x);
        let bagInLane = thisBagIsInLane ? thisBagSprite : collidedBagSprite;
        let bagInPath = !thisBagIsInLane ? thisBagSprite : collidedBagSprite;
        
        if (!this.bagIsHeadingToOthersBagLane(bagInPath, bagInLane)) return;

        if (bagInLane.y > bagInPath.y) {
            //If I'm lower than them, I've got priority.
            bagInPath.blockCountThisFrame++;
        } else {
            //If I'm higher than them, I've got priority unless they're sufficiently close to the lane.
            if (Math.abs(bagInLane.x - bagInPath.x) < MAX_DISTANCE_TO_LANE_FOR_PRIORITY) {
                bagInLane.blockCountThisFrame++;
            } else {
                bagInPath.blockCountThisFrame++;
            }
        }
    },

    bagIsHeadingToOthersBagLane : function(bagSprite, bagInLaneSprite) {
        let bagMovementDirection = substractVectors(bagSprite.position, bagSprite.positionBeforeBeingBlocked);

        if (bagMovementDirection.x > 0) {
            return bagInLaneSprite.x > bagSprite.position.x;
        } else {
            return bagInLaneSprite.x < bagSprite.position.x;
        }
    },

    bagIsInLane: function (bagXPosition) {
        for (let i = 0; i < this.lanes.length; ++i) {
            if (this.lanes[i].x == bagXPosition) {
                return true;
            }
        }
        return false;
    },

    getLaneEndFromLaneX: function (laneX) {
        for (let i = 0; i < this.lanes.length; i++) {
            if (this.lanes[i].x == laneX) return this.lanes[i].laneEnd;
        }

        console.error("No LaneEnd was found for x:" + laneX);
    }
}