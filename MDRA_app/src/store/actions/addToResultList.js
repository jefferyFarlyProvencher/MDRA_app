import {ADD_LIST} from "./actionTypes";

export const addToResultList = (data, name) => {
    return{
        type: ADD_LIST,
        data: data,
        name: name
    };
};