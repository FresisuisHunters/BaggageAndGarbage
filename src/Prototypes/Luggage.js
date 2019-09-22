const LuggageType = {
    Safe = {
        Id = "Safe",
        Texture = ["SafeLuggageTexture_1", "SafeLuggageTexture_2"]
    },
    Suspicious = {
        Id = "Suspicious",
        Texture = ["SuspiciosLuggageTexture_1", "SuspiciosLuggageTexture_2"]
    },
    Dangerous = {
        Id = "Dangerous",
        Texture = ["DangerousLuggageTexture_1", "DangerousLuggageTexture_2"]
    }
};

const LuggageDestinies = {
    FirstDestiny = "FirstDestiny",
    SecondDestiny = "SecondDestiny",
    ThirdDestiny = "ThirdDestiny"
};

const LuggageDestinyTextures = {
    FirstDestiny = "FirstDestinyLuggageTexture",
    SecondDestiny = "SecondDestinyLuggageTexture",
    ThirdDestiny = "ThirdDestinyLuggageTexture"
};

class Luggage {

    constructor(destiny, luggageType, x, y) {
        this.intendedDestiny = destiny;

        let spriteTexture = LuggageDestinyTextures[destiny];
        this.sprite = new Sprite(game, x, y, spriteTexture);

        let contentSpriteTexture = LuggageType[luggageType].Texture;
        this.contentSprite = new Sprite(game, x, y, contentSpriteTexture);
    }

    move() {
        
    }

    onDestinyMet() {
        this.contentSprite.destroy();
    }
}

