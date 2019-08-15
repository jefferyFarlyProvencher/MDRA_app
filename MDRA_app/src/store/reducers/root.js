import {
    ADD_DATA, ADD_LIST, ALLOW_ADV,
    POS_CHNG, REMOVE_LIST, RENAME_LIST, EMPTY_LIST,
    BACKUP_LIST, RESTORE_BACKUP, ADD_PDF_LIST,
    TOGGLE_INDICATOR_VISIBILITY, REMOVE_PDF_LIST,
    ADD_ACCOUNT, ADD_TO_PATIENT_LIST,
    REMOVE_FROM_PATIENTS_LIST, UPDATE_PATIENT_INFO,
    SET_PATIENT_FORMDATA, EMPTY_PATIENTS_LIST
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
    indicatorVisibility: 1, //this removes the visibility of the indicator in order to see what we are typing when the glitch keyboard is active
    linkedAccount:{name:null,token:null},
    patientsList: [
        {key: Math.random().toString(), name:"Josh Merlin",gender:"Male", weight:"40", kg_lbs:true, color:"#5F55F5" ,dateOfBirth:"2010-09-01", id: "JoshMerlin20100901"},
        {key: Math.random().toString(), name:"Jocelyn Merlina",gender:"Female", weight:"35", kg_lbs:false, color:"#f593dd" ,dateOfBirth:"2009-08-10", id: "JocelynMerlina20100810"}
    ], //this is in preparation for the profile
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
                        patient:action.patient,
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
                patient:targetedObject.patient,
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
            return {
                ...state,
                resultsList: []
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
                patient:targetedObject.patient,
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
            //console.log(JSON.stringify(action));
            if(Platform.OS === 'android'){
                let value = null;
                if(action.value)
                value = action.value? 1:0;
                return {
                ...state,
                        indicatorVisibility: value? value: state.indicatorVisibility===0?1:0
                };
            }
            //else{ DO NOTHING }

        }

        case(ADD_ACCOUNT):
            return {
                ...state,
                linkedAccount: {
                    name: action.name,
                    token: action.token
                }
            };

        case(EMPTY_PATIENTS_LIST):
            return {
                ...state,
                patientsList: []
            }

        case(ADD_TO_PATIENT_LIST):
        {
         //adds a profile to the patient list
            return{
                ...state,
                patientsList:
                    [{
                        key: Math.random().toString(),
                        name:action.name,
                        gender:action.gender,
                        weight:action.weight,
                        kg_lbs:action.kg_lbs,
                        color:action.color,
                        dateOfBirth:action.dateOfBirth,
                        id: (action.name).replace(" ","")+"_"+(action.dateOfBirth.replace(" ","")),//+parseInt(Math.random()*1000+1), <- this is removed because there might be some issues later on lets bet that someone wont share the exact name and birthday as someone else
                        dinerTime: action.dinerTime,
                        bedTime: action.bedTime,
                        formData: null
                        //Gender, Weight, kg/pds, name, bed time, lunch time, dateOfBirth

                    }].concat(state.patientsList),
            };
        }

        case(REMOVE_FROM_PATIENTS_LIST):
        {
           //adds a profile to the patient list
            return{
                ...state,
                patientsList: state.patientsList.filter(patient => {
                    return patient.key !== action.key;
                }),
            };

        }

        case(UPDATE_PATIENT_INFO):
        {
            let i = 0;
            let targetFound = false;



            for(i; i < state.patientsList.length; i++)
            {
                if(action.key === state.patientsList[i].key){
                    targetFound = true;
                    break;
                }
            }

            //update info by creating a new account and replacing at position,
            // because it is faster than verifying if each elements has been changed individually
            let newPatientsList = state.patientsList;
            if(targetFound) {
                newPatientsList[i] = {
                    key: action.key,
                    name: action.name,
                    gender: action.gender,
                    weight: action.weight,
                    kg_lbs: action.kg_lbs,
                    color: action.color,
                    dateOfBirth: action.dateOfBirth,
                    id: action.id,
                    dinerTime: action.dinerTime,
                    bedTime: action.bedTime,
                    formData: action.formData
                    //Gender, Weight, kg/pds, name, bed time, lunch time, dateOfBirth
                };
            }

            console.log("targetFound? "+ targetFound);

            //update a profile to the patient list, and refresh by setting same (but updated) state
            return{
                ...state,
                patientsList: newPatientsList
            }
        }

        case(SET_PATIENT_FORMDATA):{
            let newPatientsList = state.patientsList;

            console.log("Patient id: "+ action.patientID);

            if(action.id !== null)
            {
                let i = 0;
                let targetFound = false;

                for(i; i < state.patientsList.length; i++)
                {
                    if(action.patientID === state.patientsList[i].id){
                        targetFound = true;
                        break;
                    }
                }
                if(targetFound) {
                    let patientTarget = newPatientsList[i];
                    newPatientsList[i] = {
                        key: patientTarget.key,
                        name: patientTarget.name,
                        gender: patientTarget.gender,
                        weight: patientTarget.weight,
                        kg_lbs: patientTarget.kg_lbs,
                        color: patientTarget.color,
                        dateOfBirth: patientTarget.dateOfBirth,
                        id: patientTarget.id,
                        dinerTime: patientTarget.dinerTime,
                        bedTime: patientTarget.bedTime,
                        formData: action.formData
                        //Gender, Weight, kg/pds, name, bed time, lunch time, dateOfBirth
                    };
                }
                console.log("targetFound? "+ targetFound);
            }
                //update a profile to the patient list, and refresh by setting same (but updated) state
            return{
                ...state,
                patientsList: newPatientsList
            }
        }

        /* case(SET_PAGES_DATA)
        * {
        *   return{
                ...state,
                Page0Data: action.page0data,
                Page1Data: action.page1data,
                Page2Data: action.page2data,
                Page3Data: action.page3data,
            };
        * }
        * */
        default:
            return state
    }
};



export default reducer;