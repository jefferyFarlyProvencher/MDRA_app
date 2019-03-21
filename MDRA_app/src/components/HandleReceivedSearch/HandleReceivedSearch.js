import HandleReceivedData from '../FormatReceivedData/HandleReceivedData';
import {convertTimeToHourFormat} from '../../functions/FormatTime';
//{key:'1',data:[data],formData:[], name:name, id: id, date, filePDF}}],
/*

constructor uses ->  (data, name, formData, date)

then stores it like this:

 resultsList:
    [{
        key: Math.random().toString(),
        data: action.data,
        formData: action.formData,
        name: action.name,
        id: action.name,
        date:action.date,
        filePDF: undefined

    }].concat(state.resultsList),




    let formData = [
        this.props.state.main.Page0Data,
        this.props.state.main.Page1Data,
        this.props.state.main.Page2Data,
        this.props.state.main.advanceTabAccessible
            ?this.props.state.main.Page3Data
            :{
                numberOfSimulations: '1000',
                tsTimeHalfDayAM: '8',
                teTimeHalfDayAM: '12',
                tsTimeHalfDayPM: '12',
                teTimeHalfDayPM: '16',
                cMinTherapeuticHalfDayAM: '6',
                cMaxTherapeuticHalfDayAM: '20',
                cMinTherapeuticDayPM: '6',
                cMaxTherapeuticDayPM: '20',
                cMinTherapeuticEvening: '0',
                cMaxTherapeuticEvening: '6',
                threshold: '80'},
        this.props.state.main.advanceTabAccessible
    ];
 */

/*
 THis is not a good way to verify if accessed, as this method is extremely coupled with the currentAdvanceTab
 //TODO: rethink of a way to do the verification
 */
let verifyIfAdvancedTabAccessed = (currentAdvanceTab) =>
{
    let defaultAdvanceTab = {
        numberOfSimulations: '1000',
        tsTimeHalfDayAM: '8' ,
        teTimeHalfDayAM: '12',
        tsTimeHalfDayPM: '12',
        teTimeHalfDayPM: '16',
        cMinTherapeuticHalfDayAM: '6',
        cMaxTherapeuticHalfDayAM: '20',
        cMinTherapeuticDayPM: '6',
        cMaxTherapeuticDayPM: '20',
        cMinTherapeuticEvening: '0',
        cMaxTherapeuticEvening: '6',
        threshold: '80',
    };


    return (
        defaultAdvanceTab["numberOfSimulations"] === currentAdvanceTab["numberOfSimulations"] &&
        defaultAdvanceTab["tsTimeHalfDayAM"] === currentAdvanceTab["tsTimeHalfDayAM"] &&
        defaultAdvanceTab["teTimeHalfDayAM"] === currentAdvanceTab["teTimeHalfDayAM"] &&
        defaultAdvanceTab["tsTimeHalfDayPM"] === currentAdvanceTab["tsTimeHalfDayPM"] &&
        defaultAdvanceTab["teTimeHalfDayPM"] === currentAdvanceTab["teTimeHalfDayPM"] &&
        defaultAdvanceTab["cMinTherapeuticHalfDayAM"] === currentAdvanceTab["cMinTherapeuticHalfDayAM"] &&
        defaultAdvanceTab["cMaxTherapeuticHalfDayAM"] === currentAdvanceTab["cMaxTherapeuticHalfDayAM"] &&
        defaultAdvanceTab["cMinTherapeuticDayPM"] === currentAdvanceTab["cMinTherapeuticDayPM"] &&
        defaultAdvanceTab["cMaxTherapeuticDayPM"] === currentAdvanceTab["cMaxTherapeuticDayPM"] &&
        defaultAdvanceTab["cMinTherapeuticEvening"] === currentAdvanceTab["cMinTherapeuticEvening"] &&
        defaultAdvanceTab["cMaxTherapeuticEvening"] === currentAdvanceTab["cMaxTherapeuticEvening"] &&
        defaultAdvanceTab["threshold"] === currentAdvanceTab["threshold"]

    )
};

let reverseFindFormulaNumber = (pillNumber) => {
    switch(pillNumber) {
        case '1':
            return "Ritalin IR";
        case '2':
            return "Pms-Methylphenidate IR";
        case '3':
            return "Concerta";
        case '4':
            return "Pms-Methylphenidate ER";
    }
};


//LISTEN THIS IS FUCKING DISGUSTING PROGRAMMING AND IT IS NOT MY FUCKING FAULT FUCK

