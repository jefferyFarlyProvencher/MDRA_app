import React from 'react'
import {NetInfo} from 'react-native';

let testNetWorkConnection = async() => {
    console.log("START OF CONNECTION TEST");
    if(NetInfo.isConnected)
    {
        let response2= false;
        await fetch('http://132.204.93.102:81/' , {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "queryType": "connectionTest"
            })
        })
          .then((response) => {
              if (response.status === 200) {
                  console.log('success');
                  response2= true;
              } else {
                  console.log('error');
              }
          })
          .catch((error) => {
              console.log('network error: ' + error);
        });
        return response2;
    }

};

export default testNetWorkConnection;