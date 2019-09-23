const LUGGAGE_SPRITE_SHEET_KEY = "conveyor_belt_sprite_key";
const LUGGAGE_SPRITE_SHEET_PATH = "/resources/sprites/luggage_placeholder.png"; // TODO

const CONVEYOR_BELT_SPAWN_X = 0;
const CONVEYOR_BELT_SPAWN_Y = 0;
const CONVEYOR_BELT_DISTANCE_OFFSET = 0;
const CONVEYOR_BELT_SPEED = 10.0;

function ConveyorBelt(id) {
    let x = CONVEYOR_BELT_SPAWN_X + id * CONVEYOR_BELT_DISTANCE_OFFSET;
    let y = CONVEYOR_BELT_SPAWN_Y;
    
    this.id = id;
    this.sprite = game.add.sprite(x, y, LUGGAGE_SPRITE_SHEET_KEY);
}