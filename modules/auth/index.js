const MailOptions = require("../../utils/send-mail"),
  q = require('q'),
  utils = require('../../helper/utils'),
  uuid = require('node-uuid');

module.exports = class AuthController {
  constructor(app) {
    app.get('/logout', this.doLogout);
    app.get('/check-login', this.checkLogin);
    app.post('/login', this.doLogin);
    app.post('/root', this.createRootuser);
    app.post('/auth/recover-password', this.recoverPassword);
    app.get('/auth/validate-reset-password-token/:token', this.validateToken);
    app.put('/auth/reset-forgot-password', this.resetForgotPasssword);
    app.put('/auth/change-password', this.changePassword);
  }

  checkLogin(req, res) {
    if (req.session.isLoggedIn === 'Y') {
      res.send({status: 'success', data: req.session.userProfile});
    } else {
      res.status(401);
      res.send({});
    }
  }

  createRootuser(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let user = new global.MongoORM.User();
    user.set('username', username);
    user.set('password', Utils.md5(password));
    let promise = user.save();
    promise
      .then(function (user) {
        return res.send(user);
      })
      .catch(function (error) {
        res.sendError(error)
      })
  }

  doLogin(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let promise = global.MongoORM.User.findOne({
      username: username,
      password: Utils.md5(password)
    }, {password: false}).populate('Role');
    promise
      .then(function (userData) {
        if (userData) {
          let userProfile = [];
          userProfile[0] = userData;
          req.session.isLoggedIn = 'Y';
          req.session.userProfile = userProfile;
          return res.send({status: "success", data: userProfile});
        } else {
          return res.send({status: "failure", message: "Invalid Login Details !"});
        }
      }).catch((error) => {
      console.error(error);
      return res.send({status: "failure", message: "Login failed"});
    });
  }

  doLogout(req, res) {
    req.session.isLoggedIn = 'N';
    req.session.destroy(function (err) {
      if (err) {
        return res.send({message: "Error in logging out."})
      } else {
        return res.send({message: "Logged out"})
      }
    });
  }

  recoverPassword(req, res) {
    let resetToken = uuid.v4();
    let tokenExpireOn = utils.getTime();
    tokenExpireOn = tokenExpireOn + 86400000;
    let email;
    let username;
    let urlLink = `http://${global.config.server.url}:${global.config.server.port}/#/reset-password/${resetToken}`;
    if (req.body) {
      email = req.body.email;
    } else if (req.params) {
      email = req.params.email;
    }
    global.MongoORM.User.findOne({"email": email}, (error, user) => {
      if (user == null) {
        res.sendError({Message: "Please enter valid email address."});
      }
      else if (user != null) {
        console.log("user in not null");
        username = user.username;
        let emailObj = {
          subject: "Reset Password",
          html: `<div>
                           <h4>Hello, ${username}</h4>
                           <p>You’re receiving this email due to a forgot password action you requested.
                           Click on following link to reset your password:</p>
                           <a href=${urlLink} class="alert-link"><h2 style="border: 1px solid #175817;width: 100px;margin: 0px auto;background: #192867;color: #b32020;font-size: 16px;padding: 10px; text-align: center;">Click Here</h2></a>
                           <p>This email is an automated response to your password request.</p>
                           </br>
                           <h4>Warm Regards</h4>
                           <h4>Big Commerce Admin</h4>
                           </div>`
        };
        if (user) {
          global.MongoORM.User.update({'_id': user._id}, {
            'ResetToken': resetToken,
            'TokenExpire': tokenExpireOn
          }, function (err, user) {
            if (err) {
              res.sendError(new Error('GeneralError'));
            }
            else {
              MailOptions.SendMail(emailObj, email).then(() => {
                console.log("Mail sent successfully.");
              }).catch((error) => {
                console.log('Error in sending mail - ', error);
              });
              return res.send({status: "success"});
            }
          });
        } else {
          res.sendError(new Error('ObjectNotFound'));
        }
      }
    });
  }

  /**
   * @method validateToken
   * @description function to validate the token
   * @param req
   * @param res
   */
  validateToken(req, res) {
    let token = req.params.token;
    global.MongoORM.User.findOne({ResetToken: token})
      .then((user) => {
        if (!user) {
          res.sendError(new Error('Reset password token does not match.'));
        }
        if (user.TokenExpire < new Date().getTime()) {
          res.sendError(new Error('Reset password token has been expired.'));
        } else {
          res.sendResponse(user);
        }
      })
      .catch((err) => {
        res.sendError(err);
      });
  }

  /**
   * @method resetForgotPasssword
   * @description Method to reset user's password
   * @param req
   * @param res
   */
  resetForgotPasssword(req, res) {
    let newPassword = Utils.md5(req.body.password);
    let email = req.body.email;
    global.MongoORM.User.findOne({"email": email})
      .then((user) => {
        if (user != null) {
          if (user.password) {
            user.password = newPassword;
          } else {
            res.sendError(error);
          }
        }
        user.save()
          .then((usr) => {
            res.sendResponse(usr);
          }).catch((err) => {
          res.sendError(err);
        })
      }).catch(() => {
      res.sendError(new Exception('ObjectNotFound'));
    })
  }

  /**
   * @method changePassword
   * @description Method to change user's password
   * @param req
   * @param res
   */
  changePassword(req, res) {
    let oldpassword = Utils.md5(req.body.oldPassword);
    let newpassword = Utils.md5(req.body.newPassword);
    if (newpassword === oldpassword) {
      res.sendError({Message: "New password and current password are same."});
    } else {
      global.MongoORM.User.findOne({"email": (req.session.userProfile[0].email)})
        .then((user) => {
          if (user != null) {
            if (user.password === oldpassword) {
              user.password = newpassword;
            }
            else {
              res.sendError({Message: "Current password does not match the entered password."});
            }
          }
          user.save()
            .then((user) => {
              res.sendResponse(user);
            }).catch((err) => {
            res.sendError(err);
          })
        }).catch(() => {
        res.sendError(new Exception('ObjectNotFound'));
      })
    }
  }
};

/*
 [ { _id: 58f470311ad824104c78845f,
    updatedAt: 2017-04-17T07:35:13.945Z,
    createdAt: 2017-04-17T07:35:13.945Z,
    key: '849b0cbf-749c-4c99-b05e-55ba2d6056c7',
    name: 'Admin',
    email: 'admin@escap59.com',
    username: 'admin',
    __v: 0,
    isAdmin: true,
    isActive: true } ]
 */
