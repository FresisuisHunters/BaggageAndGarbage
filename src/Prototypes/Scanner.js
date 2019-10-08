const SCAN_TIME = 100;

const SCANNER_SPRITE_KEY = "scanner_placeholder.png";

function Scanner(position, lane) {
    this.belt = lane;
    this.x = position.x;
    //posiciones inicial y final del scanner
    this.start = position.y;
    this.currentBags = [];
    this.initSprite(position);

    this.windowStart = 200;
    this.windowEnd = 500;

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

        /*this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.SetActive, this);*/

        this.end = this.start + this.sprite.height * this.sprite.scale.y;
        console.log("start"+ this.start);
        console.log("end " + this.end);
    },
    EnterBag: function (Bag) {
        if (!Bag.inScan) {
            Bag.inScan = true;
            this.currentBags.push(Bag);
            switch (Bag.type) {
                case BagTypes.A:
                    this.scanSprites.create(this.windowStart, 0, LANE_ICON_SPRITE_KEY_SAFE);
                    break;
                case BagTypes.B_Safe:
                    this.scanSprites.create(this.windowStart, 0, LANE_ICON_SPRITE_KEY_SAFE);
                    break;
                case BagTypes.B_Danger:
                    this.scanSprites.create(this.windowStart, 0, LANE_ICON_SPRITE_KEY_DANGER);
                    break;
                case BagTypes.C:
                    this.scanSprites.create(this.windowStart, 0, LANE_ICON_SPRITE_KEY_DANGER);
                    break;
            }

            //console.log(this.currentBags);
            //console.log(this.scanSprites);
        }

        //this.currentBag.sprite.visible = false;
        //this.entryTime = game.time.time;
    },
    ExitBag: function () {

        this.currentBags.inScan = false;
        this.currentBags.shift();
        this.scanSprites.remove(this.scanSprites.getAt(0),true,false);
        console.log(this.scanSprites.children);
        //this.scanSprites.splice(0,1);
        //exitBag.sprite.visible = true;
    },
    UpdateScanner: function () {
        if (this.currentBags.length > 0) {
            for (let i = 0; i < this.currentBags.length; i++) {
                this.scanSprites.getAt(i).x = game.math.linear(this.windowStart,this.windowEnd,
                    this.currentBags[i].position.y-(this.start-this.currentBags[i].sprite.height/2)/
                    ((this.end+this.currentBags[i].sprite.height)-this.currentBags[i].sprite.height/2));
                    console.log(((this.currentBags[i].position.y+this.currentBags[i].sprite.height/2)-this.start)/
                    ((this.end+this.currentBags[i].sprite.height)-this.start));
            }

            if (this.currentBags[0].position.y-this.currentBags[0].sprite.height > this.end)
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