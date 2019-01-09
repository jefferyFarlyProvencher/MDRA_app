import {ADD_LIST} from "./actionTypes";

export const addToResultList = (data, name, formData, date) => {
    console.log(formData);
    return{
        type: ADD_LIST,
        data: data,
        formData: formData,
        name: name,
        date: date
    };
};