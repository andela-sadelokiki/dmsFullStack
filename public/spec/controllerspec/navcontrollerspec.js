'use strict';


describe('NavCtrl', function() {

  var controller;
  var $scope;
  var $httpBackend;
  var myWindow;
  var id;
  var location;

  var dummy = {
    id: "562d75afe4402d6616e27649",
    message: "User registered",
    success: true,
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZS",
    user: "meeee"
  }


  beforeEach(function() {
    module('dataHubApp');
  });


  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $window, $location) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    myWindow = $window;
    location = $location;
    $httpBackend.whenGET('http://localhost:3030/users/562d75afe4402d6616e27649').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenGET('http://localhost:3030/users/2').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenGET('app/partials/home.view.html').respond(function(method, url, data) {
      return [200, {}, {}];
    });
    $httpBackend.whenGET('app/partials/profile.view.html').respond(function(method, url, data) {
      return [200, {}, {}];
    });
    $httpBackend.whenPUT('http://localhost:3030/users/20').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    $httpBackend.whenDELETE('http://localhost:3030/users/20').respond(function(method, url, data) {
      return [200, dummy, {}];
    });
    controller = $controller('NavCtrl', {
      $scope: $scope
    });
  }));


  it('Expect id to exist', function() {
    id = myWindow.sessionStorage.userId
    expect(id).toBeDefined();
  });

  it('Expect current user to be defined after making get request', function() {
    id = 2;
    myWindow.sessionStorage.userId = 2
    expect($scope.currentUser).not.toBeDefined()
    $httpBackend.flush(); //getOneUser is made
    expect($scope.currentUser).toBeDefined()
  });

  it('Expect update user to update a user', function() {
    $httpBackend.flush()
    var currentUser = {
      _id: 20
    }
    $scope.currentUser = undefined;
    $scope.updateProfile(currentUser)
    expect($scope.currentUser).not.toBeDefined()
    $httpBackend.flush();
    expect($scope.currentUser).toBeDefined();
    expect(location.path()).toBe("/dashboard")
  });

  it('Expect delete user() to delete a user', function() {
    var currentUser = {
      _id: 20
    }
    $scope.deleteProfile();
    $httpBackend.flush();
    expect(location.path()).toBe("/");

  });

  it('Expect logout() to clear the session storage', function() {
    expect(myWindow.sessionStorage.userId).toBeDefined();
    $scope.logOut()
    expect(myWindow.sessionStorage.userId).not.toBeDefined();
    expect(location.path()).toBe("/");
  });

});
