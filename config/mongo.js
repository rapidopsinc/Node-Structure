let config = require('./environments');
let fs = require('fs');
let mongoose = require('mongoose');
let mongo = {
    dbHost: config.mongo.dbHost,
    dbName: config.mongo.dbName,
    dbUser: config.mongo.dbUser,
    dbPassword: config.mongo.dbPassword
};

let mongodbUri = require('mongodb-uri');
let options = {
    native_parser: true,
    numberOfRetries: 100,
    auto_reconnect: true,
    poolSize: 10,
};
if (mongo.replset !== undefined) {
    options.replset = {
        rs_name: mongo.replset,
        safe: true
    };
}
let uri = mongodbUri.format(
    {
        username: mongo.dbUser,
        password: mongo.dbPassword,
        hosts: mongo.dbHost,
        database: mongo.dbName,
        options: {}
    }
);
mongoose.Promise = global.Promise;
mongoose.connect(uri, options);
mongoose.set('debug', config.mongo.debug);
global.MongoORM = {};

fs.readdirSync(ROOT_PATH + '/models').filter(function (file) {
    let stats = fs.statSync(ROOT_PATH + '/models/' + file);
    return (file.indexOf('.') !== 0 && !stats.isDirectory());
}).forEach(function (file) {
    let temp = require(ROOT_PATH + '/models/' + file)(mongoose);
    global.MongoORM[temp.modelName] = temp;
});