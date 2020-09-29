const { Schema, model } = require('mongoose');

const serviceSchema = new Schema(
  {
    name:{
      type: String
    },
    phone:{
      type:String
    },
    manager:{
      type:[{type: Schema.Types.ObjectId, ref: 'Users'}]
    },
    email:{
      type:email
    }
  }
)