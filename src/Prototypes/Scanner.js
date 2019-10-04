function Scanner(position) {
    this.id = id;
    this.length = 10;
    this.belt = position.x;
    //posiciones inicial y final del scanner
    this.start = position.y;
    this.end = position + length;
    //sprite

    this.sprite = game.load.image(
        position.x,
        position.y,
        SCANNER_SPRITE_SHEET_KEY
    );

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(SetActive, this);
}

const SCAN_TIME = 1000;

const SCANNER_SPRITE_SHEET_PATH = "/resources/sprites/scanner_placeholder.png";

Scanner.prototype = {
    EnterBag: function (Bag) {
        if (this.currentBag == null) {
            this.currentBag = Bag;
            this.currentBag.sprite.visible = false;
            this.entryTime = game.time.time;
            return true;
        }
        else {
            return false;
        }
    },
    ExitBag: function () {

        let exitBag = this.currentBag;
        exitBag.moveBag(this.end);
        exitBag.sprite.visible = true;
        this.currentBag = null;
        this.entryTime = null;
        return exitBag;
    },
    DisplayScanner: function () {

    },
    IsInScanner: function(point) {
        if (point.x == this.belt && point.y >= this.start && point.y <= this.end) {
            return true;
        }
        else
            return false;
    },
    SetActive: function()
    {
        game.activeScanner = this;
    }

}