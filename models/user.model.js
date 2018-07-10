module.exports = (mongoose) => {
  /**
   * User Schema
   */
  let UserSchema = new mongoose.Schema({
    name: {
      type: String
    },
    username: {
      type: String,
      required: [true, 'User Name is required'],
      index: {
        unique: [true, 'User Name already registered']
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: {
        unique: [true, 'Email id already registered.']
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    ResetToken: {
      type: String
    },
    TokenExpire: {
      type: String
    },
    isRootUser: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }, {timestamps: true});

  return mongoose.model('User', UserSchema);
};
