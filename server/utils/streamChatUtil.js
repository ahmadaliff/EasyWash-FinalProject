const { StreamChat } = require("stream-chat");
const dotenv = require("dotenv");
dotenv.config();

const chatClient = StreamChat.getInstance(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET
);

exports.chatStreamClient = chatClient;
