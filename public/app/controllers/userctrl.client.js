'use strict';

angular.module('dataHubApp')
  .controller('UserCtrl', ['$scope', 'UserService', 'ToastService', '$location', '$window', '$rootScope', '$mdToast', '$http', function($scope, UserService, ToastService, $location, $window, $rootScope, $mdToast, $http) {

//This method saves user id and token to sessionStorage
    $scope.saveToSessionStorage = function(id, token) {
      $window.sessionStorage.token = token;
      $window.sessionStorage.userId = id;
    };

//This method registers a new user when Signup button is clicked
    $scope.signUp = function() {
      UserService.createUser($scope.user).then(function(res) {
        $scope.saveToSessionStorage(res.data.id, res.data.token);
        $scope.userId = res.data.id;
        $location.url("/dashboard");
        if ($rootScope.alldoc && $rootScope.alldoc.length === 0) {
          ToastService.showToast('Welcome, You have no documents');
        } else {
          ToastService.showToast('Welcome');
        }
      }, function(err) {
        ToastService.showToast('An error occured, try again');
      });
    };

//This method logs in an existing user when SignIn button is clicked
    $scope.signIn = function() {
      UserService.authenticate($scope.user).then(function(res) {
          $scope.saveToSessionStorage(res.data.id, res.data.token);
          $scope.signedIn = true;
          $location.path("/dashboard");
          if ($rootScope.alldoc && $rootScope.alldoc.length === 0) {
            ToastService.showToast('Welcome, You have no documents');
          } else {
            ToastService.showToast('You are signed in');
          }
        },
        function(res) {
          ToastService.showToast('Invalid username or password');
          $scope.msg = res.data.message;
        });
    };
  }]);
