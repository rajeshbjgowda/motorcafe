const initialState = {
  service_list: {},
  loading: true,
};

export const serviceListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SERVICE_LIST":
      return {
        service_list: { ...action.payload },
        loading: false,
      };

    default:
      return state;
  }
};
