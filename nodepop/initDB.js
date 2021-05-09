'use strict';

require('dotenv').config();  // para cargar las variables de entorno

const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Usuario, Anuncio } = require('./models');
const anunciosData = require('./anuncios.json');

main().catch(err => console.error('Error:', err));

async function main() {

  // Si buscamos en la doc de mongoose (https://mongoosejs.com/docs/connections.html),
  // vemos que mongoose.connect devuelve una promesa que podemos exportar en connectMongoose
  
  await connectMongoose;
  
  const answer = await askUser('¿Confirma que desea vaciar las colecciones de la BD? (yes or no) ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB install aborted! nothing has been done');
    return process.exit(0);
  }     

  // Inicializo colección de usuarios
  await initUsuarios();

  // Inicializo colección de anuncios
  await initAnunciosDb().catch(err=>{
    console.log('Error en initDB de anuncios a la base de datos: ', err);
  });

  mongoose.connection.close(); // cierra la conexión con la base de datos
  console.log('\nFinalizado.');
}

async function initUsuarios() {
  // 1º Borra todos los usuarios 
  const { deletedCount } = await Usuario.deleteMany(); // si le pusieramos como párametro un objecto, borraria solo los del filtro
  
  console.log(`\nEliminado${deletedCount > 1 ? 's' : ''} ${deletedCount} usuario${deletedCount > 1 ? 's' : ''}.`);

  // 2º Insertamos un par de usuarios
  const result = await Usuario.insertMany([
    {
      email: 'user@example.com',
      password: await Usuario.hashPassword('1234')
    },
    { // creamos un segundo usuario para probar el envio del email
      email: 'amoltovil@gmail.com',
      password: await Usuario.hashPassword('4321')
    }
  ]);

  console.log(`\nInsertado${result.length > 1 ? 's' : ''} ${result.length} usuario${result.length > 1 ? 's' : ''}.`)
}

async function initAnunciosDb(){
  const options = { ordered: true };
  if (Anuncio) {
      
      const promesa = Anuncio.deleteMany({});  
      try {
        //const result = await promesa;
        const { deletedCount } = await promesa;
          // `0` if no docs matched the filter, number of docs deleted otherwise
        console.log(`\nEliminado${deletedCount > 1 ? 's' : ''} ${deletedCount} anuncio${deletedCount > 1 ? 's' : ''}.`);
      }
      catch (err) {
        console.log('\nError al borrar la colección anuncios: ', err);
      }
    
      const promesa2 = Anuncio.insertMany(anunciosData, options);
      try{
        const result2 = await promesa2;
        console.log(`\nInsertado${result2.length > 1 ? 's' : ''} ${result2.length} anuncio${result2.length > 1 ? 's' : ''}.`)
        //    Anuncio.countDocuments({}, function(err, num_anuncios) {
        //       console.log(`\nInserted: ${num_anuncios} document${num_anuncios > 1 ? 's': ''} in collection anuncios`);
        //  });
           
      } catch(err) {
          console.log('Error de inserción masiva en la colección anuncios', err);
      }    
  } 
}


