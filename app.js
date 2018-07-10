let express = require('express');
let app = express();
global.Utils = require('./libs/utils.js');
global.ROOT_PATH = __dirname;
const config = require('./config/environments');
global.config = config;
const path = require('path');
const fs = require('fs');
//Configure application
require('./config/mongo');
require('./config/express')(app);

//Configure api routes authentication
app.use((req, res, next) => {
        if (req.path.indexOf('/apis') === 0) { // If request is starting with /apis, then apply authentication check
            if (req.session.isLoggedIn === 'Y') {
                next();
            } else {
                let secretKey = req.headers['X-SECRET-KEY'];
                let accessKey = req.headers['X-ACCESS-KEY'];
                let sessionToken = req.headers['X-SESSION-TOKEN'];
                // IMPLEMENT APP SPECIFIC AUTHENTICATION LOGIC
                next();
            }
        } else {
            next();
        }
    }
);
let Api = require('./apis');
new Api(app);

let Module = require('./modules');
new Module(app);

module.exports = app;