const SCAN_TIME = 100;

const SCANNER_SPRITE_KEY = "scanner_placeholder.png";

function Scanner(position, lane) {
    this.belt = lane;
    this.x = position.x;
    //posiciones inicial y final del scanner
    this.start = position.y;
    this.currentBags = [];
    this.initSprite(position);

    //temp

    this.scanSprites = game.add.group();
}



Scanner.prototype = {
    initSprite: function (position) {
        this.sprite = game.add.image(
            position.x,
            position.y,
            SCANNER_SPRITE_KEY
        );

        this.sprite.scale.set(0.15, 0.15);

        this.sprite.anchor = new Phaser.Point(0.5, 0);

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.SetActive, this);

        this.end = this.start + this.sprite.height * this.sprite.scale.y;
        console.log("end " + this.end);
    },
    EnterBag: function (Bag) {
        if (this.currentBags[0] != Bag) {
            this.currentBags.push(Bag);
            switch (Bag.type) {
                case BagTypes.A:
                    this.scanSprites.create(0, 0, LANE_ICON_SPRITE_KEY_SAFE);
                    break;
                case BagTypes.B_Safe:
                    this.scanSprites.create(0, 0, LANE_ICON_SPRITE_KEY_SAFE);
                    break;
                case BagTypes.B_Danger:
                    this.scanSprites.create(0, 0, LANE_ICON_SPRITE_KEY_DANGER);
                    break;
                case BagTypes.C:
                    this.scanSprites.create(0, 0, LANE_ICON_SPRITE_KEY_DANGER);
                    break;
            }

            //console.log(this.currentBags);
            //console.log(this.scanSprites);
        }

        //this.currentBag.sprite.visible = false;
        //this.entryTime = game.time.time;
    },
    ExitBag: function () {

        let exitBag = this.currentBags[0];
        this.currentBags.shift();
        this.scanSprites.getAt(0).destroy();
        //this.scanSprites.splice(0,1);
        //exitBag.sprite.visible = true;

        return exitBag;
    },
    UpdateScanner: function () {
        if (this.currentBags.length > 0) {
            for (let i = 0; i < this.currentBags.length; i++) {
                this.scanSprites.getAt(i).x += 25;
            }

            if (this.currentBags[0].position.y > this.end)
                this.ExitBag();
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
        this.scanSprites.visible=true;
    },
    SetInactive: function()
    {
        this.scanSprites.visible=false;
    }

}