module.exports = {
    SendMail(emailObject, Email = global.config.mailServer.to, Bcc = global.config.mailServer.bcc) {
        const q = require("q");
        const nodemailer = require('nodemailer');
        let sendEMail, deferred, smtpConfiguration, emailTransporter, emailObj;
        sendEMail = (mailOptions, email, bcc) => {
            mailOptions.from = global.config.mailServer.from;
            mailOptions.to = email;
            mailOptions.bcc = bcc;
            console.log(' mailOptions.to', mailOptions.to);
            console.log('mailOptions.bcc', mailOptions.bcc);
            deferred = q.defer();
            smtpConfiguration = {
                host: global.config.mailServer.host,
                port: global.config.mailServer.port,
                secure: global.config.mailServer.secure,
                debug: global.config.mailServer.debug,
                auth: {
                    user: global.config.mailServer.username,
                    pass: global.config.mailServer.password
                }
            };
            emailTransporter = nodemailer.createTransport(smtpConfiguration);
            emailTransporter.sendMail(mailOptions, (mailError, mailResponseStatus) => {
                if (mailError) {
                    deferred.reject(mailError);
                } else {
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        };
        emailObj = emailObject;
        return sendEMail(emailObj, Email, Bcc);
    }
};