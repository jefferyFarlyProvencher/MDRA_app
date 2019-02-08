import {REMOVE_PDF_LIST} from './actionTypes';

export const removePDFFromResult = (position) => {
    return {
        type: REMOVE_PDF_LIST,
        position: position,
    }
};