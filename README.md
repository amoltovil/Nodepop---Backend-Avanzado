# Documentación Práctica WEB-API/Node.js/MongoDB

## Introducción 

Bienvenido a la API Nodepop, esta API nos ayudará a extraer información de anuncios de artículos que están disponibles para su venta o para buscar, como por ejemplo: búsqueda de casa, trasteros, animales de compañia, etc.. La información de los anuncios es: nombre, precio, si el articulo se vende o se busca, la imagen del anuncio y la tipologia o tags a la que pertenece. Un mismo anuncio puede estar en varias tipologias o tags. 

La documentación explica como familiarizarse con los recursos disponibles y cómo consumirlos con solicitudes HTTP tanto desde la ruta de la/s APIs, como desde la ruta del propio website.

## Instalación del API 

### Dependencias instaladas

Primero, instalaremos la aplicación de Express (app Express) con el siguiente comando: 
~~~
npx express-generator --ejs nodepop
~~~
Una vez, instalada, desde la consola y/o terminal, nos situaremos dentro de la carpeta nodepop e instalaremos las dependencias con el siguiente comando:
~~~
npm install
~~~
En este punto, ya podremos ejecutar nuestra aplicación para probar que podemos acceder a la URL: http://localhost:3000 con el comando:
~~~
node ./bin/www
~~~
O bien:
~~~
npm run start ó npm start
~~~
Necesitaremos descargar MongoDB en local [URL Available Downloads Mongodb] (https://www.mongodb.com/try/download/community), según nuestra plataforma (Windows, Ubunto, macOS, Amazon Linux, etc..)

### Comando para arrancar MongoDB (mac/linux)

~~~
./bin/mongod --dbpath ./data/db
~~~

En Windows, el mongod se instala como demonio o servicio (MongoDB Server), comprobaremos que se esté ejecutando.

## Cliente de MongoDB (mac/linux/windows)

En la carpeta dónde se haya instalado MongoDB, tendremos que buscar el cliente de mongoDB (fichero mongo.exe) para ejecutarlo en nuestro proyecto en una nueva terminal.

![Imagen ejecutar cliente mongo](/nodepop/public/images/docum/clientemongo.png)

## Instalación de mongoose

A continuación, instalaremos una librería llamada mongoose que es una herramienta que nos permite interactuar con la base de datos de MongoDB, con el siguiente comando:
~~~ 
npm i mongoose
~~~

## Inicialización de la base de datos

Para inicializar nuestra colección de anuncios de nuestra base de datos, ejecutaremos el siguiente  comando:
~~~
npm run installDB
~~~
 
Este comando llama al script que elimina todos los documentos de nuestra colección, e inserta los documentos dado un fichero JSON (anuncios.json) que se encuentra dentro de la carpeta /lib/scripts.

![Imagen ejecución script](/nodepop/public/images/docum/script.png)

## Ejecución de la aplicación

Para comenzar a solicitar respuestas a nuestra API Nodepop, deberemos arrancar la aplicación:
~~~
npm run start
~~~

## API Methods

### GET /apiv1/anuncios 

Implementamos una primera versión del API Nodepop que nos devuelve en su respuesta un fichero JSON.
Obtiene la lista de todos los anuncios que se encuentran en nuestra base de datos en la colección de anuncios.

- #### Petición URL: http://localhost:3000/apiv1/anuncios

- #### Resultado:

Si no se ha insertado ningún anuncio nuevo, la respuesta a esta llamada nos devuelve el resultado del script de inicialización de la colección anuncios `/lib/scripts/anuncios.json`.
~~~
[
{
"tags": [
"lifestyle",
"motor"
],
"_id": "601fe467842fa20e151eab3f",
"nombre": "Bicicleta",
"venta": true,
"precio": 230.15,
"foto": "bicicleta.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"mobile"
],
"_id": "601fe467842fa20e151eab40",
"nombre": "iPhone 3GS",
"venta": false,
"precio": 50,
"foto": "movil.jpg",
"__v": 0
},
{
"tags": [
"work",
"lifestyle"
],
"_id": "601fe467842fa20e151eab41",
"nombre": "Agendas",
"venta": true,
"precio": 25,
"foto": "agenda.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"mobile"
],
"_id": "601fe467842fa20e151eab42",
"nombre": "Applewatch",
"venta": false,
"precio": 250,
"foto": "applewatch.jpg",
"__v": 0
},
{
"tags": [
"motor",
"lifestyle"
],
"_id": "601fe467842fa20e151eab43",
"nombre": "Bicicleta niña",
"venta": true,
"precio": 50,
"foto": "bici-peque.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"kitchen"
],
"_id": "601fe467842fa20e151eab44",
"nombre": "Bowl",
"venta": true,
"precio": 6.99,
"foto": "bowl.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab45",
"nombre": "Cachorros Labrador",
"venta": false,
"precio": 250,
"foto": "cachorros.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"kitchen"
],
"_id": "601fe467842fa20e151eab46",
"nombre": "Cafetera",
"venta": true,
"precio": 15.99,
"foto": "cafetera.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab47",
"nombre": "Casa",
"venta": false,
"precio": 100,
"foto": "casa.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"kitchen"
],
"_id": "601fe467842fa20e151eab48",
"nombre": "Olla de cocina",
"venta": true,
"precio": 24.99,
"foto": "cazuela.jpg",
"__v": 0
},
{
"tags": [
"motor",
"lifestyle"
],
"_id": "601fe467842fa20e151eab49",
"nombre": "Coche Renault antiguo",
"venta": true,
"precio": 5000,
"foto": "coche_renault.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work",
"motor"
],
"_id": "601fe467842fa20e151eab4a",
"nombre": "Coche Mercedes",
"venta": true,
"precio": 300000,
"foto": "cochelujo.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"fornitures"
],
"_id": "601fe467842fa20e151eab4b",
"nombre": "Espejo Vintage",
"venta": true,
"precio": 39.99,
"foto": "espejo.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab4c",
"nombre": "Figura decorativa",
"venta": true,
"precio": 12.99,
"foto": "figura_decoracion.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"animals"
],
"_id": "601fe467842fa20e151eab4d",
"nombre": "Gato",
"venta": false,
"precio": 100,
"foto": "gato.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab4e",
"nombre": "Robot de limpieza suelos",
"venta": true,
"precio": 500,
"foto": "irobot.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab4f",
"nombre": "Jersey",
"venta": true,
"precio": 10,
"foto": "jersey.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"animals"
],
"_id": "601fe467842fa20e151eab50",
"nombre": "Loro",
"venta": false,
"precio": 30,
"foto": "loro.jpg",
"__v": 0
},
{
"tags": [
"motor",
"lifestyle"
],
"_id": "601fe467842fa20e151eab51",
"nombre": "Moto",
"venta": true,
"precio": 1500,
"foto": "moto.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab52",
"nombre": "Ordenador",
"venta": true,
"precio": 349.99,
"foto": "ordenador.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab53",
"nombre": "Planta",
"venta": true,
"precio": 5.5,
"foto": "planta.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab54",
"nombre": "Plantas",
"venta": true,
"precio": 6.99,
"foto": "plantas.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab55",
"nombre": "Reloj Despertador",
"venta": true,
"precio": 15.99,
"foto": "reloj_despertador.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab56",
"nombre": "Reloj Mujer",
"venta": true,
"precio": 29.99,
"foto": "reloj_mujer.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"fornitures"
],
"_id": "601fe467842fa20e151eab57",
"nombre": "Silla Vintage",
"venta": true,
"precio": 5.99,
"foto": "silla_vieja.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"fornitures"
],
"_id": "601fe467842fa20e151eab58",
"nombre": "Sofa",
"venta": true,
"precio": 500,
"foto": "sofa.jpg",
"__v": 0
},
{
"tags": [
"mobile",
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab59",
"nombre": "Tablet Android",
"venta": true,
"precio": 250,
"foto": "tablet.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work",
"fornitures"
],
"_id": "601fe467842fa20e151eab5a",
"nombre": "Taburete",
"venta": false,
"precio": 49.99,
"foto": "taburete.jpg",
"__v": 0
},
{
"tags": [
"kitchen",
"lifestyle"
],
"_id": "601fe467842fa20e151eab5b",
"nombre": "Juego de tazas",
"venta": true,
"precio": 30,
"foto": "taza.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab5c",
"nombre": "Trastero de alquiler",
"venta": false,
"precio": 60,
"foto": "trastero.jpg",
"__v": 0
},
{
"tags": [
"kitchen",
"lifestyle"
],
"_id": "601fe467842fa20e151eab5d",
"nombre": "Utensilios de madera",
"venta": true,
"precio": 20,
"foto": "utensilios_madera.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "601fe467842fa20e151eab5e",
"nombre": "Zapatillas",
"venta": true,
"precio": 30,
"foto": "zapatillas.jpg",
"__v": 0
},
{
"tags": [
"work",
"lifestyle"
],
"_id": "601fe467842fa20e151eab5f",
"nombre": "Limpiadora",
"venta": false,
"precio": 10,
"foto": "limpieza.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab60",
"nombre": "Cuidador de personas mayores",
"venta": false,
"precio": 15.99,
"foto": "cuidador.jpg",
"__v": 0
}
]
~~~

