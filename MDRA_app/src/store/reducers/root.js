import {
    ADD_DATA, ADD_LIST, ALLOW_ADV,
    POS_CHNG, REMOVE_LIST, RENAME_LIST
} from '../actions/actionTypes'

const initialState = {
    position: 0,
    PageData: {
      Page0: null,
      Page1: null,
      Page2: null,
    },
    Page0Data: null,
    Page1Data: null,
    Page2Data: null,
    Page3Data: null,
    advanceTabAccessible: false,
    receivedData: null,
    resultsList: []//{key:'1',data:[data], name:name}}],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_DATA+'0'):
            return {
                ...state,
                Page0Data: action.pageData,
            };
        case (ADD_DATA+'1'):
            return {
                ...state,
                Page1Data: action.pageData,
            };
        case (ADD_DATA+'2'):
            return {
                ...state,
                Page2Data: action.pageData,
            };
        case (ADD_DATA+'3'):
            return {
                ...state,
                Page3Data: action.pageData,
            };
        case (POS_CHNG):
            return{
                ...state,
                position:action.position
            };
        case (ALLOW_ADV):
            return{
                ...state,
                advanceTabAccessible:  !state.advanceTabAccessible,
            };
        case(ADD_LIST):
            return{
                ...state,
                resultsList: state.resultsList.concat({
                    key: Math.random().toString(),
                    data: action.data,
                    name: action.name
                }),
            };
        case(REMOVE_LIST):
            return{
                ...state,
                resultsList: state.resultsList.filter(place => {
                    return place.key !== action.key;
                }),
            };
        case(RENAME_LIST):
            newList = state.resultsList.filter(place => {
                            return place.key !== action.key;
                    }).push(
                state.resultsList.filter(place => {
                    return place.key === action.key;
                }).name = action.name
            );
            return{
                ...state
            };
        default:
            return state
    }
};

export default reducer;