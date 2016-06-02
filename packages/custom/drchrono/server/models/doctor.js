'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema;
  
/**
 * ---------------------------------------------- Doctor Schema ---------------------------------------------- 
 */
var DoctorSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  doctor_id: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Statics
 */
DoctorSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Doctor', DoctorSchema);