"use strict"
const LaneEndTypes = {
    Safe: 0,
    Dangerous: 1
};

function LaneEnd(type, onBagKilled, bagList) {
    this.type = type;
    this.onBagKilled = onBagKilled,
    this.bags = bagList;
}

LaneEnd.prototype = {
    manageBag: function(bag) {
        let isCorrect = undefined;

        switch (bag.type) {
            case BagTypes.A:
            case BagTypes.B_Safe:
                isCorrect = this.type == LaneEndTypes.Safe;
                break;
            case BagTypes.B_Danger:
            case BagTypes.C:
                isCorrect = this.type == LaneEndTypes.Dangerous;
                break;
            default:
                console.error("A bag has type " + bag.type + ". That value doesn't make sense.");
        }

        let bagIndex = null;
        for (let i = 0; i < this.bags.length; i++) {
            if (this.bags[i] == bag) bagIndex = i;
        }
        if (bagIndex == null) console.error("A LaneEnd tried to kill a bag that isn't in the bags list.");
        this.bags.splice(bagIndex, 1);
        
        this.onBagKilled(isCorrect);
    },
}