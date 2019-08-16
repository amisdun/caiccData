const mongoose = require("mongoose");

const members_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    contactDetails: {
        phoneNumber: {
            type: Number,
            required: true
        },
        emailAddress: {
            type:String,
        }
    },
    houseAddress: {
        type: String
    },
    gender: {
        type: String,
        required: true
    }
});

const membersDetails = mongoose.model("membersDetails",members_schema);

module.exports = membersDetails;