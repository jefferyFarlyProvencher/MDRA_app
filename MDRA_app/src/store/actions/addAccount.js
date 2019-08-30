import {ADD_ACCOUNT} from "./actionTypes";

export const addAccount = (email,name,token) => {
    return{
        type: ADD_ACCOUNT,
        email: email,
        name: name,
        token: token
    };
};