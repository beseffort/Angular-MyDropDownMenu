(function (window, angular) {
  'use strict';

  var menu = angular.module('myDropDownMenu', []);

  menu.run(['$templateCache', function ($templateCache) {
    $templateCache.put('myDropDownMenu/templates/dropdownMenu.html', [
      '<ul class="dropdown">',
      '<li ng-repeat="item in dropdownMenu"',
      ' class="dropdown-item"',
      ' dropdown-item-label="labelField"',
      ' dropdown-menu-item="item">',
      '</li>',
      '</ul>'
    ].join(''));

    $templateCache.put('myDropDownMenu/templates/dropdownMenuItem.html', [
      '<li ng-class="{divider: dropdownMenuItem.divider, \'divider-label\': dropdownMenuItem.divider && dropdownMenuItem[dropdownItemLabel]}">',
      '<a href="" class="dropdown-item"',
      ' ng-if="!dropdownMenuItem.divider"',
      ' ng-href="{{dropdownMenuItem.href}}"',
      ' ng-click="selectItem()">',
      '{{dropdownMenuItem[dropdownItemLabel]}}',
      '</a>',
      '<span ng-if="dropdownMenuItem.divider">',
      '{{dropdownMenuItem[dropdownItemLabel]}}',
      '</span>',
      '</li>'
    ].join(''));

    $templateCache.put('myDropDownMenu/templates/dropdownMenuWrap.html',
      '<div class="wrap-dd-menu" ng-class="{\'disabled\': dropdownDisabled}"></div>'
    );
  }]);

  menu.directive('dropdownMenu', ['$parse', '$compile', 'DropdownService', '$templateCache',
    function ($parse, $compile, DropdownService, $templateCache) {
      return {
        restrict: 'A',
        replace: false,
        scope: {
          dropdownMenu: '=',
          dropdownModel: '=',
          dropdownItemLabel: '@',
          dropdownOnchange: '&',
          dropdownDisabled: '='
        },

        controller: ['$scope', '$element', function ($scope, $element) {
          $scope.labelField = $scope.dropdownItemLabel || 'text';

          var $template = angular.element($templateCache.get('myDropDownMenu/templates/dropdownMenu.html'));
          // Attach this controller to the element's data
          $template.data('$dropdownMenuController', this);

          var tpl = $compile($template)($scope);
          var $wrap = $compile(
            angular.element($templateCache.get('myDropDownMenu/templates/dropdownMenuWrap.html'))
          )($scope);

          $element.replaceWith($wrap);
          $wrap.append($element);
          $wrap.append($template);

          DropdownService.register(tpl);

          this.select = function (selected) {
            if (!angular.equals(selected, $scope.dropdownModel)) {
                $scope.dropdownModel = selected;
            }
            $scope.dropdownOnchange({
              selected: selected
            });
          };

          $element.bind('click', function (event) {
            event.stopPropagation();
            if (!$scope.dropdownDisabled) {
              DropdownService.toggleActive(tpl);
            }
          });

          $scope.$on('$destroy', function () {
            DropdownService.unregister(tpl);
          });
        }]
      };
    }
  ]);

  menu.directive('dropdownMenuItem', [
    function () {
      return {
        require: '^dropdownMenu',
        replace: true,
        scope: {
          dropdownMenuItem: '=',
          dropdownItemLabel: '='
        },

        link: function (scope, element, attrs, dropdownMenuCtrl) {
          scope.selectItem = function () {
            if (scope.dropdownMenuItem.href) {
              return;
            }
            dropdownMenuCtrl.select(scope.dropdownMenuItem);
          };
        },

        templateUrl: 'myDropDownMenu/templates/dropdownMenuItem.html'
      };
    }
  ]);

  menu.factory('DropdownService', ['$document',
    function ($document) {
      var body = $document.find('body'),
        service = {},
        _dropdowns = [];

      body.bind('click', function () {
        angular.forEach(_dropdowns, function (el) {
          el.removeClass('active');
        });
      });

      service.register = function (ddEl) {
        _dropdowns.push(ddEl);
      };

      service.unregister = function (ddEl) {
        var index;
        index = _dropdowns.indexOf(ddEl);
        if (index > -1) {
          _dropdowns.splice(index, 1);
        }
      };

      service.toggleActive = function (ddEl) {
        angular.forEach(_dropdowns, function (el) {
          if (el !== ddEl) {
            el.removeClass('active');
          }
        });

        ddEl.toggleClass('active');
      };

      service.clearActive = function () {
        angular.forEach(_dropdowns, function (el) {
          el.removeClass('active');
        });
      };

      service.isActive = function (ddEl) {
        return ddEl.hasClass('active');
      };

      return service;
    }
  ]);
})(window, window.angular);
