const BAG_MOVEMENT_SPEED = 100;
const BAG_SCALE_FACTOR = 0.3;

const BagTypes = {
    A: "A",
    B_Safe: "B_Safe",
    B_Danger: "B_Danger",
    C: "C"
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

    this.initializeSprite();
    /*
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
    */
    this.insideSprite = undefined; // TODO

}

Bag.prototype = {

    initializeSprite: function() {
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
        this.sprite.scale.set(BAG_SCALE_FACTOR, BAG_SCALE_FACTOR);
        

    },

    update: function() {
        if (!this.hasReachedEnd) this.move();

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        //this.displayGizmo();
    },

    move: function() {

        let movementResult = this.graph.requestMove(this.position, this.movementParameters, BAG_MOVEMENT_SPEED * game.time.physicsElapsed);
        this.position = movementResult.position;

        if (movementResult.hasReachedEnd) {
            this.hasReachedEnd = true;
            let laneEnd = this.getLaneEndFromLaneX(this.position.x);
            laneEnd.manageBag(this);
            this.sprite.destroy();
        }
    },

    getLaneEndFromLaneX: function(laneX) {
        for (let i = 0; i < this.lanes.length; i++) {
            if (this.lanes[i].x == laneX) return this.lanes[i].laneEnd;
        }

        console.error("No LaneEnd was found for x:" + laneX);
    },

    /*
    displayGizmo: function() {
        this.debugGizmo.centerOn(this.position.x, this.position.y);
        game.debug.geom(this.debugGizmo, "FE0101");
        this.debugGizmo.x = this.position.x;
        this.debugGizmo.y = this.position.y;
    }
    */

}