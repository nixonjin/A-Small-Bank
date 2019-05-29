// user menu list
function showUserMenuList(){
    var menuList = document.getElementById("user-menu-list");
    var avatar = document.getElementsByClassName("avatar-container")[0];
    avatar.style.backgroundColor =  "#282828";
    menuList.style.display = "block";
}
function closeUserMenuList(){
    var menuList = document.getElementById("user-menu-list");
    var avatar = document.getElementsByClassName("avatar-container")[0];
    avatar.style.backgroundColor = "transparent";
    menuList.style.display = "none";
}
// 用户退出
function userQuit(){
    window.location.href="../login/login.html";
}

var saveMoneyBtn = document.getElementById('saveMoneyBtn');
var saveMoneyDiv = document.getElementById('saveMoneyDiv');
var saveMoneyConfirm = document.getElementById("saveMoneyConfirm");
var saveMoneyCancel = document.getElementById("saveMoneyCancel");
var withdrawMoneyBtn = document.getElementById('withdrawMoneyBtn');
var withdrawMoneyDiv = document.getElementById('withdrawMoneyDiv');
var withdrawMoneyConfirm = document.getElementById('withdrawMoneyConfirm');
var withdrawMoneyCancel = document.getElementById('withdrawMoneyCancel');

saveMoneyBtn.onclick = function show(){
    if(withdrawMoneyDiv.style.display == 'block'){
        withdrawMoneyDiv.style.display = 'none';
    }
    saveMoneyDiv.style.display = "block";
}

saveMoneyConfirm.onclick = function close(){
    saveMoneyDiv.style.display = "none";
}

saveMoneyCancel.onclick = function close(){
    saveMoneyDiv.style.display = "none";
}

withdrawMoneyBtn.onclick = function show(){
    if(saveMoneyDiv.style.display == 'block'){
        saveMoneyDiv.style.display = 'none';
    }
    withdrawMoneyDiv.style.display = "block";
}

withdrawMoneyConfirm.onclick = function close(){
    withdrawMoneyDiv.style.display = "none";
}

withdrawMoneyCancel.onclick = function close(){
    withdrawMoneyDiv.style.display = "none";
}
//时间处理函数
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//记录当前用户名
let currentUserName = '';

var financialApp = angular.module("financialApp", []);
financialApp.controller("financialMainController", function($scope) {
    let param = window.location.search;
    let name = param.substring(6, param.length); //从url中得到用户名
    currentUserName = name;
    $scope.name = currentUserName;
    $scope.totalInvest = 100.00;
    $scope.totalProfit = 10.00;
    $scope.totalInvestMoney = $scope.totalInvest + $scope.totalProfit;
    $scope.investRecords = [{
        productName: '60天定期',
        money: '+3,000.00',
        time: '2019-5-28 16:01:34'
    },{
        productName:'60天定期',
        money: '-3,000.00',
        time: '2019-5-28 16:02:12'
    }];
    //一开始便发送一次http得到用户的数据信息
    // $http({
    //     method: 'GET',
    //     url: 'localhost/xxxx/xxxx'
    //     params: {
    //         'name': name,
    //     }
    // }).then(function success(res){
    //     $scope.totalInvest = res.data.totalInvest;
    //     $scope.totalProfit = res.data.totalProfit;
    //     $scope.totalMoney = $scope.totalInvest + $scope.totalProfit;
    //     $scope.investRecords = res.data.investRecords;
    // }, function error(res){
    //     console.log(res);
    // });
})

financialApp.controller('saveMoneyController', function($scope){
    $scope.onSaveMoneyConfirm = function() {
        $http({
            method: 'POST',
            url: 'localhost/xxxx/xxxx',
            data: {
                "name": currentUserName,
                "productName": "60天定期", //产品名
                "saveMoneyAmount": $scope.saveMoneyAmount, //转入金额大小
                "time": formatTime(new Date()),
            }          
        }).then(function success(res) {
            console.log(res); 
        }, function error(res){
            console.log(res);
        });
    }
})

financialApp.controller('withdrawMoneyController', function($scope){
    $scope.onWithdrawMoneyConfirm = function() {
        $http({
            method: 'POST',
            url: 'localhost/xxxx/xxxx',
            data: {
                "name": currentUserName,
                "productName": "60天定期", //产品名
                "withdrawMoneyAmount": $scope.withdrawMoneyAmount, //转入金额大小
                "time": formatTime(new Date()),
            }          
        }).then(function success(res) {
            console.log(res); 
        }, function error(res){
            console.log(res);
        });
    }
})