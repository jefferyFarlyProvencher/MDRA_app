import HandleReceivedSearch from "../HandleReceivedSearch/HandleReceivedSearch";

let SendRetrieval = async(name,dateFrom, dateTo) => {
    console.log("----FETCHING RESULTS-----\n");
    //let current_query = 'http://132.204.93.102:81/?'+'$' +(dateFrom?dateFrom+"$":"")+(dateTo?dateTo:"");
    //console.log("current sendSearch query is: "+current_query);
    try{
        //GET
        //let response = await fetch(current_query);

        //POST (server not working yet)
        let response = await fetch('http://132.204.93.102:81', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startDate: dateFrom,
                endDate: dateTo,
                token: 0,
                queryType:  "retrieveResults"
            })
        });
        let responseJson = await response.json();
        console.log("RESULT:"+JSON.stringify(responseJson));
        if(responseJson)
            console.log("----FETCHING OVER-----\n");
        //console.log("response: " + JSON.stringify(responseJson['data']));
        //console.log("date: "+ responseJson['date']);
        //console.log("data received: "+ JSON.stringify(responseJson['data']));

        /*
         * Note: [data][recordsets][0] gives us the list of the returned
         */
        let resultToReturn = HandleReceivedSearch((responseJson['data']));
        //console.log("result to return is: "+ JSON.stringify(resultToReturn));
        return resultToReturn;

    }
    catch(err){
        console.log("----FETCHING ERROR-----\n");
        console.log(err);

        return (-1);
    }
};

export default SendRetrieval;