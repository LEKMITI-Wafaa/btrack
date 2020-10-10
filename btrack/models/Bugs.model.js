const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const SeveritySchema = new mongoose.Schema({
    value: { type: String },
    updated: { type: Boolean },
});
const serviceSchema = new Schema(
    {
        title: { type: String },
        rapporter: { type: Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        severty: { type: String },
        rapportedAt: { type: Date },
        solutions: [{
            user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            solution: { type: String },
            status: { type: String },
            severity: { type: SeveritySchema, default: {value: 'Medium', updated: false} },
            date: { type: Date }
        }],
        services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
        status: { type: String },
    }
);



module.exports = model("Bug", serviceSchema);



