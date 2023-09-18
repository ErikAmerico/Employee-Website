const mongoose = require("mongoose");

const msgCntSchema = new mongoose.Schema({
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, default: Date.now }
});

const MsgCnt = mongoose.model("MsgCnt", msgCntSchema);

module.exports = MsgCnt;
