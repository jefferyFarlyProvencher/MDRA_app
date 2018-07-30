export default HandleReceivedData = (data) => {

    let allResults = data.split(";");
    let receivedData = {

         percentile10 : allResults[0].split(","),

         percentile20 : allResults[1].split(","),

         percentile30 : allResults[2].split(","),

         percentile40 : allResults[3].split(","),

         percentileY : allResults[4].split(","),

         percentile60 : allResults[5].split(","),

         percentile70 : allResults[6].split(","),

         percentile80 : allResults[7].split(","),

         percentile90 : allResults[8].split(","),

         TIEffD1s: parseFloat(allResults[9])!==-1?
             parseFloat(allResults[9]).toFixed(0) + '%'
             :null,

         TIEffD2 : (parseFloat(allResults[10])).toFixed(0) + '%',

         TIEffE : (parseFloat(allResults[11])).toFixed(0) + '%',

         TotalScore : (parseFloat(allResults[12])).toFixed(0) + '%',

         characNRAM : parseFloat(allResults[13]),
         characNRRAM : parseFloat(allResults[14]),
         characRAM : parseFloat(allResults[15]),
         characRARAM : parseFloat(allResults[16]),
         characARAM : parseFloat(allResults[17]),
         characNRRARAM : parseFloat(allResults[18]),

         characNR : parseFloat(allResults[19]),
         characNRR : parseFloat(allResults[20]),
         characR : parseFloat(allResults[21]),
         characRAR : parseFloat(allResults[22]),
         characAR : parseFloat(allResults[23]),
         characNRRAR : parseFloat(allResults[24]),

         characNRNuit : parseFloat(allResults[25]),
         characNRRNuit : parseFloat(allResults[26]),
         characRNuit : parseFloat(allResults[27]),
         characRARNuit : parseFloat(allResults[28]),
         characARNuit : parseFloat(allResults[29]),
         characNRRARNuit : parseFloat(allResults[30]),

         maxPercentile : parseFloat(allResults[31]),

         rce : 100.0 - (parseFloat(allResults[32])).toFixed(0) + '%'
    };
    return receivedData;
};