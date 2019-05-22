import {ADD_ACCOUNT} from "./actionTypes";

export const addAccount = (name,token) => {
    return{
        type: ADD_ACCOUNT,
        name: name,
        token: token
    };
};