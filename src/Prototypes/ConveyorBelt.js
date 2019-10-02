const CONVEYOR_BELT_SPRITE_SHEET_KEY = "conveyor_belt_sprite_key";
const CONVEYOR_BELT_SPRITE_SHEET_PATH = "/resources/sprites/bag_placeholder.png"; // TODO

// El grafo utiliza estos valores para inicializarse


function ConveyorBelt(id) {
    let x = CONVEYOR_BELT_SPAWN_X + id * CONVEYOR_BELT_HORIZONTAL_OFFSET;
    let y = CONVEYOR_BELT_SPAWN_Y;
    
    this.id = id;
    this.sprite = game.add.sprite(x, y, BAG_SPRITE_SHEET_KEY);
}