const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company", //might need to change to companyId? doesn't appear so.
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
