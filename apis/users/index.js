let uuid = require('node-uuid');
module.exports = class UserController {
  constructor(app) {
    app.get('/api/user', this.listUser);
    app.get('/api/user/:id', this.getUser);
    app.post('/api/user', this.createUser);
    app.put('/api/user/:id', this.updateUser);
    app.delete('/api/user/:id', this.removeUser);
  }

  validateUser(){

  }

  listUser(req, res) {
    let pageNo = 1,
      rows = 50,
      sortOrder = 'DESC',
      sortBy = null,
      whereCondition = {};


    global.MongoORM.User.find().then((users) => {
      res.sendResponse({
        data: users,
        totalRows: users.count,
        totalPages: Math.ceil(users.count / rows)
      });
    }).catch((error) => {
      console.log('error', error);

    })
  }


  getUser(req, res) {
    let userId = req.params.id;
    global.MongoORM.User.findOne({_id:userId}).then((user) => {
      res.sendResponse(user);
    }).catch((error) => {
      console.log('error', error);
      res.sendError(error);
    })
  }


  createUser(req, res) {
    let username = req.body.username,
      password = req.body.password,
      email = req.body.email,
      name = req.body.name;


    let user = new global.MongoORM.User();
    let userKey = uuid.v4();



   let s = {
      "isRootUser" : true,
      "isActive" : true,
      "isDeleted" : false,
      "name" : "Admin",
      "email" : "admin@admin.com",
      "username" : "Admin",
    };



    if (username !== undefined)
      user.set('username', username);

    if (email !== undefined)
      user.set('email', email.toLowerCase());

    if (password !== undefined)
      user.set('password', Utils.md5(password));
    if (name !== undefined)
      user.set('name', name);
    if (userKey !== undefined)
      user.set('key', userKey);


    let promise = user.save();
    promise
      .then(function (usr) {
        res.send(usr);
      })
      .catch(function (error) {
        let errors = [];
        if (error.name === 'ValidationError') {
          Object.keys(error.errors).forEach(function (field) {
            let eObj = error.errors[field].properties;
            if (eObj.hasOwnProperty("message"))
              errors.push(eObj['message']);
          });
        } else if (error.name === 'MongoError') {
          if (error.code === 11000)
            errors.push('User Name already registered');
        } else
          errors.push('Internal server error.');
        res.sendError(errors);
      })
  }

  updateUser(req, res) {
    let userId = req.params.id;

  }

  removeUser(req, res) {
    let userId = req.params.id;
  }


};
