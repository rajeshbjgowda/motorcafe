import { accordionActionsClasses } from "@mui/material"

const initialState = {
    users: {},

}


export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USERS_DATA":

            return {
                ...state,
                users: action.payload
            }



        default:
            return state
    }
}