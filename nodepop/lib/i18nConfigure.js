'use strict';

const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'), // __dirname es la carpeta actual, los .. es para subirlo de carpeta
  defaultLocale: 'en', // idioma por defecto
  autoReload: true, // watch for changes in JSON files to reload locale on updates - defaults to false
  syncFiles: true, // sync locale information across all files - defaults to false
  cookie: 'nodepop-locale'  // añadimos la cookie del idioma seleccionado por el usuario
});

// por si usamos i18n en scripts
i18n.setLocale('en');

module.exports = i18n;
