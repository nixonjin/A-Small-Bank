var Product = require('./models/product')
var Account = require('./models/accout')
var Transaction = require('./models/transaction')

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // signup
    app.post('/api/signup',async function(req,res){
        console.log('begin sign up');

        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        var resData={
            code: 0,
            message: ''
        };
        if(userName == '' || userPwd == ''){
            console.log('用户名或密码不能为空');
            resData.code = 1;
            resData.message = '用户名或密码不能为空';
            res.json(resData);
            return;
        }
        var result = await Account.createUser(userName,userPwd)
        if(result){
            console.log('注册成功');
            resData.message = '注册成功';
        }else {
            console.log('该用户名已被注册，请更换用户名');
            resData.code = 2;
            resData.message = '该用户名已被注册，请更换用户名';
        }
        res.json(resData);
    })

    //login
    app.post('/api/login',async function(req,res){
        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        var resData={
            code: 0,
            message: ''
        };
        if(userName == '' || userPwd == ''){
            console.log('用户名或密码不能为空');
            resData.code = 1;
            resData.message = '用户名或密码不能为空';
            res.json(resData);
            return;
        }
        //查询数据库验证用户名和密码
        var userInfo = await Account.findUserInfo(userName,userPwd);
        if(userInfo==null){
            console.log('用户名或密码错误');
            resData.code = 2;
            resData.message = '用户名或密码错误';
            res.json(resData);
            return;
        }
        //验证通过则登录
        console.log('登录成功');
        resData.message = '登录成功';
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.name
        };
        //使用req.cookies的set方法把用户信息发送cookie信息给浏览器，浏览器将cookies信息保存，再次登录浏览器会将cookies信息放在头部发送给你服务端，服务端验证登录状态
        req.cookies.set('userInfo',JSON.stringify({
            _id: userInfo._id,
            username: userInfo.name
        }));
        res.json(resData);
        return;

    })

    //logout
    app.get('/api/logout',function(req,res){
        //清除cookie
        console.log('登出成功');
        var resData={
            code: 0,
            message: ''
        };
        req.cookies.set('userInfo',null);
        resData.message = '登出成功';
        res.json(resData);
    })

    //get userInfo 包括所有的存款投资金额，交易记录等个人首页的信息
    app.post('/api/userInfo',async function(req,res){
        var userId = req.body._id;

        Account.products.push(Product);
        var userInfo = await Account.findUserInfo(userId);

        var transactions = await Transaction.findTsById(userId);

        userInfo.transactions = transactions;

        res.json(userInfo);
    })

    //deposit
    app.post('api/deposit',function(req,res){

    })

    //withdraw
    app.get("api/withdraw",function(res,res){

    })

    //buyProduct
    app.post('api/buyProduct',function(req,res){

    })


    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            value: req.body.value,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
