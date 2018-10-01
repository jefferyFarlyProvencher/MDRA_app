/**
 *  Convert a string in decimal or clock format in hh:mm format using moment.js
 * @param time
 * @return string
 * credit: this code was formed thanks to tegola on github
 */
let formatTime = (time) => {
    let seconds = 0;

    if(time.includes(':')) {
        // Clock style to seconds conversion
        const timeArray = time.split(':');

        seconds = moment.duration
    }

};

export default formatTime;