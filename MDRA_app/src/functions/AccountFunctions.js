import React from 'react'
import {NetInfo} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

HandleReceivedData= (result) => {
    if(typeof result !== 'undefined')
    {
        if(typeof result['error'] !== 'undefined') {
            return result['error']
        }
        else if(typeof result['token'] !== 'undefined') {
            //return result['token']
            return result//"Registration/LogIn Successful!"
        }
        else if(typeof result['data'] !== 'undefined') {
            return result['data']
        }
        else{
            return "All are undefined"
        }
    }
    else{
        return "All are undefined"
    }
};

export let logIn = async(email, password) => {
    console.log("START OF LOGIN TEST");
    if(NetInfo.isConnected)
    {
        console.log("Passed if");
        let response= false;
        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST','https://132.204.93.102/' ,
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                "email": email,
                "password": password,
                "queryType": "logIn"
            }))
            .then((response2) => {
                response = response2
            })
            .catch((error) => {
                console.log('network error: ' + error);
            });

        try{
            console.log("raw response: "+ response);
            console.log("response: "+ JSON.stringify(response));
            let responseJson = await response.json();
            console.log("RESULT:"+JSON.stringify(responseJson));
            if(responseJson) {
                console.log("----FETCHING OVER-----\n");
                console.log("name: " + JSON.stringify(responseJson));
                //console.log("data: " + JSON.stringify(responseJson['data']));
                //let resultToReturn = [(HandleReceivedData(responseJson['data'])), responseJson['name'], responseJson['date']];
                //console.log("result to return is: "+ JSON.stringify(resultToReturn));
                return this.HandleReceivedData(responseJson);
            }
        }catch(e){
            console.log("Log in error: "+ e)
        }
        return -1;
    }
    // if(NetInfo.isConnected) {
    //     //POST (server not working yet)
    //     try{
    //         let response = await fetch('https://132.204.93.102/', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 "email": email,
    //                 "password": password,
    //                 "queryType": "logIn"
    //             })
    //         });
    //         console.log("raw response: "+ response);
    //         console.log("response: "+ JSON.stringify(response));
    //         let responseJson = await response.json();
    //         console.log("RESULT:"+JSON.stringify(responseJson));
    //         if(responseJson) {
    //             console.log("----FETCHING OVER-----\n");
    //             console.log("name: " + JSON.stringify(responseJson));
    //             //console.log("data: " + JSON.stringify(responseJson['data']));
    //             //let resultToReturn = [(HandleReceivedData(responseJson['data'])), responseJson['name'], responseJson['date']];
    //             //console.log("result to return is: "+ JSON.stringify(resultToReturn));
    //             return this.HandleReceivedData(responseJson);
    //         }
    //     }
    //     catch(e)
    //     {
    //         console.log("Log in error: "+ e)
    //     }
    //}
    else return -1;

};



export let register =  async(email, firstName, lastName, password) => {
    //POST (server not working yet)
    console.log("START OF REGISTER TEST");
    if(NetInfo.isConnected) {
        console.log("Passed if");
        let response= false;
        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST','https://132.204.93.102/' ,
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "queryType": "register"
            }))
            .then((response2) => {
                response = response2
            })
            .catch((error) => {
                console.log('network error: ' + error);
            });
        try{
            //console.log("raw for register response: "+ response);
            //console.log("response: "+ JSON.stringify(response));
            let responseJson = await response.json();
            //console.log("RESULT:"+JSON.stringify(responseJson));
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
        // try{
        //     let response = await fetch('https://132.204.93.102/', {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             "email": email,
        //             "password": password,
        //             "firstName": firstName,
        //             "lastName": lastName,
        //             "queryType": "register"
        //         })
        //     });
        //     console.log("raw response: "+ response);
        //     console.log("response: "+ JSON.stringify(response));
        //     let responseJson = await response.json();
        //     console.log("RESULT:"+JSON.stringify(responseJson));
        //     if(responseJson) {
        //         console.log("----FETCHING OVER-----\n");
        //         console.log("name: " + JSON.stringify(responseJson));
        //         //console.log("data: " + JSON.stringify(responseJson['data']));
        //         let resultToReturn = HandleReceivedData(responseJson);
        //         //console.log("result to return is: "+ JSON.stringify(resultToReturn));
        //         return resultToReturn;
        //     }
        // }
        // catch(e)
        // {
        //     console.log("Register error: "+ e)
        // }
    else return -1;

};
