import {
    ADD_DATA, ALLOW_ADV,
    POS_CHNG
} from '../actions/actionTypes'

const initialState = {
    position: 0,
    Page0Data: null,
    Page1Data: null,
    Page2Data: null,
    Page3Data: null,
    advanceTabAccessible: false,
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
                position:action.position-1
            };
        case (POS_CHNG):
            return{
                ...state,
                position:action.position
            };
        case (ALLOW_ADV):
            return{
                ...state,
                advanceTabAccessible:  true,
            };
        default:
            return state
    }
};

export default reducer;