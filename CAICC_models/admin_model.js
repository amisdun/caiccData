const mongoose = require("mongoose");

const admin_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const admin = mongoose.model("admin",admin_schema);

module.exports = admin;