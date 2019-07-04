import {UPDATE_PATIENT_INFO} from "./actionTypes";

export const updatePatientInfo = (data) => {
    console.log("Updating " + data.name + "info with: "+ JSON.stringify(data));
    return{
        type:UPDATE_PATIENT_INFO,
        color: data.color,
        name:data.name,
        gender:data.gender,
        weight:data.weight,
        kg_lbs:data.kg_lbs,
        dateOfBirth:data.dateOfBirth,
        dinerTime: data.dinerTime,
        bedTime: data.bedTime,
        key: data.key,
        id: data.id
    };
};