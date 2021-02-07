# Documentación Práctica WEB-API/Node.js/MongoDB

## Dependencias instaladas

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

## Comando para arrancar MongoDB (mac/linux)

~~~
./bin/mongod --dbpath ./data/db
~~~

En Windows, el mongod se instala como demonio o servicio (MongoDB Server), comprobaremos que se esté ejecutando.

## Cliente de MongoDB (mac/linux/windows)

En la carpeta dónde se haya instalado MongoDB, tendremos que buscar el cliente de mongoDB (fichero mongo.exe) para ejecutarlo en nuestro proyecto en una nueva terminal.

![Imagen ejecutar cliente mongo](E:\Curso web Keep Coding\04. Desarrollo de Backend\Recortes Documentación Práctica\clientemongo.png)

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

## API Methods

### GET /apiv1/anuncios 

Obtiene una lista de anuncios sin nigún filtro. La URL: http://localhost:3000/apiv1/anuncios muestra la lista de todos los anuncios existentes en la coleccion anuncios.


### GET /api/anuncios

Get a list of anuncios

Petición o URL: http://localhost:3000/api/anuncios

JSON devuelto (anuncios.json):
~~~
[
{
"tags": [
"lifestyle",
"motor"
],
"_id": "601d6b159613f1ebfc2e7447",
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
"_id": "601d6b159613f1ebfc2e7448",
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
"_id": "601d6b159613f1ebfc2e7449",
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
"_id": "601d6b159613f1ebfc2e744a",
"nombre": "Applewatch",
"venta": false,
"precio": 250,
"foto": "applewatch.jpg",
"__v": 0
}
]
~~~

### GET /api/anuncios/:id

### GET /api/tags

Obtiene la lista de los distintos tags creados dentro de la colección de anuncios
La llamada a la api se lanza con la siguiente petición URL: http://localhost:3000/api/tags

El resultado de la api es un fichero JSON:
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

Crea un nuevo anuncio.

Para probarlo vamos a la aplicación POSTMAN, creamos una nueva pestaña, seleccionamos el método POST
y añadimos la url: http://localhost:3000/api/anuncios.

Seleccionamos en el selector dónde le vamos a pasar la información, en este caso, en el body y el formato de la información: x-www-form-urlencoded. Rellenamos los campos en el key de cada campo de nuestro esquema anuncio y en el value el valor que queramos crear.
Key             Value
nombre          Pelota
venta           true
precio          2
foto            pelota.jpg
tags            lifestyle

Y a continuación, pulsamos el botón SEND en la aplicación de Postman, se ha creado el nuevo anuncio en la base de datos con el status 201, tal como hemos establecido en nuestra api.

Además, postman nos muestra el JSON resultado del anuncio creado tal como hemos puesto en nuestra api: 

{
    "result": {
        "tags": [
            "lifestyle"
        ],
        "_id": "601d75ce8a22ccdf688603f3",
        "nombre": "Pelota",
        "venta": true,
        "precio": 2,
        "foto": "pelota.jpg",
        "__v": 0
    }
}

En la consola/terminal de node se muestra el siguiente mensaje:
POST /api/anuncios 201 46.984 ms - 136

### PUT /api/anuncios/:id 

Actualiza un anuncio dado un id concreto.

Para probarlo vamos a la aplicación POSTMAN, creamos una nueva pestaña, seleccionamos el método PUT
y añadimos la url: http://localhost:3000/api/anuncios 

Seleccionamos en el selector dónde le vamos a pasar la información, en este caso, en el body y el formato de la información: x-www-form-urlencoded.

Para probar, vamos a modificar el precio del anuncio que insertamos anteriormente.

Pulsamos el botón SEND y como resultado obtenemos el json con el documento actualizado.
  const anuncioActualizado = await Anuncio.findOneAndUpdate({_id:_id}, anuncioData, {
            new: true, 
            useFindAndModify: false
        });
 
Devuelve el JSON actualizado gracias a que hemos incluido en la llamada la opción {new: true} 
{
    "result": {
        "tags": [
            "lifestyle"
        ],
        "_id": "601d75ce8a22ccdf688603f3",
        "nombre": "pelota",
        "venta": true,
        "precio": 3,
        "foto": "pelota.jpg",
        "__v": 0
    }
}

En la consola de node nos muestra lo siguiente:
PUT /api/anuncios/601d75ce8a22ccdf688603f3?precio=3 200 29.405 ms - 136

### DELETE /api/anuncio/:id

Borra un determinado anuncio por id.
Devolverá el status 200 si ha funcionado correctamente.

En la aplicación de Postman, seleccionaremos el método DELETE con la url del anuncio creado y modificado anteriormente: http://localhost:3000/api/anuncios/601d75ce8a22ccdf688603f3 y pulsamos SEND.

En este caso no rellenamos ningún dato en postman y nos devuelve el status 200.
En la consola de node vemos la siguiente entrada:
DELETE /api/anuncios/601d75ce8a22ccdf688603f3 200 4.957 ms - -

##### Imágenes del proyecto

Las imágenes usadas en el proyecto son de las siguientes webs gratuitas:
- [https://www.pexels.com] (https://www.pexels.com) 
- [https://www.istockphoto.com] (https://www.istockphoto.com) 