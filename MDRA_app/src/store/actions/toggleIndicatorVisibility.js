import {TOGGLE_INDICATOR_VISIBILITY} from './actionTypes';

export const toggleIndicatorVisibility = (value) => {
    return {
        type: TOGGLE_INDICATOR_VISIBILITY,
        value: value
    }
};