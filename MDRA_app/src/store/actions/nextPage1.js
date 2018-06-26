import {ADD_DATA} from "./actionTypes";

export const nextPage1 = (pageData) => {
    return{
        type: ADD_DATA,
        pageData: pageData
    };
};