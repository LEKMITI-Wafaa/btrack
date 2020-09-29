const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    services:[{type: Schema.Types.ObjectId, ref: 'Services'}],
    role:{
      type: String
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.*@.*\..*/, 'Invalid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
    // add password property here
  },
  
);

module.exports = model('User', userSchema);
// {
//   timestamps: true
// }