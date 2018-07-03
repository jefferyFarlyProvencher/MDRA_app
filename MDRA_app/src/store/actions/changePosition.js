import {POS_CHNG} from "./actionTypes";

export const changePosition = (position) => {
    return{
        type: POS_CHNG,
        position: position
    };
};