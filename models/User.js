/*******************************************************************************
 * User Model
 ******************************************************************************/
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamps');

const OwedSchema = new Schema({
  name: { type: String, default: '' },
  balance: { type: Number, default: 0 }
});

//Define User schema
const UserSchema = new Schema({
  name: { type: String, default: '' },
  balance: { type: Number, default: 0 },
  oweTo: { type: OwedSchema },
  oweFrom: { type: OwedSchema },
  session: { type: Boolean, default: true }
});

// Add timestamp plugin
UserSchema.plugin(timestamps, { index: true });

module.exports = mongoose.model('User', UserSchema);
