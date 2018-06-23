sampleApp.controller('DashboardController', ['$scope', '$routeParams', 'taskService', 'userService', function ($scope, $routeParams, taskService, userService) {


    // Function to convert Hex values to ASCII
    function hex2ascii(hex) {
        var hex = hex.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str.replace(/\0/g, '');
    };

    //---------- Contract invocation using web3 -------------------------------
    var web3Client = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


    // #################### REPLACE it with your ABI #############################
    var TokenABI = '[ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "contributorDetails", "outputs": [ { "name": "userName", "type": "bytes32" }, { "name": "tokensCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "contributorList", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [ { "name": "contributorAdd", "type": "address" }, { "name": "name", "type": "bytes32" }, { "name": "taskName", "type": "uint256" } ], "name": "createContributor", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "contributorAdd", "type": "address" }, { "name": "taskName", "type": "uint256" } ], "name": "addTask", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_walletAdd", "type": "address" }, { "name": "taskName", "type": "uint256" } ], "name": "isContributed", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_walletAdd", "type": "address" } ], "name": "validContributor", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "contributorAdd", "type": "address" } ], "name": "getContributorDetails", "outputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" } ]';
    var ContractABI = JSON.parse(TokenABI);


    // #################### REPLACE it with your Address #############################
    var TokenContractAddress = '0x825fc2c2486281594167bcf41e6987ddf1ce29a0';

    var TokenContract = web3Client.eth.contract(ContractABI);
    var TokenContractInstance = TokenContract.at(TokenContractAddress);

    //---------- Create Task Objects, Get User Details -------------------------------
    $scope.taskList = taskService.tasks;
    $scope.userDetails = userService.getCurrentUser();
    $scope.taskId = $routeParams.taskId;
    $scope.errorMessage = "You have already contributed for this task";

    $scope.displayDetails = function () {
        $scope.walletAddress = $scope.userDetails.walletAddress;
        $scope.userName = $scope.userDetails.userName;
        $scope.taskName = $routeParams.taskId;
        if (!TokenContractInstance.validContributor($scope.userDetails.walletAddress)) {
            console.log("Invalid User, Registering ");
            console.log($scope.taskName);
            $scope.createNewContributor();
            $scope.transferBalance();
        }
        else {
            console.log("Already Registered");
            if (!TokenContractInstance.isContributed($scope.userDetails.walletAddress, $scope.taskName)) {
                $scope.addNewTask();
                $scope.transferBalance();
                $scope.hideErrorMsg = false;
            }
            else {
                $scope.hideErrorMsg = true;
            }
        }
        $scope.getContributorDetails();
    }

    $scope.createNewContributor = function () {
        try {
            // Invoking contract function to create new contributor
            TokenContractInstance.createContributor($scope.walletAddress,
                $scope.userName, $scope.taskName,
                { from: web3Client.eth.accounts[0], gas: 2000000 });
        }
        catch (err) {
            console.log(err.message);
        }
    };

    $scope.addNewTask = function () {
        TokenContractInstance.addTask($scope.walletAddress, $scope.taskName, { from: web3Client.eth.accounts[0], gas: 2000000 });
    }
    $scope.transferBalance = function () {
        TokenContractInstance.transfer($scope.walletAddress, { from: web3Client.eth.accounts[0], gas: 2000000 });
    };

    $scope.getContributorDetails = function () {
        $scope.contributorObj = {}
        try {
            $scope.contributorDetails = TokenContractInstance.getContributorDetails($scope.walletAddress,
                { from: web3Client.eth.accounts[0], gas: 2000000 });
            $scope.contributorObj.username = hex2ascii($scope.contributorDetails[0]);
            $scope.contributorObj.taskList = $scope.contributorDetails[1];
            $scope.contributorObj.tokenBalance = $scope.contributorDetails[2].toString(10);

            for (var i = 0; i < $scope.contributorObj.taskList.length; i++) {
                $scope.contributorObj.taskList[i] = $scope.contributorObj.taskList[i].toString(10);
            }
            // Converting Task List array to number, since it is in string
            $scope.contributorObj.taskList = $scope.contributorObj.taskList.map(Number);
            userService.setCurrentUser($scope.contributorObj.username, $scope.walletAddress);
        }
        catch (err) {
            console.log(err.message);
        }
    };

    // Filter completed tasks by contributor
    $scope.filterCompletedTasks = function (e) {
        return $scope.contributorObj.taskList.indexOf(e.id) !== -1;
    }

}]);
