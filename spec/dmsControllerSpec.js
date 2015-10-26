 'use strict';
var app = require('../server.js');
var mongoose = require('mongoose');
var request = require('supertest')(app);
var User = mongoose.model('User'),
  Document = mongoose.model('Document');

describe('User Routes', function() {

  beforeEach(function(done) {
    User.remove({}, function(err) {}).then(function() {
      var user = new User();
      user.username = 'sade';
      user.firstname = 'sade';
      user.lastname = 'abdul';
      user.email = 'sade@gmail.com';
      user.setPassword('sade');
      user.save(function(err, users) {
        if (err) {
          return err;
        }
        done();
      });
    });
  });

  afterEach(function(done) {
    User.remove({}, function(err) {
      if (err) {
        return err;
      }
      done();
    });
  });

  it('should test POST method for /users/login', function(done) {
    var logindetails = {
      username: 'sade',
      password: 'sade'
    };
    request
      .post('/users/login')
      .send(logindetails)
      .expect(200)
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body).not.toBeNull();
        done();
      });
  });

  it('should test POST method for logout', function(done) {
    request
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'sade',
        password: 'sade'
      })
      .end(function(err, res) {
        request
          .post('/users/logout')
          .set('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).not.toBeNull();
            expect(res.body).toEqual(jasmine.objectContaining({
              success: true,
              message: 'You are successfully logged out'
            }));
            done();
          });
      });
  });

  it('should test GET method for /users', function(done) {
    request
      .get('/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body.length).toBe(1);
        done();
      });
  });

  it('should test GET method for /users/:id', function(done) {
    request
      .get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return err;
        }
        request
          .get('/users/' + res.body[0]._id)
          .expect(200)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).not.toBeNull();
            done();
          });
      });
  });

  it('should test PUT method for /users/:id', function(done) {
    var updatedUser = {
      username: 'edited Sade',
      email: 'sade1@andela.co'
    };
    request
      .get('/users/')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        request
          .put('/users/' + res.body[0]._id)
          .send(updatedUser)
          // .expect(200)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).not.toBeNull();
            expect(res.body).toEqual(jasmine.objectContaining({
              success: true,
              message: 'User updated!'
            }));
            done();
          });
      });
  });

  it('should test DELETE method for /users/:id', function(done) {
    request
      .get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return err;
        }
        request
          .delete('/users/' + res.body[0]._id)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toEqual(jasmine.objectContaining({
              success: true,
              message: 'User deleted!'
            }));
            done();
          });
      });
  });

});

describe('Document Routes', function() {
  beforeEach(function(done) {
    Document.remove({}).then(function() {
      User.remove({}).then(function() {
        var user = new User();
        user.username = 'toba';
        user.firstname = 'toba';
        user.lastname = 'toba';
        user.email = 'toba@gmail.com';
        user.setPassword('ahmed');
        user.save(function(err, user) {
          if (err) {
            return err;
          }
          var doc = new Document();
          doc.title = 'Contract';
          doc.ownerId = user.id;
          doc.save(function(err, docs) {
            if (err) {
              return err;
            }
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    User.remove({}).then(function() {
      Document.remove({}).then(function() {
        done();
      });
    });
  });

  it('should test GET method for /documents', function(done) {
    request
      .get('/documents')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body).toBeDefined();
        expect(res.body.length).toBe(1);
        done();
      });
  });

  it('should test GET method for /documents/:id', function(done) {
    request
      .get('/documents')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return err;
        }
        request
          .get('/documents/' + res.body[0]._id)
          .expect(200)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).not.toBeNull();
            expect(res.body.title).toBe('Contract');
            done();
          });
      });
  });

  it('should test GET method for /users/:id/documents', function(done) {
    request
      .get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return err;
        }
        request
          .get('/users/' + res.body[0]._id + '/documents')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return err;
            }
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(res.body[0].title).toBe('Contract');
            done();
          });
      });
  });

  it('should test PUT method for /documents/:id', function(done) {
    var updatedDocument = {
      title: 'Contract 2',
    };
    request
      .get('/documents')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        request
          .put('/documents/' + res.body[0]._id)
          .send(updatedDocument)
          .expect(200)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).not.toBeNull();
            done();
          });
      });
  });

  it('should test DELETE method for /documents/:id', function(done) {
    request
      .get('/documents')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return err;
        }
        request
          .delete('/documents/' + res.body[0]._id)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toEqual(jasmine.objectContaining({
              message: 'Document successfully removed'
            }));
            done();
          });
      });
  });

});

describe('POST /users', function() {
  afterEach(function(done) {
    User.remove({}).then(function() {
      done();
    });
  });

  it('should test POST method for /users', function(done) {
    var user = {
      username: 'tommy',
      firstname: 'tommy',
      lastname: 'hill',
      email: 'tommy@gmail.com',
      password: 'tommy'
    };
    request
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .expect(200)
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body).not.toBeNull();
        expect(res.body.user).toBe('tommy');
        done();
      });
  });
});

describe('POST /documents', function() {
  afterEach(function(done) {
    User.remove({}).then(function() {
      Document.remove({}).then(function() {
        done();
      });
    });
  });

  it('should test POST method for /documents', function(done) {
    var userId;
    var user = new User();
    user.username = 'sade';
    user.firstname = 'sade';
    user.lastname = 'abdul';
    user.email = 'sade@gmail.com';
    user.setPassword('sade');
    user.save(function(err) {
      if (err) {
        return err;
      }
    });
    userId = user.id;
    request
      .post('/documents')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Contract',
        name: 'sade'
      })
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body).not.toBeNull();
        expect(res.body.title).toBe('Contract');
        done();
      });
  });
});
