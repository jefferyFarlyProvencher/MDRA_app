/**
 * @param text
 * @return boolean
 * adapted to be used with a number having an hour type format
 * ** in other words (text) and (txt:txt)
 */
let containsOnlyNumbers = (text) => {
    //console.log("HEYHEYHEY ITS FAAAAT ALBERT:" + text + "<- help (start of containsOnlyNumbers");
    if(typeof text !== 'undefined' && text || text===0) {
        if(typeof text === "number") text = ""+text;
        //console.log("HEYHEYHEY ITS FAAAAT ALBERT 2: " + text);
        if (text.includes(':')) {
            let hourAndMinutes = text.split(':');
            //console.log("containsOnlyNumbers, if passed (contains :), result: " + ((/^([0-9]+)$/.test(hourAndMinutes[0])) && ((/^([0-9]+)$/.test(hourAndMinutes[1])))));
            return ((/^([0-9]+)$/.test(hourAndMinutes[0])) && ((/^([0-9]+)$/.test(hourAndMinutes[1]))))
        }
        //else
        //console.log("containsOnlyNumbers, else (no :), result: " + (/^([0-9]+)$/.test(text)));
        return (/^([0-9]+)$/.test(text));
    }
};

export default containsOnlyNumbers;