export default PrepareToSend= () => {
    /*let page0Data = page0;
    let page1Data = page1;
    let page2Data = page2
        ? page2 //if else continues bellow
        : {
            weight1: "100",
            weight2: "100",
            weight3: "100",
            weight4: "100",
            weight5: "100",
            weight6: "100",
            weight7: "100",
        };
    let page3Data = page3 //if else continues bellow
        ? page3
        : {
            tsTimeHalfDayAM: '8',
            teTimeHalfDayAM: '12',
            tsTimeHalfDayPM: '12',
            teTimeHalfDayPM: '16',
            cMinTheraputicHalfDayAM: '6',
            cMaxTheraputicHalfDayAM: '20',
            cMinTheraputicDayPM: '6',
            cMaxTheraputicDayPM: '20',
            cMinTheraputicEvening: '0',
            cMaxTheraputicEvening: '6',
            threshold: '80'
        };

    let dataToReturn = '-1';

    if (verifyData(page0, page1, page2, page3)){

        dataToReturn = '/?nInd=' + page0Data.numberOfSimulations +
            '&Gender=' + page0Data.gender +
            '&weight=' + page0Data.weight +
            '&a=' + page0Data +
            '&b=' + page0Data +
            '&c=' + page0Data +
            '&d=' + page0Data +
            '&e=' + page0Data +
            '&f=' + page0Data +
            '&g=' + page0Data +
            '&h=' + page0Data +
            '&WTI1=' + page2Data.weight1 +
            '&WTI2=' + page2Data.weight2 +
            '&WTI3=' + page2Data.weight3 +
            '&WTI4=' + page2Data.weight4 +
            '&WTI5=' + page2Data.weight5 +
            '&WTI6=' + page2Data.weight6 +
            '&WTI7=' + page2Data.weight7 +
            '&palier=' + page3Data.threshold +
            '&za=' + page0Data +
            '&zb=' + page0Data +
            '&zc=' + page0Data +
            '&zd=' + page0Data +
            '&zzc=' + page0Data +
            '&zzd=' + page0Data +
            '&heureducoucher=' + page1Data +
            '&startLunchTime=' + page1Data +
            'Morning=' + page1Data +
            '&formulation1=' + page1Data +
            '&quantitedose1=' + page1Data +
            '&momentdose1=' + page1Data +
            'Food1=' + page3Data;

    }*/
    let placebotDataToReturn = '?nInd=1000' +
        '&Gender=1' +
        '&weight=40' +
        '&a=6' +
        '&b=20' +
        '&c=8' +
        '&d=18' +
        '&e=0' +
        '&f=6' +
        '&g=20' +
        '&h=22' +
        '&WTI1=100' +
        '&WTI2=100' +
        '&WTI3=100&' +
        'WTI4=100' +
        '&WTI5=100' +
        '&WTI6=0' +
        '&WTI7=0' +
        '&palier=80' +
        '&za=6' +
        '&zb=20' +
        '&zc=-1' +
        '&zd=-1' +
        '&zzc=-1' +
        '&zzd=-1' +
        '&heureducoucher=22' +
        '&startLunchTime=12' +
        '&Morning=0&' +
        'formulation1=1' +
        '&quantitedose1=10' +
        '&momentdose1=8' +
        '&Food1=0';

    return placebotDataToReturn;
}

let verifyData = (page0,page1,page2,page3) => {
    return true//We hope that formik's/yup's verification works properly....
};
