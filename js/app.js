var app = angular.module('app', ['myDropDownMenu']);

app.controller('AppCtrl', function($scope) {

  $scope.MenuOptions = [    
    {
      text: 'MenuItem1'
    }, 
    {
      text: 'MenuItem2'
    }, 
    {
      divider: true
    }, 
    {
      text: 'A link',
      href: 'http://www.google.com'
    }
  ];

  $scope.MenuSelected = {};

});
