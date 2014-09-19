var psApp = angular.module('psApp', ['ui.router','ngSanitize']);

psApp.config(function($httpProvider) {

  var logsOutUserOn401 = function($location, $q, SessionService, FlashService) {
  var success = function(response) {
  	return response;
    };

    var error = function(response) {
      if(response.status === 401) {
        SessionService.unset('authenticated');
        $location.path('/');
        FlashService.show(response.data.flash);
      }
      return $q.reject(response);
    };

    return function(promise) {
      return promise.then(success, error);
    };
  };

  $httpProvider.responseInterceptors.push(logsOutUserOn401);

});

psApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // Login Page ========================================
        .state('login', {
            url: '/',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('setup', {
            url: '/setup',
            templateUrl: 'templates/setup.html',
            controller: 'SetupController'
        });

        $locationProvider.html5Mode(true);
        
});

psApp.factory("SessionService", function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  }
});

psApp.factory("FlashService", function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  }
});

psApp.factory("AuthenticationService", function($http, $sanitize, SessionService, FlashService, CSRF_TOKEN) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  var loginError = function(response) {
    FlashService.show(response.flash);
  };

  var sanitizeCredentials = function(credentials) {
    return {
      email: $sanitize(credentials.email),
      password: $sanitize(credentials.password),
      csrf_token: CSRF_TOKEN
    };
  };

  return {
    login: function(credentials) {
      var login = $http.post("/auth/login", sanitizeCredentials(credentials));
      login.success(cacheSession);
      login.success(FlashService.clear);
      login.error(loginError);
      return login;
    },
    logout: function() {
      var logout = $http.get("/auth/logout");
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});

psApp.controller("LoginController", function($scope, $location, AuthenticationService, FlashService) {
  $scope.credentials = { email: "", password: "" };
  $scope.loginButtonName = 'Login';

  $scope.login = function() {
    $scope.loginButtonName = 'Logging in...'
    AuthenticationService.login($scope.credentials).success(function() {
      FlashService.show("Successfully logged in!");
      $location.path('/setup');
    });
    AuthenticationService.login($scope.credentials).error(function() {
      $scope.loginButtonName = 'Login';
    });
  };
});

psApp.controller("SetupController", function($scope, $location, AuthenticationService){

})