var sampleApp = angular.module('taskApp', ['ngRoute']);

sampleApp.config(function ($routeProvider) {
    $routeProvider
        .when('/Tasks', {
            templateUrl: 'views/tasks.html',
            controller: 'TasksController'
        })
        .when('/Tasks/:id', {
            templateUrl: 'views/confirm.html',
            controller: 'TasksController'
        })
        .when('/Dashboard/:taskId', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/Owner', {
            templateUrl: 'views/owner.html'
        })

});

sampleApp.service('taskService', function () {
    this.tasks = [
        { id: 1, Name: "Task #1", Description: "Update Landing Page Title" },
        { id: 2, Name: "Task #2", Description: "Create Login Module" },
        { id: 3, Name: "Task #3", Description: "Merge latest changes to master" },
        { id: 4, Name: "Task #4", Description: "Test Login Module" }
    ]
});

sampleApp.service('menuListService', function () {
    this.menuItems = ['Home', 'Tasks', 'Owner'];
})

sampleApp.service('userService', function () {
    this.currentUser = {};

    this.getCurrentUser = function () {
        return this.currentUser;
    }

    this.setCurrentUser = function (userName, walletAddress) {
        this.currentUser.userName = userName;
        this.currentUser.walletAddress = walletAddress;
    }
})