let ReversePrepareToSend = (input) => {
    let currentInput = input.slice(2,input.length);
    console.log('current reverseprepareSend\'s input: '+ currentInput);
    //lets prepare the objects...?
    //by using the default values

    //Page 0 => initial equivalent
    let newPage0Object = {
            gender: 'Male',
            weight: '40',
            dose0: '10',
            adminTime0: "",
            formula0: "Ritalin IR",
            food0: "No",
            dose1: "10",
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
            food3: 'No',
            amountOfPills: 1,
            switchWeightFormat: false
        };
    //page 1 => timeZonage
    let newPage1Object = {
            nbTherapeuticBoxes:"One therapeutic box (AM to PM)",
            tsDay: '6:00',
            teDay:'15:00',
            tsPM:'15:00',
            tePM:'18:00',
            tsEvening:'18:00',
            teEvening:'20:00',
            lunch:'12:00',
            bed:'24:00',
        };

    //page 2 => weights
    let newPage2Object = {
            weight1:-1,
            weight2:-1,
            weight3:-1,
            weight4:-1,
            weight5:-1,
            weight6:-1,
            weight7:-1
        };

    //page 3 => advanced
    let newPage3Object = {
            numberOfSimulations: '1000',
            tsTimeHalfDayAM: '8' ,
            teTimeHalfDayAM: '12',
            tsTimeHalfDayPM: '12',
            teTimeHalfDayPM: '16',
            cMinTherapeuticHalfDayAM: '6',
            cMaxTherapeuticHalfDayAM: '20',
            cMinTherapeuticDayPM: '6',
            cMaxTherapeuticDayPM: '20',
            cMinTherapeuticEvening: '0',
            cMaxTherapeuticEvening: '6',
            threshold: '80',
        };

    //the prepareToSendResult looks something like this:
    //nInd=1000&Gender=1&weight=40&a=6&b=20&c=8&d=18&e=0&f=6&g=20&h=22&WTI1=100&WTI2=100&WTI3=100&WTI4=100&WTI5=100&WTI6=0&WTI7=0&palier=80&za=6&zb=20&zc=-1&zd=-1&zzc=-1&zzd=-1&heureducoucher=22&startLunchTime=12&Morning=0&formulation1=1&quantitedose1=30&momentdose1=8&Food1=0
    //so we need all the indices' equivalent
    let indicesList = {
        nInd: 'numberOfSimulations',
        Gender: 'gender',
        weight:'weight',
        a:'cMinTherapeuticDayPM',
        b:'cMaxTherapeuticDayPM',
        c:'tsDay',
        d:'teDay',
        e:'cMinTherapeuticEvening',
        f:'cMaxTherapeuticEvening',
        g:'tsEvening',
        h:'teEvening',
        WTI1:'weight1',
        WTI2:'weight2',
        WTI3:'weight3',
        WTI4:'weight4',
        WTI5:'weight5',
        WTI6:'weight6',
        WTI7:'weight7',
        palier:'threshold',
        za:'cMinTherapeuticHalfDayAM',
        zb:'cMaxTherapeuticHalfDayAM',
        zc:'tsDay',
        zd:'teDay',
        zzc:'tsPM',
        zzd:'tePM',
        heureducoucher: 'bed',
        startLunchTime: 'lunch',
        Morning: 'Morning',
        formulation1:'formula0',
        quantitedose1:'dose0',
        momentdose1:'adminTime0',
        Food1:'food0',
        formulation2:'formula1',
        quantitedose2:'dose1',
        momentdose2:'adminTime1',
        Food2:'food1',
        formulation3:'formula2',
        quantitedose3:'dose2',
        momentdose3:'adminTime2',
        Food3:'food2',
        formulation4:'formula3',
        quantitedose4:'dose3',
        momentdose4:'adminTime3',
        Food4:'food3'
    };
    let doesItHaveTwoBoxes = false;

    //next we separate each input with its & character
    let formData = currentInput.split("&");
    //console.log('current reverseprepareSend\'s input after \'&\' split: '+ formData);

    let amountOfPillsCounter = 0;

    //after, we separate all indices from its value
    for(let i = 0; i < formData.length; i++){

        //we need to change formData into an array of arrays...?
        formData[i] = formData[i].split("=");

        let currentFormData = formData[i];
        //console.log('current reverseprepareSend\'s input after \'=\' split: '+ currentFormData);

        /*
        * Since we can't attribute c,d,zc,zd,zzc,zzd before knowing if it it has one or two boxes
        * we'll guess that it is 1 boxe, then verify later on
        * so, we need to skip zc,zd,zzc and zzd
        */

        //formData[i][0] => index; formData[i][1] => data

        //console.log("current input index: "+ currentFormData[0]);

        let currentlyEvaluatedIndex = indicesList[currentFormData[0]];

        console.log('current translated index: '+ currentlyEvaluatedIndex);

        if(currentlyEvaluatedIndex === 'Morning')
        {
            doesItHaveTwoBoxes = (currentFormData[1] === '1');
            console.log('doesItHaveTwoBoxes is now set for: '+ doesItHaveTwoBoxes)
        }

        else if(currentlyEvaluatedIndex !== 'zc' && currentlyEvaluatedIndex !== 'zd' && currentlyEvaluatedIndex !== 'zzc' && currentlyEvaluatedIndex !== 'zzd') {
            //this is used to evaluate the amount of pills,
            // as the input doesn't contain dose2, dose3, dose4 if the number of pills is not 2,3 or 4 respectively
            if(currentlyEvaluatedIndex.includes('dose'))
            {
                amountOfPillsCounter += 1
            }
            //verify if index is in page0,
            if (newPage0Object[currentlyEvaluatedIndex]|| newPage0Object[currentlyEvaluatedIndex] === '') {

                if(currentlyEvaluatedIndex.includes('adminTime'))
                {
                    newPage0Object[currentlyEvaluatedIndex] = convertTimeToHourFormat(currentFormData[1]);

                }
                else if(currentlyEvaluatedIndex.includes('formula')){
                    newPage0Object[currentlyEvaluatedIndex] = reverseFindFormulaNumber(currentFormData[1])
                }
                else if(currentlyEvaluatedIndex.includes('food')){
                    newPage0Object[currentlyEvaluatedIndex] = currentFormData[1]==='0'?'No':'Yes'
                }
                else if(currentlyEvaluatedIndex.includes('gender')){
                    newPage0Object[currentlyEvaluatedIndex] = currentFormData[1]==='0'?'Female':'Male'
                }
                else{
                    newPage0Object[currentlyEvaluatedIndex] = currentFormData[1];
                }
            }
            //verify if index is in page1
            else if (newPage1Object[currentlyEvaluatedIndex] || newPage0Object[currentlyEvaluatedIndex] === '') {
                newPage1Object[currentlyEvaluatedIndex] = convertTimeToHourFormat(currentFormData[1])
            }
            //verify if index is in page2
            else if (newPage2Object[currentlyEvaluatedIndex] || newPage0Object[currentlyEvaluatedIndex] === '') {
                newPage2Object[currentlyEvaluatedIndex] = currentFormData[1]
            }
            //verify if index is in page3
            else if (newPage3Object[currentlyEvaluatedIndex] || newPage0Object[currentlyEvaluatedIndex] === '') {
                newPage3Object[currentlyEvaluatedIndex] = currentFormData[1]
            }
        }
        else{
            //since zc,zd sets tsDay and teDay after c and d, we'll need to adjust it later...
            //and since we don't want to attribute -1 to tsDay and teDay, we do the following if
            if(currentFormData[1] !== '-1')
            {
                newPage1Object[currentlyEvaluatedIndex] = currentFormData[1]
            }
        }
    }

    console.log('this is formula0 after loop: '+ newPage0Object['formula0']);

    //now we set up the amountOfPills
    newPage0Object['amountOfPills'] = amountOfPillsCounter;

    //now we have to adjust according to the amount of boxes
    if(doesItHaveTwoBoxes)
    {

        //firstly, we set up the actual amountOfBoxes
        newPage1Object['nbTherapeuticBoxes'] = 'Two therapeutic boxes (AM and PM)';

        //need to find c,d, again a attibute the proper places
        //because TECHNICALLY, zc,zd,zzc,zzd should have been set up in the previous loop's else
        for(let i = 0; i < 1; i++){
            let currentlyEvaluatedIndex = formData[i][0];
            if(currentlyEvaluatedIndex === 'c')
            {
                newPage1Object['tsPM'] = formData[i][1]
            }
            else if(currentlyEvaluatedIndex === 'd'){
                newPage1Object['tePM'] = formData[i][1]
            }
        }

    }

    //finally, we verify if the advanced tab has been accessed by looking for whether or not the default values have been changed
    let hasAdvancedTabBeenAccessed = verifyIfAdvancedTabAccessed(newPage3Object);
    //now we have to build the new objects?
    let returnedFormData = [newPage0Object,newPage1Object,newPage2Object,newPage3Object];
    console.log('reversePrepareToSend\'s returned Result: '+ JSON.stringify(returnedFormData));
    return [newPage0Object,newPage1Object,newPage2Object,newPage3Object, hasAdvancedTabBeenAccessed]
};


