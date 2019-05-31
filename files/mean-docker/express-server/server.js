// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8082; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Cookies = require('cookies'); //加载cookies模块

// configuration ===============================================================
//mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
mongoose.connect(database.localUrl);



app.use(express.static('./public/login')); 		// set the static files location /public/img will be /img for users
app.use(express.static('./public/home'));
app.use(express.static('./public/financial')) 

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


//设置cookie
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res); //调用req的cookies方法把Cookies加载到req对象里面
	req.userInfo = {}; //定义一个全局访问对象
	//如果浏览器请求有cookie信息,尝试解析cookie
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
		}catch(e){}
	}

	next();
})

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
