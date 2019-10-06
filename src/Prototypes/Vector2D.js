function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

Vector2D.prototype = {

    normalize : function() {
        let module = this.module();
        return new Vector2D(this.x / module, this.y / module);
    },

    multiply : function(constant) {
        return new Vector2D(constant * this.x, constant * this.y);
    },

    module : function() {
        let xSquare = this.x * this.x;
        let ySquare = this.y * this.y;
        return Math.sqrt(xSquare + ySquare);
    },

    getRotationAngle: function() {
        return Math.atan2(this.y, this.x);
    },

    toString : function() {
        return "(" + this.x + ", " + this.y + ")";
    },

    toPhaserPoint: function() {
        return new Phaser.Point(this.x, this.y);
    }

}

function addVectors(v1, v2) {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

function substractVectors(v1, v2) {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
}