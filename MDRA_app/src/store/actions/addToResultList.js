import {ADD_LIST} from "./actionTypes";

export const addToResultList = (data) => {
    return{
        type: ADD_LIST,
        data: data,
    };
};