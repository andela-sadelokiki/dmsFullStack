'use strict';

angular.module('dataHubApp')
  .factory('ToastService', function($mdToast) {
    return {
      showToast: function(message) {
        $mdToast.show(
          $mdToast.simple()
          .content(message)
          .position('top left')
          .hideDelay(3000)
        );
      }
    };
  });
