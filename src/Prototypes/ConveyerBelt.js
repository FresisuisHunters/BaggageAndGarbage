const CONVEYOR_BELT_SPAWN_X = 0;
const CONVEYOR_BELT_SPAWN_Y = 0;
const CONVEYOR_BELT_DISTANCE_OFFSET = 0;
const CONVEYOR_BELT_SPEED = 10.0;

class ConveyorBelt {

    constructor(id, texture) {
        let x = CONVEYOR_BELT_SPAWN_X + id * CONVEYOR_BELT_DISTANCE_OFFSET;
        let y = CONVEYOR_BELT_SPAWN_Y;
        let key = texture;

        this.id = id;
        this.sprite = new Sprite(game, x, y, key);
    }

}