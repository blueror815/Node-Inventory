'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema;
  
/**
 * ---------------------------------------------- Patient Schema ---------------------------------------------- 
 */
var PatientSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  patient_id: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Statics
 */
PatientSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Patient', PatientSchema);