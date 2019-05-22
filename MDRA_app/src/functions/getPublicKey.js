import {NetInfo} from "react-native";

export let register =  async(email, firstName, lastName, password) => {
    console.log("START OF REGISTER TEST");
    if(NetInfo.isConnected) {
        //POST (server not working yet)
        try{
            let response = await fetch('http://132.204.93.102:81/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "queryType": "getPublicKey"
                })
            });
            console.log("raw response: "+ response);
            console.log("response: "+ JSON.stringify(response));
            let responseJson = await response.json();
            console.log("RESULT:"+JSON.stringify(responseJson));
            if(responseJson) {
                console.log("----FETCHING OVER-----\n");
                console.log("name: " + JSON.stringify(responseJson));
                //console.log("data: " + JSON.stringify(responseJson['data']));
                let resultToReturn = HandleReceivedData(responseJson);
                //console.log("result to return is: "+ JSON.stringify(resultToReturn));
                return resultToReturn;
            }
        }
        catch(e)
        {
            console.log("Log in error: "+ e)
        }


    }
    else return -1;

};