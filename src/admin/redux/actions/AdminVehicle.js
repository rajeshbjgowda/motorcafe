import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore/lite";
import { fireStore } from "../../containers/firebase";
const getVehicleCompany = (data) => ({
  type: "GET_VEHICLE_COMPANY",
  payload: data,
});

const getVehicleModel = (data) => ({
  type: "GET_VEHICLE_MODEL",
  payload: data,
});

const getVehicleCategory = (data) => ({
  type: "GET_VEHICLE_CATEGORY",
  payload: data,
});

const getVehicleType = (data) => ({
  type: "GET_VEHICLE_TYPE",
  payload: data,
});

export const getVehicleModelData = () => {

  return async (dispatch) => {


    const vehicleTypesRef = collection(fireStore, "vehicle_type");


    console.log("effect");
    let details = await getDocs(vehicleTypesRef);

    let vehicleTypes = [];
    details.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      vehicleTypes = [...vehicleTypes, { id: doc.id, ...doc.data() }];
    });

    dispatch(getVehicleModel([...vehicleTypes]))
  }

}

export const getVehicleTypeData = () => {

  return async (dispatch) => {


    const vehicleTypesRef = collection(fireStore, "vehicle_type");


    console.log("effect");
    let details = await getDocs(vehicleTypesRef);

    let vehicleTypes = [];
    details.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      vehicleTypes = [...vehicleTypes, { id: doc.id, ...doc.data() }];
    });

    dispatch(getVehicleType([...vehicleTypes]))
  }

}

export const getVehicleCompanyData = () => {

  return async (dispatch) => {


    const vehicleref = collection(fireStore, "vehicle");

    let details = await getDocs(vehicleref);

    let vechicleCompanies = [];
    details.docs.forEach((doc) => {

      vechicleCompanies = [...vechicleCompanies, { id: doc.id, ...doc.data() }];
    });

    dispatch(getVehicleCompany([...vechicleCompanies]))

  }

}

export const getVehicleCatrgoryData = () => {

  return async (dispatch) => {


    const vehicleCategoryRef = collection(fireStore, "vehicle_category");

    let details = await getDocs(vehicleCategoryRef);

    let categoty = {};
    details.docs.forEach((doc) => {

      categoty = { ...categoty, [doc.id]: { ...doc.data() } };
    });

    console.log("rajesh", categoty)
    dispatch(getVehicleCategory({ ...categoty }))
  }

}

