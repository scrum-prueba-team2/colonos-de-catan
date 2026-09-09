# Generación de Puertos

Se definieron los id de los tipos de puerto en **/backend/src/common/enum.ts** para poder llamarlos
#
En **/backend/src/common/tablero.ts** se crearon las cordenadas donde los vertices se conectaran a cada puerto, basicamente dos vertices por puerto
#
Se creo el typescript **Puero.ts** en **/backen/src/schema/** en donde basicamente se van creando los objetos, o sea, los puertos.
#
Se agregó el Schema de puertos en **/backend/src/schema/Tablero.ts**
#
Se creo ***/backend/src/generators/generarPuertos.ts** la lógica que llama que asigna y distribuye los puertos.
#
Se agrego en **/backend/src/states/CatanState.ts** la llamada a generarPuertos.
