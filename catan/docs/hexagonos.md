# Manejo de hexágonos
Para manejar los **Hexágonos** creé su respectivo esquema, al igual que el esquema de **Tablero**, para agregar todos los hexágonos al tablero.  Usé el sistema de coordenadas (h, d), para identificarlos.

Creé **backend/src/common/enums** que es donde estarán algunos valores que se usaran por toda la aplicación, de momento agregué los valores de los terrenos.

También creé en **backend/src/common/tablero** que es donde se guardó el arreglo para guardar las coordenadas de cada hexágonos.

En **backend/src/functions/mezclar** incluí la función encargada de mezclar el orden de los números dentro de cada hexágono.

También creé **backend/src/generators/generarHexagonos** que es el encargado de orquestar toda la creación de hexágonos y una vez desornados, enviarlos al MapSchema de hexágonos dentro del Tablero.

