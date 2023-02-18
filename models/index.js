/*******************************************************************************
 * Models loader
 * Create new models into models/ and they will be loaded automatically
 ******************************************************************************/

 'use strict';
 const fs = require('fs');
 
 fs.readdirSync(__dirname).forEach((file) => {
     if (/(.*)\.(js$|coffee$)/.test(file)) {
         require(__dirname + '/' + file);
     }
 });