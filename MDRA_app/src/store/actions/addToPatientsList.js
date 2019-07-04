import {ADD_TO_PATIENT_LIST} from "./actionTypes";

export const addToPatientsList = (data) => {
    console.log(JSON.stringify(data));
    return{
        type:ADD_TO_PATIENT_LIST,
        color: data.color,
        name:data.name,
        gender:data.gender,
        weight:data.weight,
        kg_lbs:data.kg_lbs,
        dateOfBirth:data.dateOfBirth,
        dinerTime: data.dinerTime,
        bedTime: data.bedTime
    };
};