import React from 'react'
import {NetInfo} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

let testNetWorkConnection = async() => {
    console.log("START OF CONNECTION TEST");
    if(NetInfo.isConnected)
    {
        console.log("Passed if");
        let response2= false;


        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST','https://132.204.93.102/' ,
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify(
                {"queryType": "connectionTest"}
            )).then((response) => {
            console.log("got into the testNetwork's if/else");
            if (response.respInfo.status === 200) {
                console.log('success');
                response2= true;
            } else {
                console.log('error, response is: '+ JSON.stringify(response) + ' and response status is: '+ JSON.stringify(response["respInfo"]["status"]));
            }
        })
            .catch((error) => {
                console.log('network error: ' + error);
            });
        return response2;
    }

};

export default testNetWorkConnection;