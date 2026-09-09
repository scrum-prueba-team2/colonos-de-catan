# Manejo de aristas
Para manejar las **Aristas** creé su respectivo esquema, al igual que este mismo esquema dentro de **Tablero**, para agregar todas las aristas al tablero.  Usé el sistema de coordenadas (h, d, p), para identificarlos. Donde **p** va de 0 a 2 en valor númerico.

También creé en **backend/src/common/tablero** que es donde se guardó el arreglo para guardar las coordenadas de cada hexágonos.

Creé **backend/src/generators/generarAristas** que es el encargado de orquestar toda la creación de aristas y enviarlos al MapSchema de hexágonos dentro del Tablero.