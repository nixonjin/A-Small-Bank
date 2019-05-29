var Todo = require('./models/todo');
var Product = require('./models/product')
var Account = require('./models/accout')
var Transaction = require('./models/transaction')

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

    })

    //get userInfo 包括所有的存款投资金额，交易记录等个人首页的信息
    app.get('api/userInfo',function(req,res){

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
