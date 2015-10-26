'use strict';

angular.module('dataHubApp')
  .factory('UserService', ['$http', 'baseUrl', '$window', function($http, baseUrl, $window) {

    var User = {};
    User.createUser = function(user) {
      return $http.post(baseUrl + '/users', user).then(function(res) {
        // console.log(res);
        return res;
      });
    };
    User.getOneUser = function(id) {
      return $http.get(baseUrl + '/users/' + id).then(function(res) {
        return res.data;
      });
    };
    User.authenticate = function(param) {
      return $http.post(baseUrl + "/users/login", param).then(function(res) {
        return res;
      });
    };
    User.updateUser = function(id, params) {
      return $http.put(baseUrl + '/users/' + id, params).then(function(res) {
        return res;
      });
    };
    User.deleteUser = function(id) {
      return $http.delete(baseUrl + '/users/' + id).then(function(res) {
        return res;
      });
    };
    return User;
  }]);
