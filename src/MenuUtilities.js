function ensureThatMenuMusicIsPlaying() {
    if (menuMusic == null) menuMusic = game.add.audio(MENU_MUSIC_KEY);
    
    if (!menuMusic.isPlaying) {
        menuMusic.volume = MENU_MUSIC_VOLUME;
        menuMusic.loop = true;
        menuMusic.play();
    }
}

function createBackButton(backStateName) {
    let callback = function (button, pointer, isOver) {
        if (isOver) {
            game.state.start(backStateName);
        }
    }

    let button = new Phaser.Button(game, 0, 0, HOME_BUTTON_IMAGE_KEY, callback);
    button.anchor.setTo(0, 1);
    
    button.x = BACK_BUTTON_MARGIN;
    button.y = GAME_HEIGHT - BACK_BUTTON_MARGIN;

    button.scale.setTo(BACK_BUTTON_SCALE_FACTOR, BACK_BUTTON_SCALE_FACTOR);

    return button;
}