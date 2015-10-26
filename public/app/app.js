'use strict';

var app = angular.module('dataHubApp', ['ngMaterial', 'ngRoute', 'ngMdIcons']);
app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/partials/home.view.html',
      controller: 'UserCtrl'
    })
    .when('/signup', {
      templateUrl: 'app/partials/signup.view.html',
      controller: 'UserCtrl'
    })
    .when('/signin', {
      templateUrl: 'app/partials/signin.view.html',
      controller: 'UserCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'app/partials/profile.view.html',
      controller: 'DocumentCtrl',
      data: {
        requiresLogin: true
      }
    })
    .when('/createdoc', {
      templateUrl: 'app/partials/createdoc.view.html',
      controller: 'DocumentCtrl',
      data: {
        requiresLogin: true
      }
    })
    .when('/viewdocs', {
      templateUrl: 'app/partials/userdocs.view.html',
      controller: 'DocumentCtrl',
      data: {
        requiresLogin: true
      }
    })
    .when('/updatedoc/:index', {
      templateUrl: 'app/partials/updatedoc.view.html',
      controller: 'DocumentCtrl',
      data: {
        requiresLogin: true
      }
    })
    .when('/updateuser', {
      templateUrl: 'app/partials/updateuser.view.html',
      controller: 'NavCtrl',
      data: {
        requiresLogin: true
      }
    })
    .otherwise({
      redirectTo: '/'
    });

  // $locationProvider.html5mode(true)

  $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
    return {
      'request': function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = $window.sessionStorage.token;
        }
        return config;
      },
      'responseError': function(response) {
        if (response.status === 401 || response.status === 403) {
          $location.path('/signin');
        }
        return $q.reject(response);
      }
    };
  }]);
}])

.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
  $rootScope.$on("$routeChangeStart", function(event, to) {
    if ($window.sessionStorage.refUrl && $window.sessionStorage.token) {
      var ref = $window.sessionStorage.refUrl;
      $window.sessionStorage.removeItem('refUrl');
      $location.url(ref);
    }
    if (to.data && to.data.requiresLogin) {
      if (!($window.sessionStorage.token || $location.search().token)) {
        event.preventDefault();
        $window.sessionStorage.refUrl = $location.url();
        $location.path('/signin'); //redirect to login if user is not authenitcated
      }
    }
  });
}]);
