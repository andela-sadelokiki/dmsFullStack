'use strict';


describe('UserCtrl', function() {

  var controller;
  var $scope;
  // var $scope = null;
  var $httpBackend;
  var myWindow;
  var myWindow = {
    sessionStorage: {
      token: undefined
    }
  }
  var location;
  // var mockUserService = null;
  // var UserCtrl = null;
  var dummy = {
        id: "562d75afe4402d6616e27649",
        message: "User registered",
        success: true,
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZS",
        user: "meeee"
    }

  // beforeEach(module('dataHubApp'));

  beforeEach(function() {
    module('dataHubApp');
  });


  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $window, $location) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    location = $location;
    myWindow = $window;
    $httpBackend.whenPOST('http://localhost:3030/users').respond(function(method, url, data){
      // return dummy
      return [200,dummy,{}];
    });
    $httpBackend.whenGET('app/partials/signin.view.html').respond(function(method, url, data){
      // return dummy
      return [200,{},{}];
    });
    $httpBackend.whenPOST('http://localhost:3030/users/login').respond(function(method, url, data){
      return [200,dummy,{}];
    });
    controller = $controller('UserCtrl', {
      $scope: $scope
    });
  }));


  it('Expect signup to be defined', function() {
    expect($scope.signUp).toBeDefined();
  });


  it('Expect signup to be defined', function() {
    expect($scope.signIn).toBeDefined();
  });


  it('Expect signup to create a user', function() {
    expect($scope.userId).not.toBeDefined();
    $scope.signUp();
    $httpBackend.flush();
    expect($scope.userId).toBeDefined();
    expect(location.path()).toBe("/dashboard");
  });

  it('Expect signin to signin a user', function() {
    // expect(myWindow.sessionStorage.token).not.toBeDefined();
    expect($scope.signedIn).not.toBeDefined();
    $scope.signIn();
    $httpBackend.flush();
    expect(myWindow.sessionStorage.token).toBeDefined();
    expect($scope.signedIn).toBeDefined();
    expect($scope.signedIn).toBeTruthy();
    expect(location.path()).toBe("/dashboard");
  });



});

