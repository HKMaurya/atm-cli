'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const db = require("../utils/config").db;
mongoose.set('useCreateIndex', true);
mongoose.connect(db.url, db.options);
// console.log('Database connection done');