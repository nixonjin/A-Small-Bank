let address = 'http://148.100.86.241:8082'; //IP address
// 弹出窗口控制（不用改动）
// recharge panel
function popRechargePanel(){
    var popPanel = document.getElementById("popRechargePanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "block";
    popPanel.style.display = "block";
}
function closeRechargePanel(){
    var popPanel = document.getElementById("popRechargePanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "none";
    popPanel.style.display = "none";
}
// withdrawal panel
function popWithdrawalPanel(){
    var popPanel = document.getElementById("popWithdrawalPanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "block";
    popPanel.style.display = "block";
}
function closeWithdrawalPanel(){
    var popPanel = document.getElementById("popWithdrawalPanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "none";
    popPanel.style.display = "none";
}
// transfer panel
function popTransferPanel(){
    var popPanel = document.getElementById("popTransferPanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "block";
    popPanel.style.display = "block";
}
function closeTransferPanel(){
    var popPanel = document.getElementById("popTransferPanel");
    var popLayer = document.getElementById("popLayer");
    popLayer.style.display = "none";
    popPanel.style.display = "none";
}
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
    window.location.href= address + "/login";
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
//angular部分
var homeApp = angular.module('homeApp', []);
homeApp.controller("homeMainController", function($scope, $http) {
    $scope.IPAddress = address;
    let param = window.location.search;
    let name = param.substring(6, param.length); //从url中得到用户名
    currentUserName = name;
    $scope.name = currentUserName;
    // $scope.balance = 0.00;
    // $scope.totalInvestMoney = 0.00;
    // $scope.totalMoney = $scope.balance + $scope.totalInvestMoney;
    // $scope.records = [{
    //     activity: "充值",
    //     money: "3,000.00",
    //     time: "2019-05-29 10:25:12"
    // },
    // {
    //     activity: "提现",
    //     money: "1,000.00",
    //     time: "2019-05-29 10:31:33",
    // }];
    // $scope.monthTExpend = 0.00;
    // $scope.monthTIncome = 0.00;
    //一开始便发送一次http得到用户的数据信息
    $http({
        method: 'POST',
        url: address+'/api/userInfo',
        data: {
            'name': name,
        }
    }).then(function success(res){
        console.log(res);
        $scope.balance = res.data.balance;
        $scope.totalInvestMoney = res.data.totalInvestMoney;
        $scope.totalMoney = $scope.balance + $scope.totalInvestMoney;
        $scope.records = res.data.records;
        $scope.monthTExpend = res.data.monthTExpend;
        $scope.monthTIncome = res.data.monthTIncome;
    }, function error(res){
        console.log(res);
    });
})

homeApp.controller('postSavMonCtrller', function($scope, $http) {
    console.log("1111111");
    $scope.postSavedMoney = function (){
        console.log("12222");
        $http({
            method: 'POST',
            url: address+'/api/deposit',
            data: {
                "name": currentUserName,
                "saveMoneyAmount": $scope.saveMoneyAmount, //传入要充值的金额
                // "activity": "充值",
                // "time": formatTime(new Date()),
            }          
        }).then(function success(res) {
            console.log("11111111111");
            console.log(res); 
        }, function error(res){
            console.log(res);
        });
    }
})

homeApp.controller('postWitMonCtrller', function($scope, $http) {
    $scope.postWithdrawnMoney = function (){
        $http({
            method: 'POST',
            url: address+'/api/withdraw',
            data: {
                "name": currentUserName,
                "withdrawMoneyAmount": $scope.withdrawMoneyAmount, //传入要提现的金额
                // "activity": "提现",
                // "time": formatTime(new Date()),
            }            
        }).then(function success(res) {
            console.log(res); 
        }, function error(res){
            console.log(res);
        });
    }
})

homeApp.controller('postTranMonCtrller', function($scope, $http) {
    $scope.postTransferedMoney = function (){
        $http({
            method: 'POST',
            url: address+'/api/transfer',
            data: {
                "name": currentUserName,
                "transferUserName": $scope.transferUser, //转账的用户名
                "amount": $scope.transferMoneyAmount,//转账的金额大小
                // "activity": "转账",
                // "time": formatTime(new Date()),
            }        
        }).then(function success(res) {
            console.log(res); 
        }, function error(res){
            console.log(res);
        });
    }
})
