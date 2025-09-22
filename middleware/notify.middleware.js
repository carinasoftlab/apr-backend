// helper.js
const Notification = require("../admin/model/notification.model");

exports.createNotification = async ({
  title,
  message,
  resourceType,
  resourceId,
  user,
  image,
}) => {
  return await Notification.create({
    title,
    message,
    resourceType,
    resourceId,
    user,
    image,
  });
};
