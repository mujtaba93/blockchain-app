sampleApp.controller('HomeController', ['$scope', 'menuListService', 'taskService', function ($scope, menuListService, taskService) {
    $scope.menuItems = menuListService.menuItems;
    $scope.activeMenu = $scope.menuItems[0];
    $scope.setActive = function (item) {
        $scope.activeMenu = item;
    }
    $scope.length = Object.keys(taskService.tasks).length;
}]);