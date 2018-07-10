'use strict';
// Development specific configuration
// ==================================
module.exports = {
    server: {
        port: 9002,
        host: '0.0.0.0',
        protocol: 'http://',
        externalPort: 9002
    },
    mongo: {
        dbHost: [
            {
                host: '127.0.0.1',
                port: 27017
            }
        ],
        dbName: 'myDB',
        dbUser: '',
        dbPassword: '',
        debug: true
    },
    mailServer: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        debug: true,
        username: "sunrisecomputers98@gmail.com",
        password: "8866610765",
        from: ["sunrisecomputers98@gmail.com"],
        to: ["samirhindocha9@gmail.com"],
        bcc: [""]
    }
};
