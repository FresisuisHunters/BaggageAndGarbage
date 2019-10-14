const SCAN_TIME = 100;

const SCANNER_SHEET_KEY = "scanner_spritesheet";
const SCANNER_FRAMES = {
    ACTIVE: 0,
    DANGER: 1,
    INACTIVE: 2
}

const SCANNER_SCALE_FACTOR = 0.8;

const SFX_SCANNER_RUNNING_KEY = "sfx_ScannerRunning";
const SFX_SCANNER_RUNNING_VOLUME = 0.05;
const SFX_SCANNER_DETECTED_DANGER_KEY = "sfx_ScannerDetectedDanger";
const SFX_SCANNER_DETECTED_DANGER_VOLUME = 1;

function Scanner(position, lane) {
    this.belt = lane;
    this.x = position.x;
    this.start = position.y;
    this.currentBags = [];
    this.initSprite(position);

    this.windowStartY = 0;
    this.windowEndY = LEVEL_DIMENSIONS.laneTopMargin;
    this.windowCenterX = GAME_WIDTH - (LEVEL_DIMENSIONS.scannerScreenWidth / 2);
    this.scanSprites = game.add.group();
    game.world.sendToBack(this.scanSprites);    //Al hacer esto, se dibujan detrás de la cinta de la pantalla. Hay que hacer algo al respecto.
    game.world.sendToBack(backgroundLayer);
    this.scanSprites.mask = this.createWindowMask();
    //this.scanSprites.z+=1;

    //Audio
    this.runningSFX = game.add.audio(SFX_SCANNER_RUNNING_KEY);
    this.runningSFX.volume = SFX_SCANNER_RUNNING_VOLUME;
    this.runningSFX.loop = true;

    this.dangerDetectedSFX = game.add.audio(SFX_SCANNER_DETECTED_DANGER_KEY);
    this.dangerDetectedSFX.volume = SFX_SCANNER_DETECTED_DANGER_VOLUME;
    this.dangerDetectedSFX.loop = true;

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
            let newInteriorSprite = this.scanSprites.create(this.windowCenterX, this.windowStartY, Bag.interiorSpriteKey);
            newInteriorSprite.anchor.setTo(0.5, 1);

            if (this.isActive && !this.runningSFX.isPlaying) this.runningSFX.play();

            //console.log("Bag: " + Bag.position.x + " Scanner: " + this.x);
        }
    },

    ExitBag: function () {
        let bag = this.currentBags.shift();
        bag.inScan = false;
        this.scanSprites.remove(this.scanSprites.getAt(0), true, false);

        if (this.currentBags.length ==  0)  {
            if (this.runningSFX.isPlaying) this.runningSFX.stop();
            if (this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.stop();
        }
    },

    UpdateScanner: function () {

        if (!this.isActive) return;

        let detectedDanger = false;
        if (this.currentBags.length > 0) {
            
            //Al haber al menos una maleta, runningSFX tiene que reproducirse
            if (!this.runningSFX.isPlaying) this.runningSFX.play();

            //Actualiza la posición de los sprits interiores
            for (let i = 0; i < this.currentBags.length; i++) {

                let t = game.math.min(1, (this.currentBags[i].sprite.y - (this.start - this.currentBags[i].sprite.height)) /
                    (this.end - (this.start - this.currentBags[i].sprite.height * 2)));

                this.scanSprites.getAt(i).y = game.math.linear(this.windowStartY, this.windowEndY + this.currentBags[i].sprite.height, t);       
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

        //Si hay peligro, reproduce su SFX
        if (detectedDanger) {
            this.sprite.frame = SCANNER_FRAMES.DANGER;
            if (!this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.play();
        } else {
            this.sprite.frame = SCANNER_FRAMES.ACTIVE;
            if (this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.stop();
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

        if (this.runningSFX.isPlaying) this.runningSFX.stop();
        if (this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.stop();
    }
}