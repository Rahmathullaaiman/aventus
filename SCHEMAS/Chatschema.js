const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
	{
		participants: [
			{
				type: String,
				ref: "User",
			},
		],
		messages: [
			{
				type: String,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversations = mongoose.model("Conversations", conversationSchema);
module.exports = Conversations;

