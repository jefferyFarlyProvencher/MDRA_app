import React from 'react'
import {NetInfo} from 'react-native';

let testNetWorkConnection = () => {
    console.log("START OF CONNECTION TEST");
    if(NetInfo.isConnected)
    {
      fetch('http://132.204.93.102:81')
          .then((response) => {
              if (response.status === 200) {
                  console.log('success');
                  return true;
              } else {
                  console.log('error');
              }
          })
          .catch((error) => {
              console.log('network error: ' + error);
          })
    }
    return false;
};

export default testNetWorkConnection;