var app = angular.module('loginApp', []);
app.controller('loginCtrl',function($scope, $http){
    $scope.isValid = true;
    $scope.login = function(){
        if(($scope.userName === 'abc' && $scope.userPwd === '123') || (
            $scope.userName === 'def' && $scope.userPwd === '456')) {
            $scope.isValid = true;
            window.location.href="../home/home.html?name=" + $scope.userName;
        }
        else{
            $scope.isValid = false;
        }
        // $http({
        // method: 'GET',
        // // url: 'localhost/xxxx/xxxx'
        // params: {
        //     'name': $scope.userName,
        // }
        // }).then(function success(res){
        //     let realPwd = res.data.pwd; //实际的正确密码
        //     if($scope.userPwd === realPwd){
        //         $scope.isValid = true;
        //         window.location.href="../home/home.html?name=" + name;
        //  }
        //     else{
        //         $scope.isValid=false;
        //     }
        // }, function error(res){
        //     console.log(res);
        // })
    }
})