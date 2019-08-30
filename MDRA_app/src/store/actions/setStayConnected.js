import {SET_STAY_CONNECTED} from './actionTypes';

export const setStayConnected = (value) => {
    console.log("stayConnected reached with value: "+value);
    return {
        type: SET_STAY_CONNECTED,
        value: value
    }
};