/*
*   prepare pills returns the right amount of pills to the final
 */

/*
*                                    dose0: '10',
                                    adminTime0: '',
                                    formula0: 'Ritalin IR',
                                    food0: 'No',
                                    dose1: '10',
                                    adminTime1: '',
                                    formula1: 'Ritalin IR',
                                    food1: 'No',
                                    dose2: '10',
                                    adminTime2: '',
                                    formula2: 'Ritalin IR',
                                    food2: 'No',
                                    dose3: '10',
                                    adminTime3: '',
                                    formula3: 'Ritalin IR',
                                    food3: 'No'
*
*
 */




preparePills = (page0Data) => {
    let elementTOreturn = (
        'formulation1='+page0Data.formula0 +
        '&quantitedose1='+page0Data.dose0 +
        '&momentdose1='+page0Data.adminTime0 +
        '&Food1='+(page0Data.food0 ==='Yes'? '1':'0')+ //turns yes/no into bool vals
    ((page0Data.amountOfPills > 1)
        ?
        'formulation2='+page0Data.formula1 +
        '&quantitedose2='+page0Data.dose1 +
        '&momentdose2=8'+page0Data.adminTime1 +
        '&Food2='+(page0Data.food1 ==='Yes'? '1':'0')
        :'')+
    ((page0Data.amountOfPills > 2)
        ?
        'formulation3='+page0Data.formula2 +
        '&quantitedose3='+page0Data.dose2 +
        '&momentdose3='+page0Data.adminTime2 +
        '&Food3='+(page0Data.food2 ==='Yes'? '1':'0')
        :'')+
    ((page0Data.amountOfPills > 3)
        ?
        'formulation4='+page0Data.formula3 +
        '&quantitedose4='+page0Data.dose3 +
        '&momentdose4='+page0Data.adminTime3 +
        '&Food4='+(page0Data.food3 ==='Yes'? '1':'0')
        :'')
    );

    console.log (elementTOreturn);
    return elementTOreturn;
};

export default PrepareToSend= (data) => {
    //TODO: Add the necessary items to complete the preparation
    let page0Data = data.Page0Data;
    let page1Data = data.Page1Data;
    let page2Data = data.Page2Data
        ? data.Page2Data //if else continues bellow
        : {
            weight1: "100",
            weight2: "100",
            weight3: "100",
            weight4: "100",
            weight5: "100",
            weight6: "100",
            weight7: "100",
        };
    let page3Data = data.Page3Data //if else continues bellow
        ? data.Page3Data
        : {
            numbberOfSimulations: '1000',
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

    if (verifyData(page0Data, page1Data, page2Data, page3Data)){

        dataToReturn = '/?nInd=' + page3Data.numberOfSimulations +
            '&Gender=' + page0Data.gender +
            '&weight=' + (page0Data.switchWeightFormat  //turns lbs to kg
                ? ""+parseFloat(page0Data.weight)*0.45359237
                :page0Data.weight) +
            '&a=' + page3Data.cMinTheraputicDayPM +
            '&b=' + page3Data.cMaxTheraputicDayPM +
            '&c=' + page1Data.tsEvening  +
            '&d=' + page1Data.teEvening  +
            '&e=' + page3Data.cMinTheraputicEvening  +
            '&f=' + page3Data.cMaxTheraputicEvening  +
            '&g=' + page1Data.tsEvening  +
            '&h=' + page1Data.teEvening  +
            '&WTI1=' + page2Data.weight1 +
            '&WTI2=' + page2Data.weight2 +
            '&WTI3=' + page2Data.weight3 +
            '&WTI4=' + page2Data.weight4 +
            '&WTI5=' + page2Data.weight5 +
            '&WTI6=' + page2Data.weight6 +
            '&WTI7=' + page2Data.weight7 +
            '&palier=' + page3Data.threshold +
            '&za=' + page3Data.cMinTheraputicHalfDayAM +
            '&zb=' + page3Data.cMaxTheraputicHalfDayAM +
            '&zc=' + page3Data.cMinTheraputicDayPM +
            '&zd=' + page3Data.cMaxTheraputicDayPM +
            '&zzc=' + page3Data.cMinTheraputicEvening +
            '&zzd=' + page3Data.cMaxTheraputicEvening +
            '&heureducoucher=' + page1Data.bed +
            '&startLunchTime=' + page1Data.lunch +
            'Morning=0'+
            preparePills(page0Data);

    }
    let placebotDataToReturn =
        'nInd=1000' +
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

    console.log(dataToReturn);
    return placebotDataToReturn;
}

let verifyData = (page0,page1,page2,page3) => {
    return true//We hope that formik's/yup's verification works properly....
};
