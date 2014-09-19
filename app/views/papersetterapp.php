<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Paper Setter</title>
  <link rel="stylesheet" type="text/css" href="assets/css/main.css">
</head>

<body ng-app = 'psApp'>
<div id="flash" style="color:red;" >
                      {{ flash }}
</div>
<div ui-view></div>

  <script src='http://codepen.io/assets/libs/fullpage/jquery.js'></script>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.8/angular-ui-router.min.js"></script>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-sanitize.min.js"></script>
  <script src="assets/js/app.js"></script>
    <script>
    angular.module("psApp").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');
  </script>

</body>

</html>