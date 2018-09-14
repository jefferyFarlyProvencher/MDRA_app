import {RENAME_LIST} from './actionTypes';

export const renameData = (key, newName) => {
  return {
      type: RENAME_LIST,
      key: key,
      newName: newName
  }
};