exports.checkStatusOrder = (newStatus) => {
  const statusArr = [
    "app_pending",
    "app_payment",
    "app_pickUp",
    "app_onProcess",
    "app_onDelivery",
    "app_finish",
    "app_rejected",
  ];
  return statusArr.includes(newStatus);
};
