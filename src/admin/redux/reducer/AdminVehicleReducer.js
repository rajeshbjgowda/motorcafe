import { accordionActionsClasses } from "@mui/material"

const initialState = {
    vehicleCategories: {},
    vehicalCompaniesList: [],
    vehicalTypeList: [],
    vehicleCompanies: []

}


export const adminVehicleReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_VEHICLE_CATEGORY":

            return {
                ...state,
                vehicleCategories: action.payload
            }
        case "GET_VEHICLE_COMPANY":

            return {
                ...state,
                vehicalCompaniesList: action.payload
            }
        case "GET_VEHICLE_TYPE":

            return {
                ...state,
                vehicalTypeList: action.payload
            }

        case "GET_VEHICLE_MODEL":

            return {
                ...state,
                vehicalTypeList: action.payload
            }


        default:
            return state
    }
}