let HandleReceivedSearch = (returnedList) => {
    //console.log('returnedList is this: '+JSON.stringify(returnedList));
    let newObjectList = [];
    if(returnedList) {
        console.log("Returned List size: "+ returnedList.length);
        for (let i = 0; i < returnedList.length; i++) {
            let currentResult = returnedList[i];
            //console.log('currentResult is this: '+JSON.stringify(returnedList[i]));
            let newResultName = currentResult['defaultName'];
            //if(i === 1)console.log('currentResults\'s name: '+newResultName );
            let newResultDate = currentResult['creationDate'];
            //if(i === 1)console.log('currentResults\'s Date: '+newResultDate );
            let newResultData = HandleReceivedData(currentResult['output']);
            //if(i === 1)console.log('currentResults\'s ouput: '+JSON.stringify(newResultData) );
            let newResultFormData = ReversePrepareToSend(currentResult['input']);
            //if(i === 1)console.log('currentResults\'s input: '+JSON.stringify(newResultFormData));


            newObjectList.push({
                data: newResultData,
                name: newResultName,
                formData: newResultFormData,
                date: newResultDate,

            })

        }
        //console.log('This is the generated Object List from handleReceiveSearch: '+JSON.stringify(newObjectList))
        return newObjectList
    }
    else{return -1;}
};


export default HandleReceivedSearch;