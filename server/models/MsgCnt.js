const mongoose = require("mongoose");

const msgCntSchema = new mongoose.Schema({
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
});

const MsgCnt = mongoose.model("MsgCnt", msgCntSchema);

module.exports = MsgCnt;
