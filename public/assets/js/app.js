var psApp = angular.module('psApp', ['ui.router','ngSanitize','ngCookies','angularFileUpload','ngProgress']);

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

var loginRequired = function(FlashService, AuthenticationService, $location, $q) {  
    var deferred = $q.defer();
    
    if(! AuthenticationService.isLoggedIn()) {
        $q.reject('User not logged in!')
        $location.path('/');
        FlashService.show('User not logged in!');
    } else {
        deferred.resolve();
    }

    return deferred.promise;
}

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
            views: {
              '' : {templateUrl: 'templates/home.html'},

              'sidebar@setup' : {
                templateUrl: 'templates/sidebar.html',
                // controller: 'SidebarController'
              },
              'mainpage@setup' :{
                templateUrl: 'templates/setup.html',
                controller: 'SetupController',
                resolve: {
                  booklist : function(FetchService){
                    return FetchService.getBooks();
                  }
                }
              },
            },
            resolve: { loginRequired: loginRequired }
        })

        .state('type', {
          url: '/type',
          views: {
            '' : {templateUrl: 'templates/home.html'},

            'sidebar@type' : {
                templateUrl: 'templates/sidebar.html',
                // controller: 'SidebarController'
              },

              'mainpage@type' : {
                templateUrl: 'templates/type.html',
                controller: 'TypingController',
                resolve: {
                  topiclist : function(FetchService){
                    return FetchService.getTopics();
                  },
                  examlist: function(FetchService){
                    return FetchService.getExams();
                  }
                }
              }
          },
          resolve: {loginRequired: loginRequired,
        }
        })

        $locationProvider.html5Mode(true);
        
});

