sampleApp.controller('TasksController', ['$scope', '$routeParams', 'taskService', 'userService', function ($scope, $routeParams, taskService, userService) {
    $scope.completeTasksList = taskService.tasks;
    $scope.taskId = $routeParams.id;
    $scope.user = {}
    $scope.contributeTask = function () {
        userService.setCurrentUser($scope.user.username, $scope.user.walletAddress);
    }
}]);