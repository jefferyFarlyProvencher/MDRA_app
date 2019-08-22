import HandleReceivedSearch from "../HandleReceivedSearch/HandleReceivedSearch";
import RNFetchBlob from "rn-fetch-blob";
import {NetInfo} from "react-native";
import HandleReceivedData from "../FormatReceivedData/HandleReceivedData";

let SendRetrieval = async(name,dateFrom, dateTo, token) => {
    console.log("----FETCHING RESULTS-----\n");
    //let current_query = 'http://132.204.93.102:81/?'+'$' +(dateFrom?dateFrom+"$":"")+(dateTo?dateTo:"");
    //console.log("current sendSearch query is: "+current_query);
    if(NetInfo.isConnected) {
        console.log("Passed if");
        let response = false;
        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST', 'https://132.204.93.102/',
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                startDate: dateFrom,
                endDate: dateTo,
                account: token,
                queryType: "retrieveResults"
            }))
            .then((response2) => {
                response = response2
            })
            .catch((error) => {
                console.log('network error: ' + error);
            });
        try {
            //console.log("raw response: " + response);
            //console.log("response: " + JSON.stringify(response));
            let responseJson = await response.json();
            //console.log("RESULT:" + JSON.stringify(responseJson));
            if (responseJson) {
                console.log("----FETCHING OVER-----\n");
                let resultToReturn = HandleReceivedSearch((responseJson['data']));
                //let resultToReturn = [(HandleReceivedData(responseJson['data'])), responseJson['name'], responseJson['date']];
                //console.log("result to return is: "+ JSON.stringify(resultToReturn));
                return resultToReturn;
            }
        } catch (e) {
            console.log("Log in error: " + e)
        }
        return -1;
        // try{
        //     //GET
        //     //let response = await fetch(current_query);
        //
        //     //POST (server not working yet)
        //     let response = await fetch('http://132.204.93.102:81', {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             startDate: dateFrom,
        //             endDate: dateTo,
        //             account: token,
        //             queryType:  "retrieveResults"
        //         })
        //     });
        //     let responseJson = await response.json();
        //     console.log("RESULT:"+JSON.stringify(responseJson));
        //     if(responseJson)
        //         console.log("----FETCHING OVER-----\n");
        //     //console.log("response: " + JSON.stringify(responseJson['data']));
        //     //console.log("date: "+ responseJson['date']);
        //     //console.log("data received: "+ JSON.stringify(responseJson['data']));
        //
        //     /*
        //      * Note: [data][recordsets][0] gives us the list of the returned
        //      */
        //     let resultToReturn = HandleReceivedSearch((responseJson['data']));
        //     //console.log("result to return is: "+ JSON.stringify(resultToReturn));
        //     return resultToReturn;
        //
        // }
        // catch(err){
        //     console.log("----FETCHING ERROR-----\n");
        //     console.log(err);
        //
        //     return (-1);
        // }
    }
};

export default SendRetrieval;