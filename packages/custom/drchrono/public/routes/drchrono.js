'use strict';

angular.module('mean.drchrono').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('drchrono example page', {
      url: '/drchrono/example',
      templateUrl: 'drchrono/views/index.html'
    })
    .state('home', {
      url: '/',
      templateUrl: 'drchrono/views/index.html'
    })
    .state('drchrono callback', {
      url: '/callback?:code',
      templateUrl: 'drchrono/views/callback.html',
    })
    .state('token error', {
      url: '/token_error',
      templateUrl: 'drchrono/views/get_code.html',
    })
    .state('patient_list', {
      url: '/patient_list/:doctorId',
      templateUrl: 'drchrono/views/patient_list.html'
    })
    .state('patient_detail', {
      url: '/patient/:doctorId/:patientId',
      templateUrl: 'drchrono/views/patient_detail.html'
    });
  }
]);
