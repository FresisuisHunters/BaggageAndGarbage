var BAG_MOVEMENT_SPEED = 60;
const BAG_SPRITE_SIZE = 256;
const BAG_SCALE_FACTOR = 0.6;

const DEBUG_SHOW_COLLIDERS = false;
const MIN_DISTANCE_BETWEEN_BAGS = 60;
const MAX_DISTANCE_TO_LANE_FOR_PRIORITY = 100;

const BagTypes = {
    A: "A",
    B_Safe: "B_Safe",
    B_Danger: "B_Danger",
    C: "C"
};

const INTERIOR_SPRITE_KEY_A = "img_Interior_A";
const INTERIOR_SPRITE_KEY_C = "img_Interior_C";

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
    this.chooseInteriorSprite(this.sprite.key);

    this.sprite.bagsImCedingTo = [];
}

Bag.prototype = {

    initializeSprite: function () {

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
        // https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
        game.physics.arcade.enable(this.sprite);
        this.sprite.enableBody = true;
        this.sprite.body.immovable = true; 
        
        let radius = MIN_DISTANCE_BETWEEN_BAGS / BAG_SCALE_FACTOR;
        let offset = -radius + (0.5 * BAG_SPRITE_SIZE);
        this.sprite.body.setCircle(radius, offset, offset);
        
        this.sprite.lastPosition = this.position;
    },

    chooseInteriorSprite: function(exteriorSpriteKey) {
        
        //Las maletas A y C no tienen interior, sólo un icono
        if (this.type == BagTypes.A)  {
            this.interiorSpriteKey = INTERIOR_SPRITE_KEY_A;
            return;
        }
        else if (this.type == BagTypes.C) {
            this.interiorSpriteKey = INTERIOR_SPRITE_KEY_C;
            return;
        }

        //Busca el ID
        let indexOfID = exteriorSpriteKey.indexOf("ID", 0);
        let endOfID = exteriorSpriteKey.indexOf("_", indexOfID);
        let ID = exteriorSpriteKey.substring(indexOfID, endOfID);

        let choicePool;
        if (this.type == BagTypes.B_Safe) choicePool = SAFE_INTERIOR_SPRITE_KEYS[ID];
        else if (this.type == BagTypes.B_Danger) choicePool = DANGEROUS_INTERIOR_SPRITE_KEYS[ID];

        if (choicePool == null) {
            if (this.type == BagTypes.B_Safe) {
                console.warn("There is no safe interior for " + ID + ".");
                this.interiorSpriteKey = INTERIOR_SPRITE_KEY_A;
            } else {
                console.warn("There is no dangerous interior for " + ID + ".");
                this.interiorSpriteKey = INTERIOR_SPRITE_KEY_C;
            }
            return;
        } 

        //Escoje una variación entre los sprites disponibles
        let randomIndex = Math.floor((Math.random() * choicePool.length));
        this.interiorSpriteKey = choicePool[randomIndex];
    },

    update: function () {
        // Update collisions
        this.sprite.blockCountThisFrame = 0;
        this.sprite.bagsImCedingTo.length = 0;
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
                    this.tryCedePriority(thisBagSprite, collidedBagSprite);
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
                    if (thisBagSprite.x < collidedBagSprite.x) this.tryCedePriority(thisBagSprite, collidedBagSprite);
                } else {
                    if (thisBagSprite.x > collidedBagSprite.x) this.tryCedePriority(thisBagSprite, collidedBagSprite);
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
            this.tryCedePriority(bagInPath, bagInLane);
        } else {
            //If I'm higher than them, I've got priority unless they're sufficiently close to the lane.
            if (Math.abs(bagInLane.x - bagInPath.x) < MAX_DISTANCE_TO_LANE_FOR_PRIORITY) {
                this.tryCedePriority(bagInLane, bagInPath);
            } else {
                this.tryCedePriority(bagInPath, bagInLane);
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
    },

    tryCedePriority: function(thisBag, otherBag) {
        //Recursive search for oneself in the other.
        //If we found ourselves, don't cede.
        let foundSelf = this.findSelfInCedingWeb(thisBag, otherBag);
        
        if (!foundSelf) {
            thisBag.blockCountThisFrame++;
            thisBag.bagsImCedingTo.push(otherBag);
        }
    },

    findSelfInCedingWeb: function(self, searchedBag) {
        for (let i = 0; i < searchedBag.bagsImCedingTo.length; i++) {
            if (searchedBag.bagsImCedingTo[i] == self) {
                return true;
            } else {
                let foundSelf = this.findSelfInCedingWeb(self, searchedBag.bagsImCedingTo[i]);
                if (foundSelf) return true;
            }
        }

        return false;
    }
}