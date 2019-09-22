class Wave {

    constructor(id, luggage) {
        this.waveId = id;
        this.luggage = sortRandomly(luggage);
    }

    getLuggageLeft() {
        return this.luggage.length;
    }

    getNextLuggage() {
        return this.luggage.pop();
    }

}

function sortRandomly(luggage) {
    return [];
}