psApp.factory("FetchService", function($http) {
  return {
    getBooks: function() {
      return $http.get('/getBooks');
    },
    getTopics: function() {
      return $http.get('/getTopics');
    },
    getExams: function(){
      return $http.get('/getExams')
    }

  };
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

psApp.factory("AuthenticationService", function($location, $http, $sanitize, SessionService, FlashService, $cookieStore, CSRF_TOKEN) {

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
      login.success(function(data, status, headers, config) {
                    $cookieStore.put('firstname', data.firstname);
                    FlashService.show('Welcome ' + $cookieStore.get('firstname') + '!' );
                });
      login.error(loginError);
      return login;
    },
    logout: function() {
      var logout = $http.get("/auth/logout");
      logout.success(uncacheSession);
      $cookieStore.remove('batchid');
      $cookieStore.remove('bookname');
      $cookieStore.remove('currentqid');
      $cookieStore.remove('chaptername');
      $cookieStore.remove('edition');
      $cookieStore.remove('firstname');
      $cookieStore.remove('publishername');
      $cookieStore.remove('chapterid');
      $cookieStore.remove('currentqid');
      $cookieStore.remove('currentTopic');
      $location.path('/');
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});

psApp.controller("LoginController", function($rootScope, $scope, $location, AuthenticationService, FlashService, ngProgress) {
  ngProgress.color('#A3E0FF');
  ngProgress.start();
  $scope.credentials = { email: "", password: "" };
  $scope.loginButtonName = 'Login';
  ngProgress.complete();
  $scope.login = function() {
      ngProgress.start();
      $scope.loginButtonName = 'Logging in...'
      AuthenticationService.login($scope.credentials).success(function() {
      FlashService.show("Successfully logged in!");
      // $rootScope.userfullname = 
      $location.path('setup');
    });
    AuthenticationService.login($scope.credentials).error(function() {
      $scope.loginButtonName = 'Login';
    });
  };
});

psApp.controller("SetupController", function(ngProgress, booklist,$state, $http, $scope, $location, AuthenticationService, FlashService, FetchService, $cookieStore){
  ngProgress.color('#A3E0FF');
   $scope.firstname = $cookieStore.get('firstname');
   ngProgress.complete();
   $scope.booklist = booklist.data;
   $scope.selectBook = function(id){
    $scope.selectedchapter = undefined;
    $scope.selectedid = id;
   }

   $scope.isbookselected = function(){
    if($scope.selectedid!= null){
      return true;
    }else{
      return false;
    }
   }

   $scope.ischapterselected = function(){
    if($scope.selectedchapter != null){
      return true;
    }else{
      return false;
    }
   }

   $scope.selectChapter = function(id){
    $scope.selectedchapter = id;
   }
   
   $scope.proceed = function(selectedid, selectedchapter){
    ngProgress.show();
    var chapterid = $scope.booklist[selectedid].chapter[selectedchapter].id;
    $http.post('/getBatchID',{'chapterid':chapterid}).success(function(data, status, headers, config) {
      $cookieStore.put('batchid', data.batchid);
      $cookieStore.put('bookname', $scope.booklist[selectedid].bookname);
      $cookieStore.put('publishername', $scope.booklist[selectedid].publisher.publishername);
      $cookieStore.put('edition', $scope.booklist[selectedid].edition )
      $cookieStore.put('chaptername', $scope.booklist[selectedid].chapter[selectedchapter].chaptername)
      $cookieStore.put('chapterid', chapterid);
      $cookieStore.remove('currentqid');
      $cookieStore.remove('currentTopic');
    $state.go('type');
  });
   };

});

psApp.controller('SidebarController',function(ngProgress, $scope, AuthenticationService, FlashService){
  ngProgress.color('#A3E0FF')
  $scope.logout = function(){
    ngProgress.start();
    AuthenticationService.logout();
    FlashService.show('User loggged out!');
    ngProgress.complete();
   };

   $scope.setSelected = function(linkname){
    $scope.selectedlink = linkname;
   };

   $scope.isSelected = function(linkname){
    if($scope.selectedlink == linkname){
      console.log(true);
    }else{
      return false;
    };
console.log('yes!');
    $scope.isActive = function(route) {

        return route === $location.path();
    };

   }
});
psApp.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

psApp.controller('TypingController', function(ngProgress, examlist, topiclist, $state, $http, $scope, $rootScope, AuthenticationService, FlashService, $cookieStore){
  ngProgress.color('#993300');

  ngProgress.set('60');
// Get data from cookieStore
  $scope.topiclist = topiclist.data;
  $scope.examlist = examlist.data;
  ngProgress.complete();
  $scope.doubt = false;
  $scope.correctopts = [{'choice' : 'A'}, {'choice' : 'B'}, {'choice' : 'C'}, {'choice' : 'D'}];
  $scope.batchid = $cookieStore.get('batchid');
  $scope.bookname = $cookieStore.get('bookname');
  $scope.publishername = $cookieStore.get('publishername');
  $scope.edition = $cookieStore.get('edition');
  $scope.chaptername = $cookieStore.get('chaptername');
  $scope.chapterid = $cookieStore.get('chapterid');
  $scope.currentqid = $cookieStore.get('currentqid');
  $scope.currentTopic = $cookieStore.get('currentTopic');

  $scope.showSubmitButton = function(){
    if($scope.currentTopic!= null && $scope.currentTopic!=undefined && $scope.correctans!=null && $scope.qbodytext!='' && $scope.aoptiontext!='' && $scope.boptiontext!='' && $scope.coptiontext!='' && $scope.doptiontext!=''){
      return true;
    }else{
      return false;
    }
  }

  $scope.showExamYear = function(){
    if($scope.selectedexam!=null && $scope.selectedexam!=undefined){
      return true;
    }else{
      return false;
    }
  }

  $scope.qidUpdate = function(){
    if($scope.currentqid!=0 && $scope.currentqid!=undefined)
    {
        $scope.qidtext = 'Question ID ='+ $scope.currentqid +'. Get new id?'   ;
    }else{
        $scope.qidtext = 'Question ID unassigned. Get new question id!';
    }
  };

  $scope.qidUpdate();

  $scope.getQID = function(){
    ngProgress.start();
    $http.post('/getQID',{'batchid':$scope.batchid}).success(function(data, status, headers, config) {
      $cookieStore.put('currentqid', data.currentqid);
      $scope.currentqid = $cookieStore.get('currentqid');
      $scope.qidUpdate();
      ngProgress.complete();
  });
  };

  $scope.ifqidassigned = function(){
    if($scope.currentqid!=0 && $scope.currentqid!=undefined){
      return true;
    }else{
      return false;
    }
  }

  $scope.selectTopic = function(index){
    $cookieStore.put('currentTopic', $scope.topiclist[0].topic[index]);
    $scope.currentTopic = $cookieStore.get('currentTopic');
  }

  //MathJax
   MathJax.Hub.Config({
    showProcessingMessages: true,
    tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
  });
  
   // $scope.q = ['','','','',''];
     $scope.updateqdisplay = function(){
      $scope.qdisplay = '<strong> Q. </strong>' + ' <p>' + $scope.qbodytext + '</p>'
                          + '<ol type="A" style="font-weight: bold;">' + 
                          '<li> <p>' + $scope.aoptiontext + '</p></li>'+
                          '<li> <p>' + $scope.boptiontext + '</p></li>'+
                          '<li> <p>' + $scope.coptiontext + '</p></li>'+
                          '<li> <p>' + $scope.doptiontext + '</p></li>'+
                          '</ol>';

   }
   $scope.sol = '';
  $scope.updatesoldisplay = function(){
       $scope.soldisplay = $scope.solutiontext;
   }

  $scope.RunMJ = function(){
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"qdisplay"]);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"soldisplay"]);
  }

  $scope.runLatex = function()
  {
    var latexhead = '\\documentclass{article} <br>' + 
                     '&nbsp;&nbsp;&nbsp;&nbsp;' + '\\usepackage{amsmath} <br>' +
                      '&nbsp;&nbsp;&nbsp;&nbsp;' + '\\begin{document} <br>';
    var qbody = '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + 
                'Q. '+ $scope.qbodytext + '<br>';
    var qoption = '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + 
                  '\\begin{enumerate}' + '<br>' + 
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '\\item ' + $scope.aoptiontext + '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '\\item ' + $scope.boptiontext + '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '\\item ' + $scope.coptiontext + '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '\\item ' + $scope.doptiontext + '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '\\end{enumerate}'+ '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' ;
                  if($scope.correctans!=undefined && $scope.correctans!=null){
                      qoption = qoption + '%answer' + '<br>' + 
                    '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                     $scope.correctans.choice + '<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '\\%solution' + '<br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                     $scope.solutiontext;
                  }
                  
    var latexfoot = '<br>' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '\\end{document}';
    $scope.latexdisplay =  latexhead + qbody + qoption + latexfoot;
  }

    $scope.submitQ = function(){
      qpostdata = {'topicid' : $scope.currentTopic.id,
                    'qid' : $scope.currentqid,
                    'batchid' : $scope.batchid,
                    'qbodytext' : $scope.qbodytext,
                    'aoptiontext' : $scope.aoptiontext,
                    'boptiontext' : $scope.boptiontext,
                    'coptiontext' : $scope.coptiontext,
                    'doptiontext' : $scope.doptiontext,
                    'solutiontext': $scope.solutiontext,
                    'correctans' : $scope.correctans.choice,
                    'exam_id': undefined,
                    'examyear': $scope.examYear,
                    'doubt' : $scope.doubt,
                    'pageNo' : $scope.pageNo
        };
                            if($scope.selectedexam!=null && $scope.selectedexam!=undefined){
                                qpostdata.exam_id = $scope.selectedexam.id;
                            }
        $http.post('/postQues',qpostdata).success(function(data, status, headers, config) {

      $scope.qdisplay = '';
      $scope.soldisplay = '';
      $scope.qbodytext = '';
      $scope.aoptiontext = '';
      $scope.boptiontext = '';
      $scope.coptiontext = '';
      $scope.doptiontext = '';
      $scope.solutiontext = '';
      $scope.correctans = null;
      $scope.selectedexam = null;
      $scope.examYear = null;
      $scope.doubt = false;
      $scope.getQID();
      $scope.pageNo = '';
    });
};
})

