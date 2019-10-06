# Baggage & Garbage
![alt text](https://github.com/FresisuisHunters/BaggageAndGarbage/blob/master/Concept%20Art/Logos/logo%20juego.png?raw=true) 
## Concepto general
Vienen oleadas de maletas al aeropuerto. Algunas seguras, otras no tanto. Tu trabajo es llevar las maletas a la cinta mecánica correcta en función de su seguridad. Para ello, creas pequeñas cintas llamadas *caminos* que conectan los *carriles* principales.

(Falta subir el mockup de Carmen para mostrarlo aquí)

# Maletas
## Tipos 
- Tipo A: Siempre es válida.
- Tipo B: Sospechosa, hace falta el escáner para estar seguro (pero te la puedes jugar si quieres).
- Tipo C: Obviamente peligrosa.

## Apariencia de los tipos
- Tipo A: Tienen una etiqueta de estas de aeropuerto, con un ✅ claramente visible. Por lo general, son de colores vivos.
- Tipo B: No tienen etiqueta, y tienden a colores más apagados. De diseño tienden a una pinta más sospechosa/chunga (como la guitarra con pegatinas metaleras de Elena).
- Tipo C: Super bastas. En algunos casos ni siquiera son maletas, como el RPG con lacito.

## Comportamiento
Una maleta empieza al principio de cualquiera de los carriles. El sistema de oleadas se encarga de crearlas y colocarlas.
Normalmente, va bajando por su carril a una velocidad constante.

Sigue su carril a no ser que se encuentre un camino creado por el jugador. Cuando la maleta llega al principio de un camino (si al final son bidireccionales cualquiera de las puntas, si no solo si es el principio), deja su carril y va por este camino. 

Sigue el camino a la misma velocidad constante que al bajar por el carril. Al alcanzar la otra punta del camino, vuelve empieza a bajar por el nuevo carril desde este punto.

Cuando llega al final de un carril (en la parte de abajo de la pantalla) desaparece la maleta. Se lleva cuenta de cuántas maletas se han puesto en el carril equivocado.

# Caminos
Los caminos son las líneas que el jugador crea. Empiezan en un carril, y terminan en otro. Pueden ir en horizontal o diagonal, hacia o abajo, siempre y cuando vaya de un carril a otro.
Para crear un camino haces click en/tocas un carril, y sueltas encima de otro. Se crea un camino recto entre un punto y otro.

## Restricciones
- Sólo se pueden crear entre carriles adyacentes
- No se puede crear un camino que cruce uno preexistente.
- Un camino no puede entrar a (o salir de) un escáner.

# Estructura de un nivel
Un nivel tiene X número de oleadas.

Una oleada tiene un número definido de maletas ( %2) tipo A, B y C (cada oleada tiene números diferentes).
También se especifica (igual mejor que sea completamente aleatorio? habrá que probar) cuántas de las maletas B son peligrosas.

Al principio de una oleada, se borran todos los caminos ( %4) que el jugador ha dibujado en la anterior.
Se ordenan las maletas a crear de forma aleatoria. Una a una, van apareciendo cada una en un carril aleatorio, con una pausa corta entre cada maleta (0.5 segundos o por ahí). Posiblemente también haya que poner una espera mínima antes de repetir carril.

Una vez han aparecido todas las maletas de la oleada, no aparecen más maletas hasta que todas las de la oleada llegan abajo.
Cuando todas llegan abajo, empieza la siguiente oleada. Así hasta que pasen todas las oleadas del nivel.

## Puntuación
Al final del nivel se da una puntuación de entre 0 y 3 estrellas.
El número de estrellas dependerá de la cantidad de maletas que hayan acabado en el sitio equivocado.
- **3 estrellas:** Perfecto, 0 fallos.
- **2 estrellas:** Pocos fallos.
- **1 estrella:** Unos cuantos fallos.
- **0 estrellas:** Muchos fallos.

Si se consiguen 1 o más estrellas, se desbloquea el siguiente nivel (que sería un nivel con oleadas más difíciles).
