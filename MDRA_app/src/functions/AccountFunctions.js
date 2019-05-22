import React from 'react'
import {NetInfo} from 'react-native';

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
                    "email": email,
                    "password": password,
                    "queryType": "logIn"
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
                //let resultToReturn = [(HandleReceivedData(responseJson['data'])), responseJson['name'], responseJson['date']];
                //console.log("result to return is: "+ JSON.stringify(resultToReturn));
                return this.HandleReceivedData(responseJson);
            }
        }
        catch(e)
        {
            console.log("Log in error: "+ e)
        }


    }
    else return -1;

};



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
                    "email": email,
                    "password": password,
                    "firstName": firstName,
                    "lastName": lastName,
                    "queryType": "register"
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
