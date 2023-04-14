export const logInAction = (payload) => {
  return { type: "LOG_IN", payload };
};

export const logOutAction = () => {
  return { type: "LOG_OUT" };
};
