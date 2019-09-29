const CONVEYOR_BELT_SPRITE_SHEET_KEY = "conveyor_belt_sprite_key";
const CONVEYOR_BELT_SPRITE_SHEET_PATH = "/resources/sprites/bag_placeholder.png"; // TODO

const CONVEYOR_BELT_NUMBER = 4;
const CONVEYOR_BELT_SPAWN_X = 100;
const CONVEYOR_BELT_SPAWN_Y = 100;
const CONVEYOR_BELT_HORIZONTAL_OFFSET = 100;
const CONVEYOR_BELT_VERTICAL_DISTANCE = 100;

function ConveyorBelt(id) {
    let x = CONVEYOR_BELT_SPAWN_X + id * CONVEYOR_BELT_HORIZONTAL_OFFSET;
    let y = CONVEYOR_BELT_SPAWN_Y;
    
    this.id = id;
    this.sprite = game.add.sprite(x, y, BAG_SPRITE_SHEET_KEY);
}