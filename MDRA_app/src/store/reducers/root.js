import {
    ADD_DATA, ADD_LIST, ALLOW_ADV,
    POS_CHNG, REMOVE_LIST, RENAME_LIST, EMPTY_LIST,
    BACKUP_LIST, RESTORE_BACKUP,ADD_PDF_LIST,
    TOGGLE_INDICATOR_VISIBILITY, REMOVE_PDF_LIST
} from '../actions/actionTypes'

import { Platform } from 'react-native';

const initialState = {
    position: 0,
    Page0Data: null,
    Page1Data: null,
    Page2Data: null,
    Page3Data: null,
    advanceTabAccessible: false,
    receivedData: null,
    resultsList: [],//{key:'1',data:[data],formData:[], name:name, id: id, date, filePDF}}],
    backUpResultList: [], //backup for when doing a full deletion (NOTE: could be done for partial deletion as well)
    indicatorVisibility: 1 //this removes the visibility of the indicator in order to see what we are typing when the glitch keyboard is active
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_DATA+'0'):
            //saves data for page 0 of form
            return {
                ...state,
                Page0Data: action.pageData,
            };
        case (ADD_DATA+'1'):
            //saves data for page 1 of form
            return {
                ...state,
                Page1Data: action.pageData,
            };
        case (ADD_DATA+'2'):
            //saves data for page 2 of form
            return {
                ...state,
                Page2Data: action.pageData,
            };
        case (ADD_DATA+'3'):
            //saves data for page 3 of form
            return {
                ...state,
                Page3Data: action.pageData,
            };
        case (POS_CHNG):
            //position here refers to the position in the form
            return{
                ...state,
                position:action.position
            };
        case (ALLOW_ADV):
            //if position is at advanced screen, return to weights screen
            console.log("this is the current state.position: "+state.position);
            if(state.position === 3)
            {
                console.log("passed the position === 4 test");
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
            //adds a result to the result list
            return{
                ...state,
                resultsList:
                    [{
                        key: Math.random().toString(),
                        data: action.data,
                        formData: action.formData,
                        name: action.name,
                        id: action.name,
                        date:action.date,
                        filePDF: undefined

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
            //console.log(target);
            //console.log("IF NOT NULL HERE WHAT IT SHOULD EQUAL: " + JSON.stringify(state.resultsList[target].name));
            let targetedObject = state.resultsList[target];
            //console.log(JSON.stringify(targetedObject));
            let updatedResult = {
                key: action.key,
                data: targetedObject.data,
                formData: targetedObject.formData,
                name: action.newName,
                id: targetedObject.id,
                date: targetedObject.date,
                filePDF: targetedObject.filePDF

            };
            //console.log(JSON.stringify(updatedResult));
            state.resultsList.splice(target, 1);
            state.resultsList.splice(target, 0, updatedResult);
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

        case(ADD_PDF_LIST):
        {
            let target = action.position;
            //console.log(target);
            let targetedObject = state.resultsList[target];
            //console.log(JSON.stringify(targetedObject));
            let updatedResult = {
            key: targetedObject.key,
            data: targetedObject.data,
            formData: targetedObject.formData,
            name: targetedObject.name,
            id: targetedObject.id,
            date:targetedObject.date,
            filePDF: action.pdfLocation,

        };
            //console.log(JSON.stringify(updatedResult));
            state.resultsList.splice(target, 1);
            state.resultsList.splice(target,0,updatedResult);
            //console.log(JSON.stringify(state.resultsList.name));
            return {
                ...state
            }
        }

        case(REMOVE_PDF_LIST):
        {
            let target = action.position;
            //console.log(target);
            let targetedObject = state.resultsList[target];
            //console.log(JSON.stringify(targetedObject));
            let updatedResult = {
            key: targetedObject.key,
            data: targetedObject.data,
            formData: targetedObject.formData,
            name: targetedObject.name,
            id: targetedObject.id,
            date:targetedObject.date,
            filePDF: undefined,
        };
            //console.log(JSON.stringify(updatedResult));
            state.resultsList.splice(target, 1);
            state.resultsList.splice(target,0,updatedResult);
            //console.log(JSON.stringify(state.resultsList.name));
            return {
                ...state
            }
        }

        //This is a special case for androids keyboard avoiding scroll
            //
        case(TOGGLE_INDICATOR_VISIBILITY):{
            //console.log("toggling indicator");
            if(Platform.OS === 'android'){
                return {
                    ...state,
                    indicatorVisibility: state.indicatorVisibility===0?1:0
                };
            }
            //else{ DO NOTHING }

        }
        default:
            return state
    }
};

export default reducer;