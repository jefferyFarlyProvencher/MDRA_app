/**
 *
 * @param name is the name that will be compared
 * @param list is the ResultList
 * @param currentItemKey is the key that identifies the item that we wish to change
 * @returns {boolean}
 */
let isSameName = (name, list, currentTarget) => {
    //console.log("Is same name starting...");
    for (let i = 0; i < list.length; i++) {
        console.log(i);
        if (list[i].name === name && list[i].key !== currentTarget) {
            console.log("Found a match, should display alert...");
            return true;
        }
    }
    return false;
};

export default isSameName;