psApp.controller('QbodyFileUploadController', function(ngProgress, $scope, $upload){
    ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'qbody'},
        file: file, 
      }).progress(function(evt) {
       // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
       ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
          ngProgress.complete();
        // console.log(data);
      });
    }
  };
})

psApp.controller('AoptFileUploadController', function(ngProgress, $scope, $upload){
  ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'aopt'},
        file: file, 
      }).progress(function(evt) {
        ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
        // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        ngProgress.complete();
      });
    }
  };
})

psApp.controller('BoptFileUploadController', function(ngProgress, $scope, $upload){
  ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'bopt'},
        file: file, 
      }).progress(function(evt) {
        ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        ngProgress.complete();
      });
    }
  };
})

psApp.controller('CoptFileUploadController', function(ngProgress, $scope, $upload){
  ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'copt'},
        file: file, 
      }).progress(function(evt) {
        ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        ngProgress.complete();
      });
    }
  };
})

psApp.controller('DoptFileUploadController', function(ngProgress, $scope, $upload){
  ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'dopt'},
        file: file, 
      }).progress(function(evt) {
        ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        ngProgress.complete();
      });
    }
  };
})

psApp.controller('SolFileUploadController', function(ngProgress, $scope, $upload){
  ngProgress.color('#006600');
    $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/upload/img', 
        data: {type: 'sol'},
        file: file, 
      }).progress(function(evt) {
        ngProgress.set(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        ngProgress.complete();
      });
    }
  };
})
