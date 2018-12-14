import {
    ADD_DATA, ADD_LIST, ALLOW_ADV,
    POS_CHNG, REMOVE_LIST, RENAME_LIST, EMPTY_LIST, BACKUP_LIST, RESTORE_BACKUP
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
    resultsList: [],//{key:'1',data:[data],formData:[], name:name, id: id}}],
    backUpResultList: []//backup for when doing a full deletion (NOTE: could be done for partial deletion as well)
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
            //if position is at advanced screen, return to weights screen
            if(state.position === 3)
            {
                return{
                    ...state,
                    position:2,
                    advanceTabAccessible:  !state.advanceTabAccessible,
                };
            }
            else{
                return{
                    ...state,
                    advanceTabAccessible:  !state.advanceTabAccessible,
                };
            }
        case(ADD_LIST):
            return{
                ...state,
                resultsList:
                    [{
                        key: Math.random().toString(),
                        data: action.data,
                        formData: action.formData,
                        name: action.name,
                        id: action.name
                    }].concat(state.resultsList),
            };
        case(REMOVE_LIST):
            return{
                ...state,
                resultsList: state.resultsList.filter(result => {
                    return result.key !== action.key;
                }),
            };
        case(RENAME_LIST): {
            let target = 0;
            console.log(state.resultsList.length);
            for (let i = 0; i < state.resultsList.length; i++) {
                console.log(i);
                if (state.resultsList[i].key === action.key) {
                    target = i;
                    break;
                }
            }
            console.log(target);
            console.log("IF NOT NULL HERE WHAT IT SHOULD EQUAL: " + JSON.stringify(state.resultsList[target].name));
            let targetedObject = state.resultsList[target];
            console.log(JSON.stringify(targetedObject));
            let updatedResult = {
                key: targetedObject.key,
                data: targetedObject.data,
                formData: targetedObject.formData,
                name: action.newName,
                id: targetedObject.id
            };
            //console.log(JSON.stringify(updatedResult));
            state.resultsList.splice(target, 1);
            state.resultsList.splice(target,0,updatedResult);
            //console.log(JSON.stringify(state.resultsList.name));
            return {
                ...state
            }
        }
        case(EMPTY_LIST):
        {
            return {
                ...state,
                resultsList: []
            }
        }
        case(BACKUP_LIST):
        {
            let backUp = state.resultsList.slice();
            return{
                ...state,
                backUpResultList: backUp

            }
        }

        case(RESTORE_BACKUP):
        {
            let restoredBackUp = state.backUpResultList.slice();
            return{
                ...state,
                resultsList: restoredBackUp,
                backUpResultList: []

            }
        }
        default:
            return state
    }
};

export default reducer;