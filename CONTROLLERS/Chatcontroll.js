const Conversations = require("../SCHEMAS/Chatschema.js");
const Messages = require("../SCHEMAS/messageschema.js");
const { getReceiverSocketId, io } = require("../SOCKET/socket.js");

exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; 

    let conversation = await Conversations.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversations.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = new Messages({
        senderId,
        receiverId,
        message,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
};

exports.getMessages = async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id; 

    const conversation = await Conversations.findOne({
        participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    const messages = conversation ? conversation.messages : [];

    res.status(200).json(messages);
};
