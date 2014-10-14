<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
  <meta charset="UTF-8">
  <title>Paper Setter</title>
  <link rel="stylesheet" type="text/css" href="assets/css/main.css">
  <link rel="stylesheet" type="text/css" href="assets/css/ngProgress.css">
  <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
</head>

<body ng-app = 'psApp' ng-cloak>
<div id="flash" style="color:red;" >
                      {{ flash }}
</div>

<div ui-view></div>

<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
  <script src='http://codepen.io/assets/libs/fullpage/jquery.js'></script>
  <script type="text/javascript" src='assets/js/angular-file-upload-html5-shim.min.js'></script>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.8/angular-ui-router.min.js"></script>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-sanitize.min.js"></script>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-cookies.min.js"></script>
    <script src="assets/js/app.js"></script>
  <script type="text/javascript" src="assets/js/angular-file-upload.min.js"></script>
  <script type="text/javascript" src="assets/js/ngProgress.min.js"></script>

    <script>

    angular.module("psApp").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');
  </script>

</body>

</html>