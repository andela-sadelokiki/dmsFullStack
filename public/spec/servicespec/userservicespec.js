'use strict';

describe('UserService', function() {
  var UserService = null,
    httpBackend = null;

  beforeEach(module('dataHubApp'));

  beforeEach(inject(function(_UserService_, $httpBackend) {
    UserService = _UserService_;
    httpBackend = $httpBackend;
  }));

  it('should create a user', function() {
    httpBackend.whenPOST('http://localhost:3030/users').respond({
      token: 'token',
      user: 'username',
      id: 'userId',
      success: true,
      message: 'User registered'
    });
    UserService.createUser('newuser').then(function(res) {
      httpBackend.expectPOST('http://localhost:3030/users')
      httpBackend.flush();
    });
  });

  it('should get one user', function() {
    httpBackend.whenGET('http://localhost:3030/users/2').respond({
      user: 'username'
    });
    UserService.getOneUser(2).then(function(res) {
      httpBackend.expectGET('http://localhost:3030/users/2')
      httpBackend.flush();
    });
  });

  it('should update a User', function() {
    httpBackend.whenPUT('http://localhost:3030/users/3').respond({
      success: true,
      message: 'User updated!'
    });
    UserService.updateUser(3).then(function(res) {
      httpBackend.expectPUT('http://localhost:3030/users/3')
      httpBackend.flush();
    });
  });

  it('should authenticate user', function() {
    httpBackend.whenPOST('http://localhost:3030/users/login').respond({
      id: 'userId',
      success: true,
      message: 'User signed in',
      token: 'token'
    });
    UserService.authenticate().then(function(res) {
      httpBackend.expectPOST('http://localhost:3030/users/login')
      httpBackend.flush();
    });
  });

  it('should delete a user', function() {
    httpBackend.whenDELETE('http://localhost:3030/users/id').respond({
      success: true,
      message: 'User deleted!'
    });
    UserService.deleteUser('id').then(function(res) {
      httpBackend.whenDELETE('http://localhost:3030/users/id')
      httpBackend.flush();
    });
  });
});
