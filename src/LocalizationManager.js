var localizationManager = {}

const Languages = {
    English: "en",
    Spanish: "es"
}

function getString(key) {
    let value = localizationManager[key];
    if (value == null) {
        console.error("La clave " + key + " no existe en LocalizationManager.");
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
localizationManager["PLAY"] = {
    en: "PLAY",
    es: "JUGAR"
}
localizationManager["CREDITS"] = {
    en: "CREDITS",
    es: "CRÉDITOS"
}
localizationManager["DESTINATIONS"] = {
    en:"Departures",
    es:"Salidas"
}
localizationManager["EMBARK"] = {
    en:"EMBARK",
    es:"EMBARCAR"
}
localizationManager["NEW_WAVE_TEXT"] = {
    en: "Next wave: \nIncoming",
    es: "Siguiente oleada: \nInminente"
}

//Tutorial text
localizationManager["TUTORIAL_PAGE_1"] = {
    en: "Your goal is to separate the baggage that arrives into approval and rejection lanes.\n\n\
Dangerous objets, food and smuggled goods are forbiddden. When there is no obvious infraction, scan before deciding.\n\n\
Some bags have alreay been approved, and are labeled as such.\n\n\
Do your job perfectly to get all three stars.",
    es: "Tu objetivo es separar el equipaje que llega en carriles de aprobación y rechazo.\n\n\
No se permiten objetos peligrosos, contrabando ni comida. Cuando la infracción no sea evidente, escanea antes de decidir.\n\n\
Algunas maletas ya han sido revisadas, y llevan una etiqueta que lo demuestra.\n\n\
Haz tu trabajo a la perfección para conseguir las tres estrellas."
}

localizationManager["TUTORIAL_PAGE_2"] = {
    en:"Some conveyor belts are for the baggage you approve, and others for the garbage you don't.\n\n\
You can create more belts to move stuff around. \n\nCreate them by drawing a line from one lane to another. They must be adyacent.",
    es:"Algunas cintas transportadoras son para el equipaje que apruebes, y otras para lo que rechaces.\n\n\
Puedes crear más cintas para mover el equipaje. \n\nPara crearlas, dibuja una línea de un carril a otro adyacente."
}

localizationManager["TUTORIAL_PAGE_3"] = {
    en:"To scan something, have it move through a scanner. \n\nYou will see its contents on the scanner screen.",
    es:"Para escanear algo, pásalo por un escáner. \n\nVerás el contenido en la pantalla de escáner."
}

localizationManager["TUTORIAL_PAGE_4"] = {
    en:"The scanner screen can only show one scanner at a time. \n\nWhen there are several, touch a scanner to see it on screen.",
    es:"La pantalla de escáner sólo muestra un escáner. \n\nCuando haya varios, toca un escáner para verlo en la pantalla."
}

localizationManager["TUTORIAL_PAGE_5"] = {
    en:"You can use this button to accelerate the conveyor belts. \n\n\Useful to avoid unnecessary waiting on problems that have already been solved.",
    es:"Puedes utilizar este botón para acelerar las cintas. \n\nÚtil para evitar esperas innecesarias en un problema ya resuelto."
}

