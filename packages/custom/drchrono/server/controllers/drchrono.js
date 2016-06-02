'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
	// Postm = mongoose.model('Post'),
	Doctorm = mongoose.model('Doctor'),
	Patientm = mongoose.model('Patient'),
	Doctor_patientm = mongoose.model('Doctor_patient'),
	async = require('async'),
	request = require('request'),
	config = require('meanio').loadConfig(),
	_ = require('lodash');

	var session = require('express-session');
	var client_id = process.env.client_id;
	var client_secret = process.env.client_secret;
	var redirect_uri = process.env.redirect_uri;
	var refresh_token = process.env.refresh_token;
	var default_doctor = process.env.default_doctor;

module.exports = function(Drchrono) {
	return {
		get_all_doctors: function(req, res) {
			// console.log(req.cookies.token);
			async.series({
				api_doctors: function(callback) {
					request({
				        method: 'GET',
				        url: 'https://drchrono.com/api/doctors',
				        headers: {
			        		"Authorization" : "Bearer " + req.cookies.token,
			        		"Content-Type" : "application/json"
			        	},
			        	json: true,
				    }, function(err, response, body) {
				        if(err) {
				            callback(err, []);
				        } else {
				        	callback(null, body);
				        }
				    });
				},
				db_doctors: function(callback) {
					Doctorm.find().exec(function(err, doctors) {
			            if (err) {
			            	callback(err, []);
			            }
			            callback(null, doctors);
			        });
				}
			}, function(err, results) {
				res.json(results);
			});
		},
		add_patients: function(req, res) {
			var patient_array = req.body;
			var return_array = {
				error_msg : '',
				status : 0
			};
			var total_doctors = Object.keys(patient_array.doctor_ids).length;
			var count = 0;
			var patient_detail = {
				'first_name' : patient_array.first_name,
				'last_name': patient_array.last_name,
				'doctor' : default_doctor,
				'gender' : patient_array.gender
			};
			request({
		        method: 'POST',
		        url: 'https://drchrono.com/api/patients',
		        headers: {
	        		"Authorization" : "Bearer " + req.cookies.token,
	        		"Content-Type" : "application/json"
	        	},
	        	formData: patient_detail,
	        	json: true,
		    }, function(err, response, body) {
		    	if(err) {
		        	return_array.status = 0;
		        	return_array.error_msg = 'There is some issue to save patient detail. Please try again!!';
		        	res.json(return_array);
		        	// callback(err,[]);
		        } else {
		        	req.cookies.patient_id = body.id;
		        	req.cookies.doctor = body.doctor;
		        	var patient_id = body.id;
		        	var doctor = body.doctor;
		        	var patient = new Patientm({
						patient_id : patient_id
					});
					patient.save(function(err, result) {});
		        	async.forEachOf(patient_array.doctor_ids, function (value, key, callback) {
						async.series({
				        	db_doctor_patient: function(callback){
			        		/*-------------------- Insert Doctor-Patient Relation in mongodb -------------------- */
								var doctor_patient = new Doctor_patientm({
									doctor_id : key,
									patient_id : patient_id 
								});
					            doctor_patient.save(function(err, result) {
					            	if (err) {
					                	return_array.status = 0;
					        			// return_array.error_msg = 'There is some issue to save patient detail. Please try again!!';
					                	callback(err,[]);
					                } else {
					                	return_array.status = 1;
					        			return_array.error_msg = 'Patient detail saved successfully.';
					        			callback(null, result)
									}
									
					            });
							/*-------------------- Insert Doctor-Patient Relation in mongodb -------------------- */
				        	}
			        	}, function(err, results) {
			        		count++;
							if( count == total_doctors ){
								res.json(return_array);
							}
						});
					});
	        	}
        	});
		},
		get_all_patients: function(req, res) {
			var doctorId = req.params.doctorId;
			async.series({
				api_patients: function(callback) {
					request({
				        method: 'GET',
				        url: 'https://drchrono.com/api/patients',
				        headers: {
			        		"Authorization" : "Bearer " + req.cookies.token,
			        		"Content-Type" : "application/json"
			        	},
			        	json: true,
				    }, function(err, response, body) {
				        if(err) {
				            callback(err, []);
				        } else {
				            callback(null, body);
				        }
				    });
				},
				db_patients: function(callback) {
					Doctor_patientm.find({'doctor_id': doctorId}).exec(function(err, patients) {
			            if (err) {
			            	callback(err, []);
			            }
			            callback(null, patients);
			        });
				}
			}, function(err, results) {
				res.json(results);
			});
		},
		patient_detail: function(req, res) {
			var doctorId = req.params.doctorId;
			var patientId = req.params.patientId;
			request({
		        method: 'GET',
		        url: 'https://drchrono.com/api/patients',
		        headers: {
	        		"Authorization" : "Bearer " + req.cookies.token,
	        		"Content-Type" : "application/json"
	        	},
	        	json: true,
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		        	var results = body.results;
		        	var return_json = [];
		        	for(var i in results){
		        		if( results[i].id == patientId ){
		        			return_json = results[i];
		        		}
		        	}
        			res.json(return_json);
		        }
		    });
		},
		get_access_token: function(req, res) {
			var code = req.params.code;
			request({
		        method: 'POST',
		        url: 'https://drchrono.com/o/token/',
	        	json: true,
	        	formData : {
	        		'grant_type' : 'authorization_code',
	        		'client_id' : client_id,
	        		'client_secret' : client_secret,
	        		'redirect_uri' : redirect_uri,
	        		'code' : code
	        	}
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		        	//req.session.token = body.access_token;
        			res.json(body);
		        }
		    });
		},
		get_access_token_refresh: function(req, res) {
			request({
		        method: 'POST',
		        url: 'https://drchrono.com/o/token/',
	        	json: true,
	        	formData : {
	        		'grant_type' : 'refresh_token',
	        		'client_id' : client_id,
	        		'client_secret' : client_secret,
	        		'refresh_token' : refresh_token,
	        	}
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
        			res.json(body);
		        }
		    });
		},
		get_access_url: function(req, res) {
			var url = 'https://drchrono.com/o/authorize/?redirect_uri=' + redirect_uri + '&response_type=code&client_id=' + client_id;
			res.json(url);
		},
	};
}