import {RENAME_LIST} from './actionTypes';

export const renameData = (key) => {
  return {
      type: RENAME_LIST,
      key: key
  }
};