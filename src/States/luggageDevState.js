"use strict";
var luggageDevState = function (game) {

}

luggageDevState.prototype = {

    preload: function () {
        console.log("Entered luggageDevState");

        let luggage = new Luggage(
            0,
            0,
            10,
            10);

        let luggage2 = new Luggage(
            1,
            1,
            50,
            10);

        let luggage3 = new Luggage(
            2,
            2,
            90,
            10);

        console.dir(luggage);
        console.dir(luggage2);
        console.dir(luggage3);
    }

}