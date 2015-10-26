'use strict';


describe('DocumentCtrl', function() {

  var controller;
  var $scope = null;
  var $httpBackend = null;
  var myWindow = {
    sessionStorage: {
      token: undefined
    }
  }
  var id;
  var location;
  var dummy = [{
    title: 'title',
    content: 'content'
  }];


  beforeEach(function() {
    module('dataHubApp');
  });


  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $window, $location) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    myWindow = $window;
    location = $location;
    myWindow.sessionStorage.token = '123456789';
    myWindow.sessionStorage.userId = 2;
    $httpBackend.whenPOST('http://localhost:3030/documents').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenGET('http://localhost:3030/users/2/documents').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenPUT('http://localhost:3030/documents/2').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenDELETE('http://localhost:3030/documents/2').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenGET('app/partials/home.view.html').respond(function(method, url, data) {
      return [200, {}, {}];
    });
    $httpBackend.whenGET('app/partials/userdocs.view.html').respond(function(method, url, data) {
      return [200, {}, {}];
    });
    controller = $controller('DocumentCtrl', {
      $scope: $scope
    });
  }));


  it('Expect userDocuments to be defined', function() {
    // id = myWindow.sessionStorage.userId = 2;
    expect($scope.userDocuments.length).toBe(0)
    $httpBackend.flush();
    expect($scope.userDocuments.length).toBe(1);
    // expect($scope.userDocuments[0].title).toBe('title');
  });

  it('Expect createDocument to be defined', function() {
    id = myWindow.sessionStorage.userId = 2;
    $scope.userDocuments = [];
    var doc = {
      title: 'Contract',
      content: 'content'
    }
    expect($scope.createDocument).toBeDefined();
    $scope.createDocument();
    $httpBackend.flush();
    expect(location.url()).toBe('/viewdocs');
  });

  it('Expect edit Document to be defined', function() {
    var doc = {
      _id: 2
    }
    expect($scope.editDocument).toBeDefined();
    $scope.editDocument(doc);
    $httpBackend.flush();
    expect(location.path()).toBe('/viewdocs');
  });

  it('Expect delete Document to be defined', function() {
    var doc = {
      _id: 2
    }
    expect($scope.deleteDocument).toBeDefined();
    $scope.editDocument(doc);
    $httpBackend.flush();
    expect(location.path()).toBe('/viewdocs');
  });

});
