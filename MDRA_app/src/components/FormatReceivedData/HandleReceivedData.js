
/*
 * FormatReceivedData works as a data reducer,
 * although it messes up the graphs afterwards...
 * so right now it is called but doesn't do anything
 * ***UPDATE*** reducer is located on the tracer itself (graph), not on the handleData
 * so I should delete it, but too lazy rn
 */
let formatReceivedData = (fullData) => {
    let halfedData = [];
    let thirdData = [];
    //divide by two
    for(let i = 0; i < fullData.length; i=i+2)
    {
      halfedData.push(fullData[i]);
    }
    //divide by three
    for(let i = 0; i < fullData.length; i=i+3)
    {
        thirdData.push(fullData[i]);
    }
  return fullData;
};

export default HandleReceivedData = (data) => {
    console.log("Received data: "+data);
    if(data && data.length && typeof data ==='string'){
        //removing all useless chars
        data = data.replace(/\n/g, '');
        data = data.replace(/\r/g, '');
        data = data.replace(/ /g, '');

        //creating an appropriate
        let allResults = data.split(";");
        let receivedData = {

            allResults: allResults,

            percentile10: formatReceivedData(allResults[0].split(",")),

            percentile20: formatReceivedData(allResults[1].split(",")),

            percentile30: formatReceivedData(allResults[2].split(",")),

            percentile40: formatReceivedData(allResults[3].split(",")),

            percentileY: formatReceivedData(allResults[4].split(",")),

            percentile60: formatReceivedData(allResults[5].split(",")),

            percentile70: formatReceivedData(allResults[6].split(",")),

            percentile80: formatReceivedData(allResults[7].split(",")),

            percentile90: formatReceivedData(allResults[8].split(",")),

            TIEffD1s: parseFloat(allResults[9]) !== -1 ?
                parseFloat(allResults[9]).toFixed(0) + '%'
                : null,

            TIEffD2: (parseFloat(allResults[10])).toFixed(0) + '%',

            TIEffE: (parseFloat(allResults[11])).toFixed(0) + '%',

            TotalScore: (parseFloat(allResults[12])).toFixed(0) + '%',

            characNRAM: parseFloat(allResults[13]),
            characNRRAM: parseFloat(allResults[14]),
            characRAM: parseFloat(allResults[15]),
            characRARAM: parseFloat(allResults[16]),
            characARAM: parseFloat(allResults[17]),
            characNRRARAM: parseFloat(allResults[18]),

            characNR: parseFloat(allResults[19]),
            characNRR: parseFloat(allResults[20]),
            characR: parseFloat(allResults[21]),
            characRAR: parseFloat(allResults[22]),
            characAR: parseFloat(allResults[23]),
            characNRRAR: parseFloat(allResults[24]),

            characNRNuit: parseFloat(allResults[25]),
            characNRRNuit: parseFloat(allResults[26]),
            characRNuit: parseFloat(allResults[27]),
            characRARNuit: parseFloat(allResults[28]),
            characARNuit: parseFloat(allResults[29]),
            characNRRARNuit: parseFloat(allResults[30]),

            maxPercentile: parseFloat(allResults[31]),

            rce: 100.0 - (parseFloat(allResults[32])).toFixed(0) + '%'
        };
        //console.log("RECEIVED DATA: " + JSON.stringify(receivedData));
        return receivedData;
    }
    else{
        console.log("not a string or string is empty");
        console.log(data);
        return -1;
    }
};