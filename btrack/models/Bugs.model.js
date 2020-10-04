const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const serviceSchema = new Schema(
    {
        title: {type: String},
        rapporter: { type: Schema.Types.ObjectId, ref: 'User' },
        description: {type: String},
        solutions: [{
            user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            solution: {type: String},
        }],
        services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
        status: {type: String},
    }
);

module.exports = model("Bug", serviceSchema);



