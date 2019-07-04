import {SET_PATIENT_FORMDATA} from './actionTypes';

export const setPatientLatestForm = (patientID,formData) => {
    console.log("Test test testy test test setPatientsLatestForm");
    return {
        type: SET_PATIENT_FORMDATA,
        patientID:patientID,
        formData: formData
    }
};