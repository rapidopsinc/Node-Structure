/*
 Endpoints which don't require authentication
 */
let byPassedEndpoints = [
	'/check-login',
	'/user',
	'/inventory'
];
let fs                = require('fs');
module.exports        = class Apis {
	constructor(app){
		// Configure local auth check
		app.use('/api',(req, res, next)=>{
			byPassedEndpoints.forEach(function(path){
				let regex = new RegExp(path, 'i');
				if(req.path.match(regex)){
					next();
                }
            });
		});
		this.setupRoutes(app);
	}

	setupRoutes(app){
		fs.readdirSync(__dirname + '/').filter(function(file){
			const stats = fs.statSync(__dirname + '/' + file);
			return (file.indexOf('.') !== 0 && stats.isDirectory());
		}).forEach(function(file){
			let tmpRoute = require(__dirname + '/' + file);
			new tmpRoute(app);
		});
	}
};
