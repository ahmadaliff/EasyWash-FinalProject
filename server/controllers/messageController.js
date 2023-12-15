const { Op } = require("sequelize");

const { chatStreamClient } = require("../utils/streamChatUtil");

const {
  handleSuccess,
  handleServerError,
  handleNotFound,
  handleCreated,
} = require("../helpers/handleResponseHelper");

const { User } = require("../models");

exports.token = async (req, res) => {
  try {
    const { id } = req;
    const token = chatStreamClient.createToken(id.toString());
    return handleSuccess(res, { token: token });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.createChannels = async (req, res) => {
  try {
    const { id } = req;
    const { userId } = req.body;
    const isExist = await User.findOne({ where: { id: userId } });
    if (!isExist) {
      return handleNotFound(res);
    }

    const filter = {
      type: "messaging",
      members: { $in: [id.toString(), userId.toString()] },
    };

    const isExistChannel = await chatStreamClient.queryChannels(filter);
    if (isExistChannel.length !== 0) {
      return handleSuccess(res, {});
    }

    const arrId = [id, userId];
    arrId.sort(function (a, b) {
      return a - b;
    });

    const channel = chatStreamClient.channel(
      "messaging",
      `${arrId[0]}-${arrId[1]}`,
      {
        members: [id.toString(), userId.toString()],
        created_by_id: id.toString(),
      }
    );
    await channel.create();

    return handleCreated(res, { message: "app_chat_created" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const { id } = req;
    const { userId } = req.params;
    const filter = {
      type: "messaging",
      members: { $in: [id.toString(), userId.toString()] },
    };
    const isExistChannel = await chatStreamClient.queryChannels(filter);
    if (isExistChannel.length === 0) {
      return handleNotFound(res);
    }
    await chatStreamClient.deleteChannels([`messaging:1-4`]);
    return handleSuccess(req, {});
  } catch (error) {
    return handleServerError(res);
  }
};
