import {
    ADD_DATA
} from '../actions/actionTypes'

const initialState = {
    position: 0,
    Page0Data: null,
    Page1Data: null,
    Page2Data: null,
    Page3Data: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_DATA+'0'):
            return {
                ...state,
                Page0Data: action.pageData,
                position:action.position+1
            };
        case (ADD_DATA+'1'):
            return {
                ...state,
                Page1Data: action.pageData,
                position:action.position+1
            };
        case (ADD_DATA+'2'):
            return {
                ...state,
                Page2Data: action.pageData,
                position:action.position+1
            };
        case (ADD_DATA+'3'):
            return {
                ...state,
                Page3Data: action.pageData,
                position:action.position+1
            };
        default:
            return state
    }
};

export default reducer;