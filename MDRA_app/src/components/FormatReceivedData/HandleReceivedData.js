
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

let HandleReceivedData = (data) => {
    //console.log("Received data: "+data);
    if(data && data.length && typeof data ==='string'){
        //removing all useless chars
        data = data.replace(/\n/g, '');
        data = data.replace(/\r/g, '');
        data = data.replace(/ /g, '');
        //console.log("Received data spaces removed: "+data);
        //creating an appropriate
        let allResults = data.split(";");
        //console.log(JSON.stringify(allResults.slice(9,32)));
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

            TIEffD1: parseFloat(allResults[9]),

            TIEffD1s: parseFloat(allResults[9]) !== -1 ?
                parseFloat(allResults[9]).toFixed(0) + ''
                :null,

            TIEffD2: (parseFloat(allResults[10])).toFixed(0) + '',

            TIEffE: (parseFloat(allResults[11])).toFixed(0) + '',

            TotalScore: (parseFloat(allResults[12])).toFixed(0) + '',

            characNRAM: parseFloat(allResults[13]).toPrecision(2),
            characNRRAM: parseFloat(allResults[14]).toPrecision(2),
            characRAM: parseFloat(allResults[15]).toPrecision(2),
            characRARAM: parseFloat(allResults[16]).toPrecision(2),
            characARAM: parseFloat(allResults[17]).toPrecision(2),
            characNRRARAM: parseFloat(allResults[18]).toPrecision(2),

            characNR: parseFloat(allResults[19]).toPrecision(2),
            characNRR: parseFloat(allResults[20]).toPrecision(2),
            characR: parseFloat(allResults[21]).toPrecision(2),
            characRAR: parseFloat(allResults[22]).toPrecision(2),
            characAR: parseFloat(allResults[23]).toPrecision(2),
            characNRRAR: parseFloat(allResults[24]).toPrecision(2),

            characNRNuit: parseFloat(allResults[25]).toPrecision(2),
            characNRRNuit: parseFloat(allResults[26]).toPrecision(2),
            characRNuit: parseFloat(allResults[27]).toPrecision(2),
            characRARNuit: parseFloat(allResults[28]).toPrecision(2),
            characARNuit: parseFloat(allResults[29]).toPrecision(2),
            characNRRARNuit: parseFloat(allResults[30]).toPrecision(2),

            maxPercentile: parseFloat(allResults[31]),

            rce: 100.0 - (parseFloat(allResults[32])).toFixed(0) + ''
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

export default HandleReceivedData;