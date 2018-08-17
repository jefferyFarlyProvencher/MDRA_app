import {REMOVE_LIST} from './actionTypes';

export const removeData = (key) => {
  return {
      type: REMOVE_LIST,
      key: key
  }
};