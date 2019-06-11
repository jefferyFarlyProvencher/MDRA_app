import containsOnlyNumbers from './containsOnlyNumbers';


export let convertTimeToHourFormat = (time) =>
{
    return FormatTime(time, false)
};

export let convertTimeToDecimal = (time, amPmFormat) =>
{
    return FormatTime(time,true)
};

/**
 * @param time
 * @param convertToHours
 * @return string
 */
let FormatTime = (time, convertToDecimalFlag) => {
    //console.log("TIME: "+ time +" <- here");
    if(time!==undefined && time!== "" && time!== null) {
        //console.log("This passed: "+ time +" <- here");
        let hours = 0;
        let minutes = 0;
        if (convertToDecimalFlag) {
            //console.log("flag passed");
            if (time.includes(':')) {
                //console.log("\':\' passed");
                // Clock style to seconds conversion
                const timeArray = time.split(':');
                //last minute verification of empty timeArray[1]
                if(timeArray[1] === "") timeArray[1]= "00";
                //transformation into its appropriate version
                hours = parseInt(timeArray[0]);
                minutes = parseInt(timeArray[1])/60;
            }
            else{
                //console.log("convertToHours True, doesnt include :, Output: " + time);
                return time;
            }
            //console.log("ConvertToHours True, includes \":\", Output: " + (hours+minutes));
            return "" + (hours+minutes);
        }

        else {
            if (time.includes(':')) {
                // Clock style to seconds conversion
                const timeArray = time.split(':');
                //console.log(JSON.stringify(timeArray));
                //last minute verification of empty timeArray[1]
                if(timeArray[1] === "") timeArray[1]= "00";
                //Converts hours over 24 to its respective time the next day
                //e.g. 36 => 12
                minutes = parseInt(timeArray[1]);
                hours = (timeArray[0]==="24" && minutes%60 ===0)?"24":parseInt(timeArray[0])%24;
                //Since we have a base 60 for minutes and we have decimals as an entry
                //we convert; e.g. 80 => 1:20
                if(minutes >= 60){
                    hours += parseInt(minutes / 60)%24;
                    minutes = minutes%60;
                }
            }
            else {
                //if time has no ":", we convert time to its hh.mm value removing extra days
                hours = parseInt(time);
                minutes = parseInt((time-hours)*60);
                //removing extra days
                hours= ((hours===24 && minutes === 0))?"24":hours%24;
            }
        }

        //if both parts are composed of only letters
        if(containsOnlyNumbers(hours) && containsOnlyNumbers(minutes)) {
            //console.log("ready to return: "+hours+":"+(minutes<10? minutes+"0":"" + minutes));
            return "" + hours + ":" + (minutes < 10 ? "0"+ minutes : ""+ minutes);
        }
        //else return erroneous
        else{
            //console.log("there is a mistake in one of these: hour: " + hours + "; minute: " + minutes);
            return time
        }
    }
    else{
        //console.log("if failed");
        return time;
    }
};