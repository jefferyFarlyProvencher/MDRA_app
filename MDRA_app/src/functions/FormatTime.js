/**
 * @param time
 * @param convertToHours
 * @return string
 */
let FormatTime = (time, convertToHours) => {
    console.log("TIME: "+ time);
    if(time) {
        let hours = 0;
        let minutes = 0;
        if (convertToHours) {
            if (time.includes(':')) {
                // Clock style to seconds conversion
                const timeArray = time.split(':');
                hours = parseInt(timeArray[0]);
                minutes = parseInt(timeArray[1])/60;
            }
            else{
                console.log("Output: " + time);
                return time;
            }
            console.log("Output: " + (hours+minutes));
            return "" + hours+minutes;
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

        console.log("ready to return: "+hours+":"+(minutes<10? "0":"")+minutes);
        return ""+hours+":"+(minutes<10? "0":"")+minutes;
    }
    else{
        return time;
    }
};

export default FormatTime;