### GET /api/anuncios 

Implementamos en el API Nodepop una función que nos devuelve en un fichero en formato JSON todos los anuncios definidos en la colección anuncios.

- #### Petición URL: http://localhost:3000/api/anuncios

- #### Resultado

Un fichero JSON que contendrá todos los anuncios definidos en la colección anuncios de la base de datos. 

### GET /api/anuncios con filtros y GET /apiv1/anuncios con filtros

Para abreviar explicamos a continuación los distintos tipos de filtros que podemos aplicar tanto en la ruta /api/anuncios como en /apiv1/anuncios

- Ejemplos:
    1. Lista de anuncios con páginación: 
    2. Lista de anuncios con filtro por tags:
    3. Lista de anuncios por tipo de anuncio (Venta ó Búsqueda):
    4. Lista de anuncios por rango de precios:
    5. Lista de anuncios cuyo nombre empiece por una palabra:
    6. Lista de anuncios ordenada por precio y nombre:
    7. Lista de anuncios con varios filtros:

#### Resultado 

Un fichero JSON que contendrá los anuncios que cumplan los filtros que hayamos establecido en la llamada http.

### GET /api/anuncios/:id

Obtiene el anuncio dado un id en concreto. En el caso de no encontrarlo, devolverá un status 404.

#### Petición URL (_id anuncio existente): http://localhost:3000/api/anuncios/601fe467842fa20e151eab52

