const SCAN_TIME = 100;

const SCANNER_SHEET_KEY = "scanner_spritesheet";

function Scanner(position, lane) {
    this.belt = lane;
    this.x = position.x;
    this.start = position.y;
    this.currentBags = [];
    this.initSprite(position);

    this.windowStart = -300;
    this.windowEnd = 300;
    this.windowPosition = 650;
    this.scanSprites = game.add.group();
    game.world.sendToBack(this.scanSprites);
}



Scanner.prototype = {
    initSprite: function (position) {
        this.sprite = game.add.image(
            position.x,
            position.y,
            SCANNER_SHEET_KEY
        );
        this.sprite.frame = 2;
        this.sprite.scale.set(0.8, 0.8);
        this.sprite.anchor = new Phaser.Point(0.5, 0);
        this.end = this.start + this.sprite.height * this.sprite.scale.y;
        this.active = false;
    },
    EnterBag: function (Bag) {
        if (!Bag.inScan) {
            Bag.inScan = true;
            this.currentBags.push(Bag);
            this.scanSprites.create(this.windowPosition, this.windowStart, Bag.scanSprite);
        }
    },
    ExitBag: function () {

        this.currentBags.inScan = false;
        this.currentBags.shift();
        this.scanSprites.remove(this.scanSprites.getAt(0), true, false);
    },
    UpdateScanner: function () {
        if (this.currentBags.length > 0) {
            for (let i = 0; i < this.currentBags.length; i++) {
                this.scanSprites.getAt(i).y = game.math.linear(this.windowStart, this.windowEnd,
                    game.math.min(1, (this.currentBags[i].sprite.y - (this.start - this.currentBags[i].sprite.height)) /
                        (this.end - (this.start - this.currentBags[i].sprite.height * 2))));
            }

            if (this.currentBags[0].position.y - this.currentBags[0].sprite.height > this.end)
                this.ExitBag();
            if (this.active) {
                this.sprite.frame = 0;
                for (var i = 0; i < this.currentBags.length; i++) {
                    if (this.currentBags[i].type == BagTypes.C || this.currentBags[i].type == BagTypes.B_Danger)
                        this.sprite.frame = 1;
                }
            }
        }
    },
    IsInScanner: function (point) {
        if (point.x == this.belt && point.y >= this.start && point.y <= this.end) {
            return true;
        }
        else
            return false;
    },
    SetActive: function () {
        this.active = true;
        this.scanSprites.visible = true;
        this.sprite.frame = 0;
    },
    SetInactive: function () {
        this.sprite.frame = 2;
        this.active = false;
        this.scanSprites.visible = false;
    }

}