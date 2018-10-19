import {convertTimeToDecimal} from './FormatTime';

/**
 * @param time1
 * @param time2
 * @return boolean
 * adapted to be used with a number having an hour type format
 * ** in other words (hh:mm)
 * *** returns false when time1 or time2 is a number string
 *  is time1 later or equal to time2
 */
let isLaterThan = (time1, time2) => {
    console.log("///isLaterThanFunction is starting////");
    console.log("Time1: "+time1);
    console.log("Time2: "+time2);
    if ((typeof time1 === 'number' || time1.includes(':') ) && (typeof  time2 === 'number')|| time2.includes(':')){
        //console.log("isLaterThan; if passed; this passed: " + time1+" "+time2 + "; result of include \":\" : "+ (time1.includes(':') && time2.includes(':')));
        let formatedTime1 = parseFloat(convertTimeToDecimal(time1));
        let formatedTime2 = parseFloat(convertTimeToDecimal(time2));
        //console.log("FormatedTimes: from "+ time1 + " to " + formatedTime1 +" and "+ time2 +"to" +formatedTime2);
        let result = (formatedTime1 >= formatedTime2);
        //console.log("result of: " + formatedTime1 + " >= " + formatedTime2 +" = "+result);
        return (formatedTime1 >= formatedTime2)
    }
    console.log("returned false");
    return (false)
};

export default isLaterThan;