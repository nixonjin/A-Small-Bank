let address = 'http://127.0.0.1:8080';
var app = angular.module('loginApp', []);
app.controller('loginCtrl',function($scope, $http){
    $scope.isValid = true;
    $scope.login = function(){
        // let name = $scope.userName;
        // if(($scope.userName === 'abc' && $scope.userPwd === '123') || (
        //     $scope.userName === 'def' && $scope.userPwd === '456')) {
        //     $scope.isValid = true;
        //     window.location.href="../home/home.html?name=" + $scope.userName;
        // }
        // else{
        //     $scope.isValid = false;
        // }
        $http({
        method: 'POST',
        url: address + '/api/login',
        data: {
            'name': $scope.userName,
            'userPwd':$scope.userPwd
        }
        }).then(function success(res){
            console.log(res.data.message);
            // let realPwd = res.data.pwd; //实际的正确密码
            console.log("enter ");
            console.log($scope.userName+"0000000");
            
            if(res.data.code==0){
                $scope.isValid = true;
                window.location.href = address + "/home?name=" + $scope.userName;
                // $http({
                //     method:'GET',
                //     url:'http://127.0.0.1:8080/home/home.html',
                //     data: {
                //         'name': $scope.userName,
                //     }
                // }).then(function success(res){
                //     console.log(res);
                //     console.log('hhhhhhh');
                // })
            }
        }, function error(res){
            console.log(res);
            console.log("111111111111");
        })
    }
})