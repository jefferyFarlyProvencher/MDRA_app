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

findFormulaNumber = (pillName) => {
  switch(pillName) {
      case "Ritalin IR":
          return 1;
      case "Pms-Methylphenidate IR":
          return 2;
      case "Concerta":
          return 3;
      case "Pms-Methylphenidate ER":
          return 4;
  }
};

handleMultiBoxes = (page1Data) => {
    console.log("hey");
    let elementToReturn = "";
    if(page1Data.nbTheraputicBoxes === "One therapeutic box (from AM to PM)"){
        elementToReturn += '&zc=-1&zd=-1&zzc=-1&zzd=-1';
    }
    else if(page1Data.nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)")
    {
        elementToReturn += (
            '&zc=' + page1Data.tsDay +
            '&zd=' + page1Data.teDay +
            '&zzc=' + page1Data.tsPM +
            '&zzd=' + page1Data.tePM);
    }
    console.log(elementToReturn);
    return elementToReturn
};

/*
    Sets the proper amount of pills by adding the corresponding 1,2,3,4
     texts to the overall request.
 */
preparePills = (page0Data) => {
    let elementToReturn = (
        '&formulation1='+findFormulaNumber(page0Data.formula0) +
        '&quantitedose1='+page0Data.dose0 +
        '&momentdose1='+page0Data.adminTime0 +
        '&Food1='+(page0Data.food0 ==='Yes'? '1':'0')+ //turns yes/no into bool vals
    ((page0Data.amountOfPills > 1)
        ?
        '&formulation2='+findFormulaNumber(page0Data.formula1) +
        '&quantitedose2='+page0Data.dose1 +
        '&momentdose2='+page0Data.adminTime1 +
        '&Food2='+(page0Data.food1 ==='Yes'? '1':'0')
        :'')+
    ((page0Data.amountOfPills > 2)
        ?
        '&formulation3='+findFormulaNumber(page0Data.formula2) +
        '&quantitedose3='+page0Data.dose2 +
        '&momentdose3='+page0Data.adminTime2 +
        '&Food3='+(page0Data.food2 ==='Yes'? '1':'0')
        :'')+
    ((page0Data.amountOfPills > 3)
        ?
        '&formulation4='+findFormulaNumber(page0Data.formula3) +
        '&quantitedose4='+page0Data.dose3 +
        '&momentdose4='+page0Data.adminTime3 +
        '&Food4='+(page0Data.food3 ==='Yes'? '1':'0')
        :'')
    );

    //console.log (elementToReturn);
    return elementToReturn;
};

verifyUnitConversion = (originalWeight, switchWeightFormat) => {
    let allo = (switchWeightFormat  //turns lbs to kg
        ? (""+parseFloat(originalWeight)*0.45359237)
        :originalWeight);
    return allo;
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
    let page3Data = data.Page3Data //? : continues bellow
        ? data.Page3Data
        : {
            numberOfSimulations: '1000',
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
        let doesItHaveTwoBoxes = page1Data.nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)";
        dataToReturn = (
            'nInd=' + page3Data.numberOfSimulations +
            '&Gender=' + (page0Data.gender==='Male'?'1': '0') +
            '&weight=' + verifyUnitConversion(page0Data.weight, page0Data.switchWeightFormat) +
            '&a=' + page3Data.cMinTheraputicDayPM +
            '&b=' + page3Data.cMaxTheraputicDayPM +
            '&c=' + ((doesItHaveTwoBoxes)
                ? page1Data.tsPM
                : page1Data.tsDay)
                +
            '&d=' + ((doesItHaveTwoBoxes)
                ? page1Data.tePM
                : page1Data.teDay)
                +
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
            handleMultiBoxes(page1Data)+
            '&heureducoucher=' + page1Data.bed +
            '&startLunchTime=' + page1Data.lunch +
            '&Morning='+ ((doesItHaveTwoBoxes)
                ? 1 : 0)+
            preparePills(page0Data));

    }

    //console.log("DATA TO SEND: "+ dataToReturn);
    return dataToReturn;
}

//TODO?
let verifyData = (page0,page1,page2,page3) => {
    return true//We hope that formik's/yup's verification works properly....
};
