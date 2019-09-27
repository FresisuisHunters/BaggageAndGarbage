"use strict";
var bagDevState = function (game) {

}

bagDevState.prototype = {

    preload: function () {
        console.log("Entered bagDevState");

        let bag = new Bag(
            0,
            0,
            10,
            10);

        let bag2 = new Bag(
            1,
            1,
            50,
            10);

        let bag3 = new Bag(
            2,
            2,
            90,
            10);

        console.dir(bag);
        console.dir(bag2);
        console.dir(bag3);
    }

}