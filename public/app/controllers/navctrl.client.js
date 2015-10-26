'use strict';

angular.module('dataHubApp')
  .controller('NavCtrl', ['$scope', 'UserService', 'ToastService', '$location', '$window', '$rootScope', '$mdToast',
    '$routeParams', '$mdDialog', '$route',
    function($scope, UserService, ToastService, $location, $window,
      $rootScope, $mdToast, $routeParams, $mdDialog, $route) {

      var id = null;
      id = $window.sessionStorage.userId;
      UserService.getOneUser(id).then(function(res) {
        $rootScope.currentUser = res;
      }, function(err) {});

      //This logs out the user by clearing the sessionStorage
      $rootScope.logOut = function() {
        $window.sessionStorage.clear();
        ToastService.showToast('You are logged out, Bye');
        $location.path("/");
      };

      //This method updates a user profile by the userId
      $scope.updateProfile = function(currentUser) {
        UserService.updateUser(currentUser._id, currentUser).then(function(res) {
          $scope.currentUser = res;
          $location.path("/dashboard");
          ToastService.showToast('User updated');
        }, function(err) {
          ToastService.showToast('An error occured');
        });
      };

      //This method deletes a user
      $scope.deleteProfile = function(currentUser) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete your Profile?')
          .content('You will loose all your data if you confirm this. If you clicked this accidentally. Please, click CANCEL to exit')
          .ok('Please, Continue')
          .cancel('CANCEL')
          .targetEvent(currentUser);
        $mdDialog.show(confirm).then(function() {
          UserService.deleteUser(currentUser._id).then(function(res) {
            $route.reload();
            ToastService.showToast('Profile deleted');
            $location.path("/");
          });
        });
      };
    }
  ]);
