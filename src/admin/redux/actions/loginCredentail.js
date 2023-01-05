export const getLoggedUser = (data) => {
  console.log("data", data);
  return {
    type: "GET_LOGED_USER",
    payload: data,
  };
};
