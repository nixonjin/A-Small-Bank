var mongoose = require("mongoose");
var Product = require('./models/product');
var Account = require('./models/accout');
var Transaction = require('./models/transaction');


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
        var result = await Account.createUser(userName,userPwd);
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

        //Account.products.push(Product);
        var userInfo = await Account.findUserAllInfo(userId);
        console.log('account------------------------')
        console.log(userInfo);


        var transactions = await Transaction.findTsByName(userinfo.name);
        console.log('transactions----------------------------------------');
        console.log(transactions);

        userInfo.transactions = transactions;

        res.json(userInfo);
    })


    //deposit
    app.post('api/deposit', async function (req, res) {

        let property = 0;
        await Account.find({name: req.body.name}, function (err, docs) {
            property = docs.property;
            console.log(property+  "  deposit");
        });
        await Account.update({
                name: req.body.name
            },
            {
                $set:{property: property + req.body.saveMoneyAmount}
            }, function (err, docs) {
                if (err)
                    res.send(err);
        });
        res.status = 200;
        res.body = "success";
    });

    //withdraw
    app.get("api/withdraw",async function(req,res){
        //withdraw
        var conditions = {name: req.body.name};
        let preProperty=0;
        await Account.find(conditions,function (error,docs) {
            if (error){
                console.error(error);
            }else{
                preProperty=docs.property;
            }
        });
        var updates = {$set: {property: preProperty-req.body.withdrawMoneyAmount}};//修改存款
        Account.update(conditions, updates, function (error) {
            if (error) {
                console.error(error);
                res.status = 503;
                res.body = "fail";
            } else {
                console.error("取款成功");
                res.status = 200;
                res.body = "success";
            }
        });

    });

    //buyProduct

    app.post('/api/buyProduct',async function(req,res){
        let product =null;
        await  Product.findOne({name:req.body.productName},function (err,docs) {
            if(err) console.log("error");
            if(!docs){
            console.log('docs----------------------------------------');
            console.log(docs);
                Product.create({
                    productId: new mongoose.Schema.Types.ObjectId(),//产品id
                    name: req.body.productName,//产品名称
                    time: 60,//持续天数
                    profit: 0.01,//利率
                    buyers:[{}]
                })
            }
            else{
                product = docs;
                console.log(product);
            }
        });
        await Account.find({name:req.body.name},function (err,docs) {
          if(err)console.log("error");
          docs[0].products.push(product);
        });

        await Transaction.create({
            mainAccountName: req.body.name,//用户id
            type: 4,//操作类型，只有定期存款，活期存款，取出，转账四种
            secondAccountName: null,//如果是转账则记录目标账户的id
            money: req.body.saveMoneyAmount,//金额
            time: req.body.time//日期
        },function (err,docs){
            //console.log('docs----------------------------------------');
            //console.log(docs);
            if(err)console.log(err);
        }
        );
        res.status=200;
        res.json({msg:"success"});
    });

    //sellProduct
    app.post('api/sellProduct',async function (req,res){
            let product =null;
            await  Product.findOne({name:req.body.productName},function (err,docs) {
                if(err) console.log("error");
                if(!docs){
                    res.send({msg:"no this product"})
                }
                else{
                    product = docs;
                    console.log(product);
                }
            });
            await Account.find({name:req.body.name},function (err,docs) {
                if(err)console.log("error");
                for(let i = 0; i<docs.product.length;i++){
                    if(docs.product[i].name === product.name){
                        docs.product.slice(i,1);
                        break;
                    }
                }
                docs.save(function (err) {
                    if (err) return handleError(err);
                });
            });

            await Transaction.create({
                    recordId: new mongoose.Schema.Types.ObjectId(),//记录id
                    mainAccountName: req.body.name,//用户id
                    type: 4,//操作类型，只有定期存款，活期存款，取出，转账四种
                    secondAccountName: null,//如果是转账则记录目标账户的id
                    money: req.body.saveMoneyAmount,//金额
                    time: req.body.time//日期
                },function (err,docs){
                    if(err)console.log("err");
                }
            )
            res.status=200;
            res.json({msg:"success"});
    }
    );



    //转账
    app.post("api/transfer", async function (req, res) {
        let session = mongoose.startSession({readPreference: {mode: "primary"}});
        let preProperty1 = 0,preProperty2=0;
        await Account.find({name: req.body.name}, function (err, dosc) {
            console.log(name);
            preProperty1 = dosc.property;
            console.log(preProperty1)
            if (err) {
                console.log("error");
            }
        });
        await Account.find({name: req.body.name}, function (err, dosc) {
            console.log(name);
            preProperty2 = dosc.property;
            console.log((preProperty2));
            if (err) {
                console.log("error");
            }
        });
        await Account.updateOne({name: req.body.name}, {property: preProperty1-req.body.amount});
        await Account.updateOne({name:req.body.transferUserName},{property:preProperty2+req.body.amount});
        await Transaction.create({
            recordId: new mongoose.Schema.Types.ObjectId(),//记录id
            mainAccountName: req.body.name,//用户id
            type: 3,//操作类型，只有定期存款，活期存款，取出，转账四种
            secondAccountName: req.body.transferUserName,//如果是转账则记录目标账户的id
            money: req.body.amount,//金额
            time: req.body.time//日期
        });
        try{
            await commitWithRetry(session);
        }catch (e) {
            await session.abortTransaction();
            res.status = 503;
            res.body = "fail";
        }
        res.status = 200 ;
        res.body = "success";
    });


    async function commitWithRetry(session) {
        try {
            await session.commitTransaction();
            console.log('Transaction committed.');
        } catch (error) {
            if (
                error.errorLabels &&
                error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
            ) {
                console.log('UnknownTransactionCommitResult, retrying commit operation ...');
                await commitWithRetry(session);
            } else {
                console.log('Error during commit ...');
                throw error;
            }
        }
    }



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
