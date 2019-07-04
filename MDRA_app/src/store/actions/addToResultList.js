import {ADD_LIST} from "./actionTypes";

export const addToResultList = (data, name, formData, date, patient) => {
    console.log(formData);
    return{
        type: ADD_LIST,
        data: data,
        formData: formData,
        name: name,
        date: date,
        patient: patient
    };
};