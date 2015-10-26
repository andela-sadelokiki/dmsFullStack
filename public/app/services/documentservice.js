'use strict';

angular.module('dataHubApp')
  .factory('DocumentService', ['$http', 'baseUrl', function($http, baseUrl) {
    var Document = {};
    Document.createDocument = function(doc) {
      return $http.post(baseUrl + '/documents', doc).then(function(res) {
        return res;
      });
    };
    Document.getAllDocuments = function() {
      return $http.get(baseUrl + '/documents').then(function(res) {
        return res;
      });
    };
    Document.getOneDocument = function(id) {
      return $http.get(baseUrl + '/documents/' + id).then(function(res) {
        return res.data;
      });
    };
    Document.getAllDocumentsByUser = function(id) {
      return $http.get(baseUrl + '/users/' + id + '/documents').then(function(res) {
        return res.data;
      });
    };
    Document.updateDocument = function(id, params) {
      return $http.put(baseUrl + '/documents/' + id, params).then(function(res) {
        return res;
      });
    };
    Document.deleteDocument = function(id) {
      return $http.delete(baseUrl + '/documents/' + id).then(function(res) {
        return res.data;
      });
    };
    return Document;
  }]);