#### Resultado

Un fichero JSON con el anuncio solicitado.
~~~
{
"result": {
"tags": [
"lifestyle",
"work"
],
"_id": "601fe467842fa20e151eab52",
"nombre": "Ordenador",
"venta": true,
"precio": 349.99,
"foto": "ordenador.jpg",
"__v": 0
}
}
~~~

#### Petición URL (_id anuncio NO existente): http://localhost:3000/api/anuncios/601fe467842fa20e151eab78

#### Resultado

~~~
{
"error": "not found"
}
~~~

### GET /api/tags

Obtiene la lista de los distintos tags o tipologias creados dentro de la colección de anuncios

- #### Petición URL: http://localhost:3000/api/tags

- #### Resultado:

El resultado de la api es un fichero JSON, siempre que no se hayan insertado más tags a la colección.
~~~
[
"animals",
"fornitures",
"kitchen",
"lifestyle",
"mobile",
"motor",
"work"
]
~~~

### POST /api/anuncios

Creará un nuevo anuncio en la colección de anuncios. Además, insertará un campo más en la colección de anuncios con la fecha de creación del anuncio.

Para probarlo vamos a la aplicación POSTMAN, creamos una nueva pestaña, seleccionamos el método POST
y añadimos la url: http://localhost:3000/api/anuncios
Seleccionamos el selector dónde le vamos a pasar la información, en este caso, en el body y el formato de la información: x-www-form-urlencoded. Rellenamos los campos en el key de cada campo de nuestro esquema anuncio e insertamos en el value de cada campo el valor que queramos crear. 
Y a continuación, pulsamos el botón SEND en la aplicación de Postman. Postman nos da la respuesta con un status 201 tal como hemos establecido en nuestra api, con lo que se ha creado el nuevo anuncio en la base de datos correctamente. 
Además, Postman nos muestra el JSON resultado del anuncio creado tal como hemos puesto en nuestra api
Adjunto Imagen.

