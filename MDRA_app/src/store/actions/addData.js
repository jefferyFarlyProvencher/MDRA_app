import {ADD_DATA} from "./actionTypes";

export const addData = (pageData,position) => {
    return{
        type: ADD_DATA+position,
        pageData: pageData,
        position: position
    };
};