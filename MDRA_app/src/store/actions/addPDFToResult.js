import {ADD_PDF_LIST} from './actionTypes';

export const addPDFToResult = (position, pdfLocation) => {
    return {
        type: ADD_PDF_LIST,
        position: position,
        pdfLocation: pdfLocation
    }
};