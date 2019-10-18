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

        this.scannerLength = this.end - this.start;
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
                let bagSprite = new Phaser.Sprite(game, 0, 0, Bag.interiorSpriteKey);
                bagSprite.anchor.setTo(0.5, 0.5);
                let iconSprite = new Phaser.Sprite(game, this.windowCenterX, this.windowStartY,Bag.sprite.key);
                iconSprite.anchor.setTo(0.5, 0.5);

                this.backgroundScanSprites.add(bagSprite);
                this.scanSprites.add(iconSprite);

                iconSprite.addChildAt(bagSprite,0);
                iconSprite.bringToTop();
                bagSprite.sendToBack();
            } else {
                let newInteriorSprite = this.scanSprites.create(this.windowCenterX, this.windowStartY, Bag.interiorSpriteKey);
                newInteriorSprite.anchor.setTo(0.5, 0.5);
            }
        }
    },

    ExitBag: function () {
        let bag = this.currentBags.shift();
        bag.inScan = false;
        this.scanSprites.remove(this.scanSprites.getAt(0), true, false);
    },

    UpdateScanner: function () {
        if (this.currentBags.length > 0) {
            // Actualiza la posición de los sprites interiores
            for (let i = 0; i < this.currentBags.length; i++) {
                let bag = this.currentBags[i];

                let bagPositionY = bag.position.y;
                let portionPenetrated = (bagPositionY - this.start) / this.scannerLength;

                let bagSpriteInScannerY = (1 - portionPenetrated) * this.windowStartY + portionPenetrated * this.windowEndY;
                this.scanSprites.getAt(i).y = bagSpriteInScannerY;
            }

            // Ve si la maleta mas avanzada ha salido
            let bag = this.currentBags[0];
            let bagY = bag.position.y;
            let bagSpriteHalfHeight = bag.sprite.height * bag.sprite.scale.y / 2;
            let scannerEndY = this.end;
            
            let distanceBag_Scanner = bagY - scannerEndY;
            if (distanceBag_Scanner >= bagSpriteHalfHeight) {
                this.ExitBag();
            }
        }

        this.scanSprites.visible = this.isActive;
    },

    IsInScanner: function (point) {
        return point.x == this.x && point.y >= this.start && point.y <= this.end;
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
    },

    setColor : function(color) {
        this.sprite.tint = color;
    }
}