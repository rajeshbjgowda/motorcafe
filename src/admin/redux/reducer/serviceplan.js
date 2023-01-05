import { accordionActionsClasses } from "@mui/material"

const initialState = {
    service_plans: []
}


export const servicePlanReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_SERVICE_PLANS":

            return {
                ...state,
                service_plans: action.payload
            }

        default:
            return state
    }
}