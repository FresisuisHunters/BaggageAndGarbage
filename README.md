![Baggage & Garbage](https://github.com/FresisuisHunters/BaggageAndGarbage/blob/master/resources/sprites/img_Logo.png) 

# Índice
- [Concepto general](#concepto-general)
- [Mecánicas](#mecánicas)
  * [Maletas](#maletas)
  * [Caminos](#caminos)
  * [Escáneres](#escáneres)
  * [Estructura de un nivel](#estructura-de-un-nivel)
  * [Puntuación](#puntuación)

# Concepto general
Vienen oleadas de maletas al aeropuerto. Algunas seguras, otras no tanto. Tu trabajo es llevar las maletas a la cinta mecánica correcta en función de su seguridad. Para ello, creas pequeñas cintas llamadas *caminos* que conectan los *carriles* principales.
El juego dispone de tres niveles de dificultad, y está arquitecturado de forma que hace muy fácil añadir más.

![alt text](https://github.com/FresisuisHunters/BaggageAndGarbage/blob/master/Concept%20Art/UI/mockup_gameplay.png?raw=true)

# Mecánicas
## Maletas
### Tipos 
- Tipo A: Siempre es válida.
- Tipo B: Sospechosa, hace falta el escáner para estar seguro (pero el jugador puede arriesgarse si lo desea).
- Tipo C: Obviamente peligrosa.

### Apariencia de los tipos
- Tipo A: Tienen una etiqueta con un ✅ claramente visible. Por lo general, son de colores vivos.
- Tipo B: No tienen etiqueta, y tienden a colores más apagados. De diseño tienden a una pinta más sospechosa.
- Tipo C: Muy exageradas. En algunos casos ni siquiera son maletas, como por ejemplo el RPG en envoltorio de regalo.

### Comportamiento
Una maleta empieza al principio de cualquiera de los carriles. El sistema de oleadas se encarga de crearlas y colocarlas.
Normalmente, va bajando por su carril a una velocidad constante.

Sigue su carril a no ser que se encuentre un camino creado por el jugador. Cuando la maleta llega al principio de un camino (si al final son bidireccionales cualquiera de las puntas, si no solo si es el principio), deja su carril y va por este camino. 

Sigue el camino a la misma velocidad constante que al bajar por el carril. Al alcanzar la otra punta del camino, vuelve empieza a bajar por el nuevo carril desde este punto.

Cuando llega al final de un carril (en la parte de abajo de la pantalla) se destruye la maleta. Se lleva cuenta de las maletas que se han puesto en el carril acertado, y de las que se han puesto en el carril equivocado.

Las maletas intentan mantener una distancia mínima entre ellas, con un sistema de prioridades en función de su posición.

## Caminos
Los caminos son las líneas que el jugador crea. Empiezan en un carril, y terminan en otro adyacente. Pueden ir en horizontal o diagonal, hacia o abajo, siempre y cuando vaya de un carril a otro.
Para crear un camino el jugador hace click en/toca un carril, y suelta encima de otro. Se crea un camino recto entre un punto y otro.

### Restricciones
- Sólo se pueden crear entre carriles adyacentes
- No se puede crear un camino que cruce uno preexistente.
- Un camino no puede entrar a (o salir de) un escáner.
- Debe haber una distancia mínima entre dos caminos

## Escáneres
Un escáner es un objeto que está encima de un carril, en un punto determinado. 

### Comportamiento con maletas
Cuando una maleta de tipo B pasa por dentro de un escáner, se muestra su interior en la pantalla de escáner. Los objetos no permitidos que contenga (si los hay) tendrán un color llamativo.

En el caso de las maletas de tipo A y C, se muestra la maleta junto a un indicador que comunica claramente si la maleta es aceptable o no, y que no hacía falta escanearla.

### Múltiples escáneres
En algunos niveles, hay múltiples escáneres. La pantalla de escáner sólo muestra un escáner el escáner activo. Para cambiar qué escáner está activo, el jugador hace click sobre/toca el escáner que desee activar.

## Estructura de un nivel
Un nivel tiene X número de oleadas.

Una oleada tiene un número definido de maletas tipo A, B y C (cada oleada tiene números diferentes).
También se especifica cuántas de las maletas B son peligrosas.

Al principio de una oleada, se borran todos los caminos que el jugador ha dibujado en la anterior.
Se ordenan las maletas a crear de forma aleatoria. Una a una, van apareciendo cada una en un carril aleatorio, con una pausa corta entre cada maleta. También hay una espera mínima antes de repetir carril.

Una vez han aparecido todas las maletas de la oleada, no aparecen más maletas hasta que todas las de la oleada llegan abajo.
Cuando todas llegan abajo, empieza la siguiente oleada tras una breve pausa para dar un respiro al jugador. Este proceso se repite hasta que pasen todas las oleadas del nivel.

## Puntuación
Al final del nivel se da una puntuación de entre 0 y 3 estrellas.
El número de estrellas dependerá de la cantidad de maletas que hayan acabado en el sitio equivocado.
Los requisitos exactos para cada número de estrellas se define por cada nivel, así que esta es una aproximación.
- **3 estrellas:** Perfecto, 0 fallos.
- **2 estrellas:** Pocos fallos.
- **1 estrella:** Unos cuantos fallos.
- **0 estrellas:** Muchos fallos.

Si se consiguen 1 o más estrellas, se desbloquea el siguiente nivel (el cual será más difícil que el anterior).

# Diagrama de Flujo
![alt text](https://github.com/FresisuisHunters/BaggageAndGarbage/blob/master/FinalArt/Flowchart.png)
