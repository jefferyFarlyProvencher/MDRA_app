import {
    ADD_DATA
} from '../actions/actionTypes'

const initialState = {
    places:[]
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_DATA):
            return {
                ...state,
            };
            break;
        default:
            return state
    }
};

export default reducer;