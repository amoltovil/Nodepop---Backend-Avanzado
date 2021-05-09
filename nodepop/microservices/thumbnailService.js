'use strict';

// Servicio de creación de thumbnails
const cote = require('cote');
const path = require('path');
const jimp = require('jimp');

async function changeSize(file, path_file, path_destination) {

    // Read the image.
    const image = await jimp.read(path_file);
    // Resize the image to width 100 and heigth AUTO
    await image.resize(100, jimp.AUTO);
    //await image.scaleToFit(100, 100);
   
    // Save and overwrite the image
    const name_file = path.basename(file, path.extname(file));
    await image.writeAsync(`${path_destination}/${name_file}_thumbnail${path.extname(file)}`);
  }
  
// declaro el microservicio
const responder = new cote.Responder({ name: 'Service Create Thumbnail Images' });

// lógica del microservicio
responder.on('do thumbnail image', (req, done) => {
    
    var f = new Date();

    console.log(`Inicio en Fecha: ${f.getFullYear()}-${f.getMonth()}-${f.getDate()} - Hora:${Date.now()} - Imagen a tratar por el servicio:`, req.imagen);
    
    const resultado = changeSize(req.imagen, path.join(req.ruta_imagen, req.imagen), req.ruta_destino);
    
    console.log(`Finalizado en Fecha: ${f.getFullYear()}-${f.getMonth()}-${f.getDate()} - Hora:${Date.now()} - Imagen tratada por el servicio:`, req.imagen);
   
    done(resultado);
});


