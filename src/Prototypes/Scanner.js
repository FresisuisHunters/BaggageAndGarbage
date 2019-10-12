const SCAN_TIME = 100;

const SCANNER_SHEET_KEY = "scanner_spritesheet";

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

    this.windowStart = -300;
    this.windowEnd = 300;
    this.windowPosition = 650;
    this.scanSprites = game.add.group();
    game.world.sendToBack(this.scanSprites);    //Al hacer esto, se dibujan detrás de la cinta de la pantalla. Hay qu ehacer algo al respecto.

    this.SetInactive();

    this.runningSFX = game.add.audio(SFX_SCANNER_RUNNING_KEY);
    this.runningSFX.volume = SFX_SCANNER_RUNNING_VOLUME;
    this.runningSFX.loop = true;

    this.dangerDetectedSFX = game.add.audio(SFX_SCANNER_DETECTED_DANGER_KEY);
    this.dangerDetectedSFX.volume = SFX_SCANNER_DETECTED_DANGER_VOLUME;
    this.dangerDetectedSFX.loop = true;
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
    },

    EnterBag: function (Bag) {
        if (!Bag.inScan) {
            Bag.inScan = true;
            this.currentBags.push(Bag);
            this.scanSprites.create(this.windowPosition, this.windowStart, Bag.scanSprite);
            if (this.active && !this.runningSFX.isPlaying) this.runningSFX.play();
        }
    },

    ExitBag: function () {
        this.currentBags.inScan = false;    //TODO: Esto parece un typo, bórrame si no lo es. -Aitor
        this.currentBags.shift();
        this.scanSprites.remove(this.scanSprites.getAt(0), true, false);

        if (this.currentBags.length ==  0)  {
            if (this.runningSFX.isPlaying) this.runningSFX.stop();
            if (this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.stop();
        }
    },

    UpdateScanner: function () {

        let detectedDanger = false;
        if (this.currentBags.length > 0) {
            
            for (let i = 0; i < this.currentBags.length; i++) {
                this.scanSprites.getAt(i).y = game.math.linear(this.windowStart, this.windowEnd,
                    game.math.min(1, (this.currentBags[i].sprite.y - (this.start - this.currentBags[i].sprite.height)) /
                        (this.end - (this.start - this.currentBags[i].sprite.height * 2))));
            }

            if (this.currentBags[0].position.y - this.currentBags[0].sprite.height > this.end) {
                this.ExitBag();
            }
                
            if (this.active) {
                for (let i = 0; i < this.currentBags.length; i++) {
                    if (this.currentBags[i].type == BagTypes.C || this.currentBags[i].type == BagTypes.B_Danger)
                        detectedDanger = true;
                }
            }
        }

        if (detectedDanger) {
            this.sprite.frame = 1;
            if (!this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.play();
        } else {
            this.sprite.frame = 0;
            if (this.dangerDetectedSFX.isPlaying) this.dangerDetectedSFX.stop();
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