exports.handleServerError = (res) => {
  return res.status(500).json({ message: " Internal Server Error" });
};
exports.handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};
exports.handleNotFound = (res) => {
  return res.status(404).json({ message: "Data Not Found" });
};
exports.handleSuccess = (res, json) => {
  return res.status(200).json(json);
};
exports.handleCreated = (res, json) => {
  return res.status(201).json(json);
};
exports.handleResponse = (res, status, json) => {
  return res.status(status).json(json);
};
