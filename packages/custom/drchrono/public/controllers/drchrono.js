'use strict';

/* jshint -W098 */
angular.module('mean.drchrono').controller('DrchronoController', ['$scope', '$stateParams', 'Global', 'Drchrono', '$http', '$location','$cookies',
	function($scope, $stateParams, Global, Drchrono, $http, $location, $cookies) {
	    $scope.global = Global;
	    $scope.package = {
	      name: 'drchrono'
	    };
	    $scope.title = '';
	    $scope.wait_line = '';
	    $scope.is_token_exist = function(){
	    	if( typeof($cookies.get('token')) != 'undefined' ){
	    		return 1;
	    	} else {
	    		$("#loader").toggle();
	    		$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_access_token_refresh',
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
	    				$("#loader").toggle();
	    				if( response.hasOwnProperty('access_token') ){
							var access_token = response.access_token;
							$cookies.put('token', access_token);
			    			$scope.wait_line = 'You will redirect to main site soon. Please wait for a while.';
			    		} else {
			    			$scope.wait_line = 'Sorry!! Something went wrong. Please wait for some time.';
			    			$location.path('/token_error')
			    		}
	    			}
	    		});
	    		if( typeof($cookies.get('token')) != 'undefined' ){
		    		return 1;
		    	} else {
		    		$scope.wait_line = 'Sorry!! Something went wrong. Please wait for some time.';
		    	}
	    	}
	    };

	    $scope.token_error = function(){
    		if( $scope.wait_line != '' || typeof($scope.wait_line) == 'undefined' ){
				$scope.wait_line = '';						
			}
	    };

	    $scope.get_code = function(){
    		var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		if( $scope.msg != '' || typeof($scope.msg) == 'undefined' ){
					$scope.msg = '';						
				}
	    		$location.path('/');
	    	}
	    };
	    $scope.get_all_doctors = function(){
		 	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
	    		var doctors = '';
	    		var db_doctors = '';
	    		$http.get('/api/drchrono/get_all_doctors').success(function(response) {
					db_doctors = response.db_doctors;
					doctors = response.api_doctors.results;
					var doctor_list = [];
					for (var i in db_doctors) {
						for (var j in doctors) {
							if( doctors[j].id == db_doctors[i].doctor_id ){
								doctor_list.push(doctors[j]);
							}
						}
					}
					$("#loader").toggle();
					if( $scope.msg != '' || typeof($scope.msg) == 'undefined' ){
						$scope.msg = '';						
					}
					$scope.doctors = doctor_list;
				}).error(function(data) {
					$location.path('/');
				});
	    	}
	    };

	    $scope.add_patient = function(patient){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
				if(patient){
					$("#loader").toggle();
					$.ajax({
		    			type: 'POST',
		    			url: '/api/drchrono/add_patients/',
		    			async: false,
		    			dataType: 'JSON',
		    			data:patient,
		    			success: function(response){
		    				$("#loader").toggle();
	    					$scope.msg = response.error_msg;
					    	$location.path('/');
		    			}
		    		});
				}
			}
	    }

	    $scope.get_patient_list = function(doctor){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
				if(doctor){
					var id = doctor.id;
					$location.path('patient_list/' + id);
				}
			}
	    };

	    $scope.get_all_patients = function(){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
		    	var id = $stateParams.doctorId;
		    	var patients = '';
		    	var db_patients = '';
		    	$http.get('/api/drchrono/get_all_patients/' + id).success(function(response) {
		    		patients = response.api_patients.results;
		    		db_patients = response.db_patients;
		    		var patient_list = [];
					for (var i in db_patients) {
						for (var j in patients) {
							if( patients[j].id == db_patients[i].patient_id ){
								patient_list.push(patients[j]);
							}
						}
					}
					$("#loader").toggle();
					$scope.patients = patient_list;
					$scope.doctorId = id;
	    		}).error(function(data) {
					$location.path('/');
				});
			}
	    };

	    $scope.get_patient_detail = function(patient){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
				if(patient){
					var ids = patient.ids;
					var ids = ids.split('|');
					var doctorId = ids[0];
					var patientId = ids[1];
					$location.path('patient/' + doctorId + '/' + patientId);
				}
    		}
	    };

	    $scope.patient_detail = function(){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
		    	var doctorId = $stateParams.doctorId;
		    	var patientId = $stateParams.patientId;
		    	$http.get('/api/drchrono/patient_detail/' + doctorId + '/' + patientId).success(function(response) {
					$("#loader").toggle();
		    		$scope.doctorId = doctorId;
					$scope.patient = response;
				}).error(function(data) {
					$location.path('/');
				});
			}
	    };

	    $scope.return_patient_list = function(doctorId){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$location.path('patient_list/' + doctorId);
    		}
	    };

	    $scope.return_doctor = function(doctorId){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$location.path('/');
    		}
	    };
	}
]);
