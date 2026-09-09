# Manejo de Vertices

## Esquema y Manejo
Se agregó en **/backend/src/enum.ts** la estructura para asignar un identificador a cada una de las estructuras del juego.

Se creó **/backend/src/schemas/Vertices.ts** La estructura para la asignacion de las coordenadas de los vertices y las coordenadas para la construcción de las estructuras.

Se creó **/backend/src/generators/generarVertices.ts** se crean los vertices y se le asigna las coordenadas de cada uno de los vertices a una variable para guardarlos en el Esquema de Maás den el tablero.

Se agregó en **/backend/src/schemas/Tablero.ts** un Mapa de Esquemas, que crea un json con los las direcciones de los vertices.

Se agregó en el constructor de  **/backend/src/states/CatanState.ts** el constructor de generarVertices