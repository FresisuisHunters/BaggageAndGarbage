var localizationManager = {}

const Languages = {
    English: "en",
    Spanish: "es"
}

function getString(key) {
    let value = localizationManager[key];
    if (value == null) {
        console.error("La clave " + key + " no exist en LocalizationManager.");
        return "[ERROR]" + key;
    }

    let string = value[localizationManager.currentLanguage];
    if (string == null) {
        console.error("ERROR: " + localizationManager.currentLanguage + " translation for " + key + " is missing.");
        return "[ERROR]" + key;
    }

    return string;
}


//STRINGS//
///////////
localizationManager["TEST_STRING"] = {
    en: "This is a test.",
    es: "Esto es una prueba."
}