const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        senderId: {
            type: String,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: String,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Messages = mongoose.model("Message", messageSchema); 
module.exports = Messages;
