import containsOnlyNumbers from './containsOnlyNumbers';

/**
 * @param time
 * @param convertToHours
 * @return string
 */
let FormatTime = (time, convertToDecimal) => {
    console.log("TIME: "+ time +" <- here");
    if(time!==undefined && time!== "" && time!== null) {
        console.log("This passed: "+ time +" <- here");
        let hours = 0;
        let minutes = 0;
        if (convertToDecimal) {
            if (time.includes(':')) {
                // Clock style to seconds conversion
                const timeArray = time.split(':');
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
                console.log(JSON.stringify(timeArray));
                hours = parseInt(timeArray[0])%24;
                minutes = parseInt(timeArray[1]);
                if(minutes >= 60){
                    hours += parseInt(minutes / 60)%24;
                    minutes = minutes%60;
                }
            }
            else {
                hours = parseInt(time);
                minutes = parseInt((time-hours)*60);
                hours= hours %24;
            }
        }

        //if both parts are composed of only letters
        if(containsOnlyNumbers(hours) && containsOnlyNumbers(minutes)) {
            //console.log("ready to return: "+hours+":"+(minutes<10? minutes+"0":"" + minutes));
            return "" + hours + ":" + (minutes < 10 ? minutes + "0" : ""+ minutes);
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

export default FormatTime;