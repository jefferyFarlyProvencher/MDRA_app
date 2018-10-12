import FormatTime from './FormatTime';

/**
 * @param time1
 * @param time2
 * @return boolean
 * adapted to be used with a number having an hour type format
 * ** in other words (hh:mm)
 *  is time1 later than time2
 */
let isLaterThan = (time1, time2) => {
    if (time1.includes(':') && time2.includes(':')){
        let formatedTime1 = FormatTime(time1,true);
        let formatedTime2 = FormatTime(time2,true);
        return (formatedTime1 > formatedTime2)
    }
    return (false)
};

export default isLaterThan;