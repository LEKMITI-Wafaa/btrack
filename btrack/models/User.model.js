const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, 'Username is required.']
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
    },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    role: {
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
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }
  },

);

module.exports = model('User', userSchema);
