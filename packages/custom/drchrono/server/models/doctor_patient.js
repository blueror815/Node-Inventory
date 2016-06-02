'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema;
  
/**
 * ---------------------------------------------- Doctor_patient Schema ---------------------------------------------- 
 */
var Doctor_patientSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  doctor_id: {
    type: String,
    required: true,
    trim: true
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
Doctor_patientSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Doctor_patient', Doctor_patientSchema);