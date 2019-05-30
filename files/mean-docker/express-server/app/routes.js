var mongoose = require("mongoose");
var Product = require('./models/product');
var Account = require('./models/accout');
var Transaction = require('./models/transaction');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    //login
    app.post('api/login',function(req,res){

    });

    //get userInfo 包括所有的存款投资金额，交易记录等个人首页的信息
    app.get('api/userInfo',async function(req,res){


    });

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
    app.post('api/buyProduct',async function(req,res){
        let product =null;
        await  Product.findOne({name:req.body.productName},function (err,docs) {
            if(err) console.log("error");
            if(!docs){
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
          docs.product.push(product);
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
