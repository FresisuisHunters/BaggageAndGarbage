const SCAN_TIME = 100;

const SCANNER_SHEET_KEY = "scanner_spritesheet";
const SCANNER_FRAMES = {
    ACTIVE: 0,
    DANGER: 1,
    INACTIVE: 2
}

const SCANNER_SCALE_FACTOR = 0.8;

function Scanner(position, lane) {
    this.belt = lane;
    this.x = position.x;
    this.start = position.y;
    this.currentBags = [];
    this.initSprite(position);

    this.windowStartY = 0;
    this.windowEndY = LEVEL_DIMENSIONS.laneTopMargin;
    this.windowCenterX = GAME_WIDTH - (LEVEL_DIMENSIONS.scannerScreenWidth / 2);
    this.backgroundScanSprites = game.add.group();
    this.scanSprites = game.add.group();
    game.world.sendToBack(this.scanSprites);
    game.world.sendToBack(this.backgroundScanSprites);
    game.world.sendToBack(backgroundLayer);
    this.scanSprites.mask = this.createWindowMask();

    //Primero se pone a true para que dentro de inactive no se ignore la llamada por ser redundante
    this.isActive = true;
    this.SetInactive();
}

Scanner.prototype = {
    initSprite: function (position) {
        this.sprite = game.add.image(
            position.x,
            position.y,
            SCANNER_SHEET_KEY
        );
        this.sprite.frame = SCANNER_FRAMES.INACTIVE;
        this.sprite.scale.set(SCANNER_SCALE_FACTOR, SCANNER_SCALE_FACTOR);
        this.sprite.anchor = new Phaser.Point(0.5, 0);
        this.end = this.start + this.sprite.height * this.sprite.scale.y;
    },

    createWindowMask: function() {
        let mask = new Phaser.Graphics(game);
        mask.beginFill(0xffffff);

        let topLeft = {x: GAME_WIDTH - LEVEL_DIMENSIONS.scannerScreenWidth, y: 0};
        let bottomLeft = {x: topLeft.x, y: LEVEL_DIMENSIONS.laneTopMargin};
        let bottomRight = {x: GAME_WIDTH, y: bottomLeft.y};
        let topRight = {x: bottomRight.x, y: topLeft.y};

        mask.drawPolygon(new Phaser.Polygon([topLeft, topRight, bottomRight, bottomLeft]));
        return mask;
    },

    EnterBag: function (Bag) {
        if (!Bag.inScan) {
            Bag.inScan = true;
            this.currentBags.push(Bag);

            if (Bag.type == BagTypes.A || Bag.type == BagTypes.C) {
                //let bagSprite = new Phaser.Sprite(game, this.windowCenterX, this.windowStartY, Bag.sprite.key);
                let bagSprite = new Phaser.Sprite(game, 0, 0, Bag.interiorSpriteKey);
                bagSprite.anchor.setTo(0.5, 1);
                let iconSprite = new Phaser.Sprite(game, this.windowCenterX, this.windowStartY,Bag.sprite.key);
                iconSprite.anchor.setTo(0.5, 1);

                this.backgroundScanSprites.add(bagSprite);
                this.scanSprites.add(iconSprite);

                iconSprite.addChildAt(bagSprite,0);
                iconSprite.bringToTop();
                bagSprite.sendToBack();

            } else {
                let newInteriorSprite = this.scanSprites.create(this.windowCenterX, this.windowStartY, Bag.interiorSpriteKey);
                newInteriorSprite.anchor.setTo(0.5, 1);
            }
        }
    },

    ExitBag: function () {
        let bag = this.currentBags.shift();
        bag.inScan = false;
        this.scanSprites.remove(this.scanSprites.getAt(0), true, false);
    },

    UpdateScanner: function () {

        if (!this.isActive) return;

        let detectedDanger = false;
        if (this.currentBags.length > 0) {

            //Actualiza la posición de los sprits interiores
            for (let i = 0; i < this.currentBags.length; i++) {

                let t = game.math.min(1, (this.currentBags[i].sprite.y - (this.start - this.currentBags[i].sprite.height/2)) /
                    (this.end - (this.start - this.currentBags[i].sprite.height )));

                this.scanSprites.getAt(i).y = game.math.linear(this.windowStartY, this.windowEndY + this.currentBags[i].sprite.height*1.5, t);       
            }

            //Ve si alguna maleta ha salido
            if (this.currentBags[0].position.y - this.currentBags[0].sprite.height > this.end
                || this.currentBags[0].position.x != this.x) {
                this.ExitBag();
            }
            
            //Ve si hay peligro
            for (let i = 0; i < this.currentBags.length; i++) {
                if (this.currentBags[i].type == BagTypes.C || this.currentBags[i].type == BagTypes.B_Danger)
                    detectedDanger = true;
            }
        }
    },

    IsInScanner: function (point) {
        if (point.x == this.x && point.y >= this.start && point.y <= this.end) {
            return true;
        }
        else {
            return false;
        }
    },

    SetActive: function () {
        if (this.isActive) return;

        this.isActive = true;
        this.scanSprites.visible = true;
        this.sprite.frame = SCANNER_FRAMES.ACTIVE;
    },

    SetInactive: function () {
        if (!this.isActive) return;

        this.sprite.frame = SCANNER_FRAMES.INACTIVE;
        this.isActive = false;
        this.scanSprites.visible = false;
    }
}