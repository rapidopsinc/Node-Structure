'use strict';
var fs         = require('fs');
module.exports = (app)=>{
	var express      = require('express');
	var path         = require('path');
	var morgan       = require('morgan');
	var errorHandler = require('errorhandler');

	//Setup Logger
	var Logger    = require('../libs/logger');
	global.logger = new Logger();

	//Setup Exception Class
	let exceptions=require('./exceptions.json');
	let Exception    = require('../libs/exception')(exceptions);
	global.Exception = Exception;

	//Add morgan to console the request
	app.use(morgan('dev'));

	//Set cross origin options
	setupCORS(app);

	//Setup default app headers
	app.enable('trust proxy');
	app.disable('x-powered-by');

	//Configure application
	configureApp(app);
	// setup static assets rendering
	if(app.get('env') === 'development'){
		if(process.argv[2]==undefined || process.argv[2]!="-api-only"){

		}
	} else{
		app.use(express.static(getAppPath(app)));
	}

	app.use(express.static(path.join(config.root, 'uploads')));

	// setup error handler
	app.use(errorHandler());


};

function setupCORS(app){
	var cors        = require('cors');
	var corsOptions = {
		origin:'*'
	};
	app.use(cors(corsOptions));
}
function getAppPath(app){
	var path   = require('path');
	var config = require('./environments');
	var env    = app.get('env');
	//set app path to point to
	// if('production' === env || 'staging' === env || 'dev' === env){
		return path.join(config.root, 'build');

}
function configureApp(app){
	var session        = require('express-session');
	var MongoStore     = require('connect-mongo')(session);
	var bodyParser     = require('body-parser');
	var methodOverride = require('method-override');
	var cookieParser   = require('cookie-parser');
	var config         = require('./environments');
	var multer         = require('multer');
	var env    = app.get('env');


	let bypassAuthentication=[];
	if(env=='development' || env=='test')
		bypassAuthentication.push('/user');

	//setup bodyparser
	app.use(bodyParser.json({type:'application/*+json', limit:'500mb'}));
	app.use(bodyParser.json({type:'application/json', limit:'500mb'}));
	app.use(bodyParser.urlencoded({extended:false, limit:'500mb'}));

	//setup views
	app.set('views', config.root + '/server/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	//setup method override
	app.use(methodOverride());

	//setup multer default option
	global.upload=multer({
		dest:config.root + '/uploads/'
	});

	var Response = require('../libs/response');
	var response = new Response();
	app.use(response.handler());

	//temporary commneted
	//app.use('/api',response.authHandler(bypassAuthentication));

	app.use(cookieParser());
	var mongodbUri = require('mongodb-uri');
	var uri        = mongodbUri.format({
		username:config.mongo.dbUser,
		password:config.mongo.dbPassword,
		hosts:config.mongo.dbHost,
		database:config.mongo.dbName
	});

	app.use(session({
		secret:'a4f8071f-skdf92sDLd1-4447-8ee2',
		name:'APPSESID',
		cookie:{secure:false},
		resave:false,
		saveUninitialized:true,
		unset:'destroy',
		store:new MongoStore({
			url:uri,
			ttl: 900,//logout after 15mins (900 seconds) of inactivity
			mongoOptions:{
				native_parser:true,
				// numberOfRetries:100,
				// retryMiliSeconds:60000,
				// auto_reconnect:true,
				poolSize:30,
				// socketOptions:{keepAlive:1},
				// user:config.mongo.dbUser,
				// pass:config.mongo.dbPassword
			} // See below for details
		})
	}));
	app.set('appPath', getAppPath(app));
}
