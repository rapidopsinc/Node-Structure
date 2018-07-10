var ENV=process.env.NODE_ENV || 'development';
var path=require('path');
var config=require(`./${ENV}.js`);
config.root=config.root || path.join(ROOT_PATH,'..');
// console.log(config.root);
module.exports=config;