![Imagen de creación de anuncio desde POSTMAN](/nodepop/public/images/docum/newanuncio.png)

En la consola/terminal de node se muestra el siguiente mensaje:
POST /api/anuncios 201 29.767 ms - 175

- #### Resultado:

~~~
{
    "result": {
        "tags": [
            "lifestyle"
        ],
        "_id": "601ff2ac30a2ad4018c02b11",
        "nombre": "pelota",
        "venta": true,
        "precio": 2,
        "foto": "pelota.jpg",
        "__v": 0,
        "createdAt": "2021-02-07T14:01:16.310Z"
    }
}
~~~

### PUT /api/anuncios/:id 

Actualiza un anuncio dado un id concreto.

Para probarlo vamos a la aplicación POSTMAN, creamos una nueva pestaña, seleccionamos el método PUT
y añadimos la url: http://localhost:3000/api/anuncios 

Seleccionamos en el selector dónde le vamos a pasar la información, en este caso, en el body y el formato de la información: x-www-form-urlencoded.

Para realizar la prueba, vamos a modificar el precio del anuncio que insertamos anteriormente. Para ello
le añadimos a la URL el id de anuncio que queremos modificar: http://localhost:3000/api/anuncios/601ff2ac30a2ad4018c02b11

Pulsamos el botón SEND y como resultado obtenemos el fichero JSON con el documento actualizado.
Devuelve el JSON actualizado porque en nuestro código le hemos incluido en la llamada la opción {new: true}. 

  `const anuncioActualizado = await Anuncio.findOneAndUpdate({_id:_id}, anuncioData, {
            new: true, 
            useFindAndModify: false
        });`

En la consola de node nos muestra lo siguiente:
PUT /api/anuncios/601ff2ac30a2ad4018c02b11 200 6.649 ms - 178

![Imagen de actualización de anuncio desde POSTMAN](/nodepop/public/images/docum/updateanuncio.png)

~~~
{
    "result": {
        "tags": [
            "lifestyle"
        ],
        "_id": "601ff2ac30a2ad4018c02b11",
        "nombre": "pelota",
        "venta": true,
        "precio": 3.99,
        "foto": "pelota.jpg",
        "__v": 0,
        "createdAt": "2021-02-07T14:01:16.310Z"
    }
}
~~~

### DELETE /api/anuncio/:id

Borra un determinado anuncio por id. La llamada a la api devolverá el status 200 si ha funcionado correctamente.

En la aplicación de Postman, seleccionaremos el método DELETE con la url del anuncio creado y modificado anteriormente: http://localhost:3000/api/anuncios/601ff2ac30a2ad4018c02b11 y pulsamos SEND.

En este caso no rellenamos ningún dato en postman y nos devuelve el status 200.
En la consola de node vemos la siguiente entrada:
DELETE /api/anuncios/601ff2ac30a2ad4018c02b11 200 3.698 ms - -

![Imagen de delete anuncio desde POSTMAN](/nodepop/public/images/docum/deleteanuncio.png)

##### Imágenes del proyecto

Las imágenes usadas en el proyecto son de las siguientes webs gratuitas:
- [Pexels.com] (https://www.pexels.com) 
- [istockphoto.com] (https://www.istockphoto.com) 