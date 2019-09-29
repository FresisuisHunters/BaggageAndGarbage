function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

Vector2D.prototype = {

    normalize : function() {
        let xSquare = this.x * this.x;
        let ySquare = this.y * this.y;
        let module = Math.sqrt(xSquare + ySquare);

        return new Vector2D(this.x / module, this.y / module);
    },

    multiply : function(constant) {
        return new Vector2D(constant * this.x, constant * this.y);
    },

    toString : function() {
        return "(" + this.x + ", " + this.y + ")";
    }

}

function addVectors(v1, v2) {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

function substractVectors(v1, v2) {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
}