var mongoose = require("mongoose");
var Product = require('./models/product');
var Account = require('./models/accout');
var Transaction = require('./models/transaction');
var ProductRecord = require('./models/productRecord');


module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // signup
    app.post('/api/signup', async function (req, res) {
        console.log('begin sign up');
        //console.log(req.body.userName)
        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        var resData = {
            code: 0,
            message: ''
        };
        if (userName == '' || userPwd == '') {
            console.log('用户名或密码不能为空');
            resData.code = 1;
            resData.message = '用户名或密码不能为空';
            res.json(resData);
            return;
        }
        var result = await Account.createUser(userName, userPwd);
        if (result) {
            console.log('注册成功');
            resData.message = '注册成功';
        } else {
            console.log('该用户名已被注册，请更换用户名');
            resData.code = 2;
            resData.message = '该用户名已被注册，请更换用户名';
        }
        res.json(resData);
    })

    //login
    app.post('/api/login', async function (req, res) {
        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        var resData = {
            code: 0,
            message: ''
        };
        if (userName == '' || userPwd == '') {
            console.log('用户名或密码不能为空');
            resData.code = 1;
            resData.message = '用户名或密码不能为空';
            res.json(resData);
            return;
        }
        //查询数据库验证用户名和密码
        var userInfo = await Account.findUserInfo(userName, userPwd);
        if (userInfo == null) {
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
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.name
        }));
        res.json(resData);
        return;

    })


    //logout
    app.get('/api/logout', function (req, res) {
        //清除cookie
        console.log('登出成功');
        var resData = {
            code: 0,
            message: ''
        };
        req.cookies.set('userInfo', null);
        resData.message = '登出成功';
        res.json(resData);
    })

    //get userInfo 包括所有的存款投资金额，交易记录等个人首页的信息
    app.post('/api/userInfo', async function (req, res) {
        var userId = req.body._id;

        // Account.products.push(Product);
        var userInfo = await Account.findUserAllInfo(userId);

        // var transactions = await Transaction.findTsById(userId);

        // userInfo.transactions = transactions;

        res.json(userInfo);
    })


    //deposit
    app.post('/api/deposit', async function (req, res) {

        console.log("enter deposit")
        await Account.findOne({ name: req.body.name }, function (error, docs) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(docs + "1");
                docs.property = parseInt(docs.property) + req.body.saveMoneyAmount;
                docs.save(function (err, docs) {
                    if (err) console.log(err);
                    else console.log("2");
                });
            }
        });

        //测试查看结果用
        await Account.findOne({ name: req.body.name }, function (error, docs) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(docs + "3");
            }
        });

        await Transaction.create({
            mainAccountName: req.body.name,//用户名字
            type: '存款',//操作类型，只有取出，存款，转账1，转账2，买入，卖出六种
            secondAccountName: null,//如果是转账则记录目标账户的名字
            money: req.body.saveMoneyAmount,//金额
            // time: req.body.time//日期
        }, function (err, docs) {
            if (err) { console.log("err"); res.send("error") };
        }
        );
        res.status = 200;
        res.json({ msg: "success" });
    });

    //withdraw
    app.post("/api/withdraw", async function (req, res) {

        console.log("enter withdraw")
        await Account.findOne({ name: req.body.name }, function (error, docs) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(docs + "1");
                docs.property = parseInt(docs.property) - req.body.withdrawMoneyAmount;
                docs.save(function (err, docs) {
                    if (err) console.log(err);
                    else console.log("2");
                });
            }
        });
        //测试查看结果用
        await Account.findOne({ name: req.body.name }, function (error, docs) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(docs + "3");
            }
        });

        await Transaction.create({
            mainAccountName: req.body.name,//用户名字
            type: '取款',//操作类型，只有取出，存款，转账1，转账2，买入，卖出六种
            secondAccountName: null,//如果是转账则记录目标账户的名字
            money: req.body.withdrawMoneyAmount,//金额
            // time: req.body.time//日期
        }, function (err, docs) {
            if (err) { console.log("err"); res.send("error") };
        }
        );
        res.status = 200;
        res.json({ msg: "success" });

    });


    //buyProduct
    app.post('/api/buyProduct', async function (req, res) {
        let pro=0;
        await Account.findOne({ "name": req.body.name }, function (err, docs) {
            console.log(docs+"amount accout");
            if (err) console.log(err);
            else if (docs != null) {
                console.log("222222");
                pro = docs.property;
                console.log(pro);
                console.log(docs.property);
                if((pro - req.body.buyMoneyAmount)>=0){
                    console.log("33333333333");
                docs.property = docs.property - req.body.buyMoneyAmount;
                docs.investAmount = docs.investAmount + req.body.buyMoneyAmount;
                docs.save(function(err,docs){
                    if(err)console.log(err);
                });
                }
            }
        });
        console.log(pro);
        if((pro - req.body.buyMoneyAmount)>=0){
            console.log("enter buy=== ");
        await ProductRecord.findOne({ $and: [{ "name": req.body.productName }, { "ownerName": req.body.name }] },
            function (err, docs) {
                if (err) console.log(err);
                else {
                    if (docs != null) {
                        console.log(docs.money);
                        console.log(docs+"hhhhhhhhhhhh");
                        docs.money = docs.money + req.body.buyMoneyAmount;
                        docs.save(function (err, docs) {
                            if (err) console.log(err);
                        });
                    }
                    else {
                        ProductRecord.create({
                            name: req.body.productName,//产品名称
                            money: req.body.buyMoneyAmount,//产品价格
                            time: 60,//持续天数
                            profit: 0.05,//利率
                            ownerName: req.body.name
                        });
                    }
                }
            });
        await Transaction.create({
            mainAccountName: req.body.name,//用户名字
            type: '买入',//操作类型，只有取出，存款，转账，买入，卖出5种
            secondAccountName: null,//如果是转账则记录目标账户的名字
            money: req.body.buyMoneyAmount,//金额
            // time: req.body.time//日期
        }, function (err, docs) {
            if (err) { console.log(err); res.send("error") };
        }
        );
        }
        res.status = 200;
        res.json({ msg: "success" });

        console.log("------------------------------------------")
        console.log("productRecord");
        await ProductRecord.find(function (err, docs) {
            console.log(docs);
        });
        console.log("------------------------------------------")
        console.log("Account");
        await Account.find({ "name": req.body.name }, function (err, docs) {
            console.log(docs);
        })

    });

    //sellProduct
    app.post('/api/sellProduct', async function (req, res) {
        let product = null;
        await ProductRecord.findOne({ $and: [{ "name": req.body.productName }, { "ownerName": req.body.name }] },
            function (err, docs) {
                if (err) console.log(err);
                else {
                    if (docs != null) {
                        product=docs;
                        console.log(docs+"aaaaaaaa");
                        if (docs.money - req.body.sellMoneyAmount >= 0)
                        {docs.money = docs.money - req.body.sellMoneyAmount;
                            docs.save(function (err, docs) {
                                if (err) console.log(err);
                            });
                        }
                        else {
                            res.status = 300;
                            res.json({ msg: "操作不合法401！" })
                        }
                    }
                    else {
                        res.status = 300;
                        res.json({ msg: "操作不合法402" })
                    }
            }
            });
        console.log(product+"111111111111111111111111");
        await Account.findOne({ "name": req.body.name }, function (err, docs) {
            if (err) console.log(err);
            else if (docs != null&&product!=null&&(product.money-req.body.sellMoneyAmount)>=0) {
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhh");
                docs.property = docs.property + req.body.sellMoneyAmount*(1+product.profit);
                docs.investAmount = docs.investAmount - req.body.sellMoneyAmount;
                docs.save(function (err, docs) {
                    if (err) console.log(err);
                });
            }
        });
        let sellAmount =req.body.sellMoneyAmount*(1+product.profit);
        await Transaction.create({
            mainAccountName: req.body.name,//用户名字
            type: '卖出',//操作类型，只有取出，存款，转账，买入，卖出六种
            secondAccountName: null,//如果是转账则记录目标账户的名字
            money: sellAmount,//金额
            // time: req.body.time//日期
        }, function (err, docs) {
            if (err) { console.log(err); res.send("error") };
        }
        );
        res.status = 200;
        res.json({ msg: "success" });

        console.log("------------------------------------------")
        console.log("productRecord");
        await ProductRecord.find(function (err, docs) {
            console.log(docs);
        });
        console.log("------------------------------------------")
        console.log("Account");
        await Account.find({ "name": req.body.name }, function (err, docs) {
            console.log(docs);
        })
    }
    );



    //转账
    app.post("/api/transfer", async function (req, res) {
        console.log("enter transfer");
        await Account.findOne({ name: req.body.name }, function (err, dosc) {
            if (err) console.log("error");
            dosc.property = dosc.property - req.body.amount;
            dosc.save(function (err, dosc) {
                if (err) console.log(err);
            })
        });
        await Account.findOne({ name: req.body.transferUserName }, function (err, dosc) {
            if (err) console.log("error");
            if (dosc != null) {
                dosc.property = dosc.property + req.body.amount;
                dosc.save(function (err, dosc) {
                    if (err) console.log(err);
                });
            } else {
                res.status = 300;
                res.body = "没有该用户";
            }

        });
        await Transaction.create([{
            mainAccountName: req.body.name,//用户id
            type: '转出',//操作类型，只有取出，存款，转账，被转账，买入，卖出6种
            secondAccountName: req.body.transferUserName,//如果是转账则记录目标账户的id
            money: req.body.amount,//金额
            // time: req.body.time//日期
            },
            {
            mainAccountName: req.body.transferUserName,//用户id
            type: '转入',//操作类型，只有取出，存款，转账，被转账，买入，卖出6种
            secondAccountName: req.body.name,//如果是转账则记录目标账户的id
            money: req.body.amount,//金额
            }]);
        // try {
        //     await commitWithRetry(session);
        // } catch (e) {
        //     await session.abortTransaction();
        //     res.status = 503;
        //     res.body = "fail";
        // }
        console.log("end");
        res.status = 200;
        // res.body = {msg:"success"};
        res.json({ msg: "success" });
        console.log("------------------------------------------")
        console.log("Account");
        await Account.find({ "name": req.body.name }, function (err, docs) {
            console.log(docs);
        })
        //res.end();
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
