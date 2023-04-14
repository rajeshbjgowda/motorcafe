import { accordionActionsClasses } from "@mui/material"

const initialState = {
    appointments: [],
    paymentTransactions: []
}


export const appointmenteducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_APPOINTMENTS":

            return {
                ...state,
                appointments: action.payload
            }

        case "GET_PAYMENT_TRANSACTIONS":

            return {
                ...state,
                paymentTransactions: action.payload
            }

        default:
            return state
    }
}