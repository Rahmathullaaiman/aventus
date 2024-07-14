const Groups = require("../SCHEMAS/GroupChatschema.js");
const { getReceiverSocketId, io } = require("../SOCKET/socket.js");


exports.createGroup = async (req, res) => {
    const { groupName, members } = req.body;
    const creatorId = req.user._id;

    try {
        const newGroup = new Groups({
            name: groupName,
            members: [...members, creatorId],
            profilePic :"",
            about :"",
            messages: [],
        });

        await newGroup.save();
        res.status(200).json(newGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the group." });
    }
};

exports.addMembers = async (req, res) => {
    const { groupId } = req.params;
    const { members } = req.body;

    try {
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const existingMembers = members.filter(member => group.members.includes(member));

        if (existingMembers.length > 0) {
            return res.status(400).json({ error: "Users already added: " + existingMembers.join(", ") });
        }
        group.members.push(...members);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding members." });
    }
};


exports.removeMembers = async (req, res) => {
    const { groupId } = req.params;
    const { members } = req.body;

    try {
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        const membersToRemove = members.filter(member => group.members.includes(member));

        if (membersToRemove.length === 0) {
            return res.status(400).json({ error: "No valid members to remove." });
        }

        group.members = group.members.filter(member => !members.includes(member));
        await group.save();

        res.status(200).json({ message: "Members removed successfully", group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while removing members." });
    }
};


exports.updateGroupSettings = async (req, res) => {
    const { groupId } = req.params;
    const { groupName, about } = req.body;
    const uploadedImage = req.file ? req.file.filename : profilePic

    try {
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (groupName) group.name = groupName;
        if (uploadedImage) group.profilePic = uploadedImage;
        if (about) group.about = about;

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating group settings." });
    }
};


exports.sendMessage = async (req, res) => {
    const { message, groupId } = req.body;
    const senderId = req.user._id;

    try {
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const newMessage = {
            senderId,
            message,
            timestamp: new Date(),
        };

        group.messages.push(newMessage);
        await group.save();

        group.members.forEach(memberId => {
            const receiverSocketId = getReceiverSocketId(memberId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newGroupMessage", newMessage);
            }
        });

        res.status(200).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while sending the message." });
    }
};

exports.getMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.status(200).json(group.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching messages." });
    }
};

exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Groups.findByIdAndDelete(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.status(200).json({ message: "Group deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the group." });
    }
};
