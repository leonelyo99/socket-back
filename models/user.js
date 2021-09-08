const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "active"
  }
});

userSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

module.exports = mongoose.model('User', userSchema);
