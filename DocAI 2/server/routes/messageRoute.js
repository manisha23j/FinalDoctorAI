const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");


router.post("/send-message", async (req, res) => {
  try {
    const { senderId, userName , senderModel, recipientId, recipientModel, content } =
      req.body;
    if (
      !["USER", "DOCTOR" , "ADMIN"].includes(senderModel) ||
      !["USER", "DOCTOR" , "ADMIN"].includes(recipientModel)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid sender or recipient model" });
    }

    const message = new Message({
      sender: senderId,
      senderModel,
      recipient: recipientId,
      recipientModel,
      content,
    });

    await message.save();

const recipient = await User.findById(recipientId);
if (!recipient) {
  return res.status(404).json({ message: "Recipient not found" });
}
    recipient.unseenNotifications.push({
      type: "Message",
      message: `You have a new message from ${senderModel.toLowerCase()} ${userName}`,
      referenceId: message._id,
      onClickPath: `/messages/${message._id}`,
    });

    await recipient.save();

    res
      .status(200)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

router.get("/get-message-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching message", error });
  }
});

module.exports = router;
