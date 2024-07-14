const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const groupChatSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    messages: [messageSchema], 
    profilePic: {
        type: String, 
        default: "",
    },
    about: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const Groups = mongoose.model("Group", groupChatSchema);
module.exports = Groups;
