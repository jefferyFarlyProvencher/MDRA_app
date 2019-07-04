import {REMOVE_FROM_PATIENTS_LIST} from "./actionTypes";

export const removeFromPatientsList = (key) => {
    console.log(JSON.stringify("removed patient has key: "+ key));
    return{
        type:REMOVE_FROM_PATIENTS_LIST,
        key: key
    };
};