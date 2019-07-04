let timeToAmPmFormat = (value) => {
    let unadjustedValue = value;
    //console.log("unadjustedValue: "+ unadjustedValue + " for " + this.props.name);
    let adjustedValue = "";
    if(unadjustedValue === '')
    {
        unadjustedValue = ["",""];
        adjustedValue = '??:?? AM'
    }
    else if(unadjustedValue.includes("AM") || unadjustedValue.includes("PM") )
    {
        adjustedValue = unadjustedValue
    }else{
        unadjustedValue = unadjustedValue.split(":");
        //console.log("updated 1 unadjustedValue: "+ unadjustedValue);
        let amOrPm = "AM";

        if(parseInt(unadjustedValue[0]) > 11)
        {
            //console.log("unajustedValue: "+unadjustedValue[0]);
            if(unadjustedValue[0] !== "24")
                amOrPm = "PM";

            if(unadjustedValue[0] !== '12') {
                unadjustedValue[0] = parseInt(unadjustedValue[0]) - 12;
            }
        }
        if(unadjustedValue[0] === '0' || unadjustedValue[0] === '00' ){
            unadjustedValue[0] = '12';
        }
        //console.log("updated 2 unadjustedValue: "+ unadjustedValue);

        adjustedValue = unadjustedValue[0]+":"+unadjustedValue[1]+" "+amOrPm;
    }

    return adjustedValue;
};

export default timeToAmPmFormat;