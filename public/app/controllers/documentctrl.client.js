'use strict';

angular.module('dataHubApp')
  .controller('DocumentCtrl', ['$scope', '$rootScope', 'DocumentService', 'UserService', '$location', '$window', '$routeParams', 'ToastService', '$route', '$mdDialog', function($scope, $rootScope, DocumentService, UserService, $location, $window, $routeParams, ToastService, $route, $mdDialog) {

//This gets all douments created by a user by the user id which is saved in session storage
    $scope.userDocuments = [];
    var id = $window.sessionStorage.userId;
    DocumentService.getAllDocumentsByUser(id).then(function(res) {
      $scope.userDocuments = res;
      $scope.doc = $scope.userDocuments[$routeParams.index];
    }, function(err) {});

//This method creates a user by an http req and shows a Toast with success or error message
    $scope.createDocument = function() {
      DocumentService.createDocument($scope.doc).then(function(res) {
        $scope.created = true;
        $scope.userDocuments.push(res);
        ToastService.showToast('Created successfully');
        $location.path("/viewdocs");
      }, function(err) {
        ToastService.showToast('Document name already exists');
      });
    };

/*This method updates a document and redirects the user to '/viewdocs' page, it also
shows a Toast with a success or error message
*/
    $scope.editDocument = function(doc) {
      DocumentService.updateDocument(doc._id, doc).then(function(res) {
        $rootScope.doc = res;
        $location.path("/viewdocs");
        ToastService.showToast('Document updated');
      }, function(err) {
        ToastService.showToast('An error occured');
      });
    };

//This method deletes a document and show a confirmation box
    $scope.deleteDocument = function(doc) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete your Document?')
        .content('You will loose all your data if you confirm this. If you clicked this accidentally. Please, click CANCEL to exit')
        .ok('Please, Continue')
        .cancel('CANCEL')
        .targetEvent(doc);
      $mdDialog.show(confirm).then(function() {
        DocumentService.deleteDocument(doc._id).then(function(res) {
          $route.reload();
          ToastService.showToast('Document deleted');
          $location.path("/viewdocs");
        });
      });
    };

  }]);
