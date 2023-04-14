const initialState = {
  isLoggedIn: false,
  userType: null,
  userDetails: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isLoggedIn: true,
        userType: action.payload.userType,
        userDetails: action.payload.userDetails,
      };
    case "LOG_OUT":
      return {
        ...state,
        ...initialState,
      };
    default:
      return { ...state };
  }
};
