import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity,
    BackHandler,
    Alert, Animated,
    PermissionsAndroid,
    Button,
    Image,
    Picker, Modal, TouchableWithoutFeedback, TouchableHighlight
} from 'react-native';
//import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import ViewShot, {captureRef} from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie.png';
import pdfImage from '../../assets/pdfImageSmall22.png';
import udemLogo from '../../assets/UdeMLogo.png';
import textDocument from '../../assets/text-document-black.png'

//redux imports
import {connect} from 'react-redux';
import {addData, changePosition, allowAdvancedOptions, addPDFToResult, removePDFFromResult} from "../../store/actions";
//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import SinglePieChartComponent from "../../components/ResultPage_PieChartsComponent/SinglePieChartComponent";
import ViewToggle from "../../components/ViewToggle/ViewToggle"
import InputDisplay from "../../components/InputDisplay/InputDisplay";
import LifeBar from '../../components/LifeBar/LifeBar';
import LinedLabel from "../../components/LinedLabel/LinedLabel";

//assets
//import {udemDark} from "../../assets/colors";
import pdfRed from '../../assets/pdf-red.png';
import {Formik} from "formik";
import * as Yup from "yup";
import NewYupString from "../../components/NewYupString/NewYupString";
import ScrollDownIndicator from "../../components/ScrollDownIndicator/ScrollDownIndicator";

class ResultPage extends Component {
    state = {
        listLength: this.props.contextSensitiveList == null
            ?this.props.state.main.resultsList.length
            :this.props.contextSensitiveList.length,
        list: this.props.contextSensitiveList == null
            ?this.props.state.main.resultsList
            :this.props.contextSensitiveList,
        currentPosition: this.props.selectedPosition,
        orientation: true, //portrait true, landscape false
        modalVisible: false,
        visible: Platform.OS==="ios",
        creatingPDF: false,
        language:"Java",
        searchTarget: "name",
        //on start it is false to accelerate the loading of the graph
        animationFlag: true,
        title:"",
        sliderIndicatorActivated: true,
        sliderOffset: Dimensions.get("window").height*0.3,
        updateTitle: false,
        updateResultPage: true,
    };

    handleBackButton = () => {
        this.props.navigator.pop();
    };

    componentDidMount() {
        //BackHandler.removeEventListener('hardwareBackPress');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState(oldState=>{
            return{
                ...oldState,
                updateTitle:true,
            }
        })

    };

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress',  ()=>{BackHandler.exitApp()});
        BackHandler.addEventListener('hardwareBackPress',
            () => {
                // if(this.props.state.main.position === 0 || this.props.state.main.position === 4)
                Alert.alert(
                    'Exit App',
                    'Exiting the application?', [
                        {
                            text: 'Cancel',
                            onPress: (() => console.log('Cancel Pressed')),
                            style: 'cancel'
                        }, {
                            text: 'OK',
                            onPress: () => BackHandler.exitApp(),
                        }
                    ],
                    {
                        cancelable: false
                    }
                );
                return true;
            })
    };

    shouldComponentUpdate(nextProps) {
        return (
            this.state.updateResultPage
        );
    }

    async requestExternalStorageRead() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'Cool App ...',
                    'message': 'App needs access to external storage'
                }
            );

            return granted == PermissionsAndroid.RESULTS.GRANTED
        }
        catch (err) {
            //Handle this error
            return false;
        }
    }

    async requestExternalStorageWrite() {
        try {
            const granted = await PermissionsAndroid.request(        // this.buttonBar.measure((fx, fy, width, height, px, py) => {
                //     console.log('Component width is: ' + width)
                //     console.log('Component height is: ' + height)
                //     console.log('X offset to frame: ' + fx)
                //     console.log('Y offset to frame: ' + fy)
                //     console.log('X offset to page: ' + px)
                //     console.log('Y offset to page: ' + py)
                // })
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': 'Cool App ...',
                    'message': 'App needs access to external storage'
                }
            );

            return granted == PermissionsAndroid.RESULTS.GRANTED
        }
        catch (err) {
            //Handle this error
            return false;
        }
    }



    _handleOnStartUp = () => {
        setTimeout(
            ()=>{
                this.setState((oldState) =>{
                    return({
                        ...oldState,
                        //remove spinner
                        visible:false
                    })
                })
            },
            2000
        )
    };

    _handleOnPressBack = () => {
        if(this.state.currentPosition!==0) {
            console.log("changing pos back");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition - 1,
                    // sliderIndicatorActivated: true
                })
            });
            //update title
            //this.setTitleOnChange();
        }else{
            console.log("next should be disabled")
        }
    };

    _handleOnPressNext = () => {
        if(this.state.currentPosition<this.state.listLength-1) {
            console.log("changing pos");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition + 1,
                    //activate animation
                    animationFlag:  true,
                    // sliderIndicatorActivated: true
                })
            });
            //update title
            //this.setTitleOnChange();
        }else{
            console.log("next should be disabled")
        }
    };

    _handleOnPressReuse = () => {
        Alert.alert(
            'Confirmation',
            'Restore these values and go to form?', [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Yes',
                    onPress: () => {
                        //Toggle spinner?
                        this.toggleSpinner();
                        //setformValues
                        setTimeout(()=>this.setFormValues(), 500)
                    }
                }
            ],
            {
                cancelable: false
            }
        );
    };

    /**
     *
     */

    setFormValues = () => {
        this.setState(oldState =>
        {
            return{
                ...oldState,
                updateResultPage: false,
            }
        });
        //collect current result's formData
        let formData = this.state.list[this.state.currentPosition].formData;
        let patientProfileId = this.state.list[this.state.currentPosition].patient;

        // console.log("FORM BEFORE: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );
        //console.log("FORMDATA: " + JSON.stringify(formData));
        //set It to each page

        //verify if patient's in the local list
        let patientsList = this.props.state.main.patientsList;
        console.log("patientsList: "+ JSON.stringify(patientsList));
        console.log("patient: " + JSON.stringify(formData[0].patientProfile));
        let patientNotInList = true;

        // verification is needed because patient is stored locally as object with name and id
        // and when pulled from server it is only a string for the id
        if(typeof patientProfileId === 'object')
           patientProfileId = formData[0].patientProfile.id !== null? formData[0].patientProfile.id: formData[0].patientProfile;

        let i = 0;

        while(i < patientsList.length){
            if(patientsList[i].id === patientProfileId)
            {
                patientNotInList=false;
                break;
            }
            i++;
        }
        //
        // for(let i = 0; i < patientsList.length; i++){
        //     if(patientsList[i].id === patientProfileId)
        //     {
        //         patientNotInList=false
        //         break;
        //     }
        // }

        console.log('Is patient In List? '+ !patientNotInList);

        //copy formData[0] in order to change patientProfile as it is immutable while in this page
        let newFormData0 = null;

       newFormData0 = {
           patientProfile: patientNotInList?{name:"None Selected",id:"None Selected"}:patientsList[i], //always none selected because error otherwise?
           gender: formData[0].gender,
           weight: formData[0].weight,
           dose0: formData[0].dose0,
           adminTime0: formData[0].adminTime0,
           formula0: formData[0].formula0,
           food0: formData[0].food0,
           dose1: formData[0].dose1,
           adminTime1: formData[0].adminTime1,
           formula1: formData[0].formula1,
           food1: formData[0].food1,
           dose2: formData[0].dose2,
           adminTime2: formData[0].adminTime2,
           formula2: formData[0].formula2,
           food2: formData[0].food2,
           dose3: formData[0].dose3,
           adminTime3: formData[0].adminTime3,
           formula3: formData[0].formula3,
           food3: formData[0].food3,
           amountOfPills: formData[0].amountOfPills,
           kg_lbs: formData[0].kg_lbs ? formData[0].kg_lbs : formData[0].switchWeightFormat
       };

       if(patientNotInList)
           alert("The patient with the id " + patientProfileId + " was not used as it is not in the Patients' List and was thus replaced with the default \'None selected\'");
        else{
           console.log(JSON.stringify(formData[0].patientProfile));
       }

        this.props.onAddData(newFormData0?newFormData0:formData[0],0);
        this.props.onAddData(formData[1],1);
        this.props.onAddData(formData[2],2);
        this.props.onAddData(formData[3],3);
        //console.log("formData[4] => "+ formData[4]);
        if(this.props.state.main.advanceTabAccessible && this.props.state.main.advanceTabAccessible !== formData[4])
        {
            this.props.allowAdvancedOptions();
        }



        // console.log("FORM AFTER: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );

        //Changes here to reset form
        //go to empty screen (loading... screen), then, back to 1,
        // in order to reset form to new values
        this.props.onChangePosition(6);
        this.props.onChangePosition(0);


        //this.props.isInModal
        this.props.navigator.dismissAllModals();

        //close modal
        this.props.navigator.popToRoot({
            animated: false,
        });



        //change screen
        this.props.navigator.switchToTab({
            tabIndex: 0 // (optional) if missing, this screen's tab will become selected
        });
    };

    /**
     *
     */

    setTitleOnChange = () => {
        console.log("this.state.title: "+ this.state.title);
        console.log("this.state.list[this.state.currentPosition].name: "+ this.state.list[this.state.currentPosition].name);
        if(this.state.title !== this.state.list[this.state.currentPosition].name) {
            console.log("Changing title");
            this.props.navigator.setTitle({
                title: this.state.list[this.state.currentPosition].name
            });
            if(this.state.title===""){
                setTimeout(
                    ()=> {
                        this.setState(oldState => {
                            return {
                                ...oldState,
                                title: this.state.list[this.state.currentPosition].name
                            }
                        })
                    },
                    2000
                )
            }else {
                this.setState(oldState => {
                    return {
                        ...oldState,
                        title: this.state.list[this.state.currentPosition].name
                    }
                })
            }
        }
    };

    toggleSpinner = ()=> {
        this.setState((oldState) =>{
            return({
                ...oldState,
                //remove spinner
                visible: !oldState.visible
            })
        });
    };


    ///*************************************
    //////STARTING THE PDF SECTION OF THE CODE
    ///*************************************

    generateHtmlInput = () => {
        let currentResult = this.state.list[this.state.currentPosition];
        let inputs = "<div style=\"background-color:lightgrey\"><h3>Inputs<h3></div>" +
            "<br/>"+
            "<br/>"+
            "<div style=\"background-color:#eee\"><div>Gender: "+currentResult.formData[0].gender+"</div><div>Weight: "+currentResult.formData[0].weight+(currentResult.formData[0].switchWeightFormat?" lbs":" kg")+"</div></div>" +
            "<br/>"+
            "<table style=\"width:100%; border-collapse: collapse;\">" +
            "<tr style=\"background-color:#eee\">" +
            "<th>Drug Formulation</th>" +
            "<th>Dosage (mg)</th>" +
            "<th>Food</th>" +
            "<th>Administration Time</th>" +
            "</tr>" +
            "<tr style=\"border: 1px solid grey; border-top: 0\">" +
            "<td align=\"center\">"+currentResult.formData[0].formula0+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].dose0+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].food0+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].adminTime0+"</td>" +
            "</tr>";

        //console.log(inputs);

        if(currentResult.formData[0].amountOfPills>=2){
            inputs += "<tr style=\"border: 1px solid grey\">" +
            "<td align=\"center\">"+currentResult.formData[0].formula1+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].dose1+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].food1+"</td>" +
            "<td align=\"center\">"+currentResult.formData[0].adminTime1+"</td>" +
            "</tr>";
            if(currentResult.formData[0].amountOfPills>=3){
                inputs +="<tr style=\"border: 1px solid grey\">" +
                "<td align=\"center\">"+currentResult.formData[0].formula2+"</td>" +
                "<td align=\"center\">"+currentResult.formData[0].dose2+"</td>" +
                "<td align=\"center\">"+currentResult.formData[0].food2+"</td>" +
                "<td align=\"center\">"+currentResult.formData[0].adminTime2+"</td>" +
                "</tr>";
                if(currentResult.formData[0].amountOfPills>=4){
                    inputs +="<tr style=\"border: 1px solid grey\">" +
                    "<td align=\"center\">"+currentResult.formData[0].formula3+"</td>" +
                    "<td align=\"center\">"+currentResult.formData[0].dose3+"</td>" +
                    "<td align=\"center\">"+currentResult.formData[0].food3+"</td>" +
                    "<td align=\"center\">"+currentResult.formData[0].adminTime3+"</td>" +
                    "</tr>";
                }
            }
        }
        //console.log(inputs);

        inputs += "</table>" +
            "<table style=\"width:100%;border-collapse: collapse;margin-top: 1em\">" +
            "<tr style=\"background-color:#eee\">" +
            "<th>Day Box</th>" +
            ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")?"<th>PM Box</th>":"") +
            "<th>Evening Box</th>" +
            "<th>lunch</th>" +
            "<th>bed</th>" +
            "</tr>" +
            "<tr>" +
            "<td align=\"center\">" +
            "<table style=\"width:100%; border-collapse: collapse\">" +
            "<tr\>" +
            "<th style=\"border: 1px solid grey; border-top:0;\">Start</th>" +
            "<th style=\"border: 1px solid grey; border-top:0;\">End</th>" +
            "</tr>" +
            "<tr style=\"border: 1px solid grey\">" +
            "<td align=\"center\">"+currentResult.formData[1].tsDay+"</td>" +
            "<td align=\"center\">"+currentResult.formData[1].teDay+"</td>" +
            "</tr>" +
            "</table>" +
            "</td>"+

            ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                ?( "<td>" +
                    "<table style=\"width:100%;border-collapse: collapse\">" +
                    "<tr>" +
                    "<th style=\"border: 1px solid grey; border-bottom:0;\">Start</th>" +
                    "<th style=\"border: 1px solid grey; border-bottom:0;\">End</th>" +
                    "</tr>" +
                    "<tr>" +
                    "<td align=\"center\" style=\"border: 1px solid grey; border-top:0;\">"+currentResult.formData[1].tsPM+"</td>" +
                    "<td align=\"center\" style=\"border: 1px solid grey; border-top:0;\">"+currentResult.formData[1].tePM+"</td>" +
                    "</tr>"+
                    "</table>"+
                    "</td>"
                )
                :""
            )
            +
            "<td>" +
            "<table style=\"width:100%;border-collapse: collapse\">" +
            "<tr>" +
            "<th style=\"border: 1px solid grey;border-top:0;\">Start</th>" +
            "<th style=\"border: 1px solid grey;border-top:0;\">End</th>" +
            "</tr>" +
            "<tr style=\"border: 1px solid grey\">" +
            "<td align=\"center\" >"+currentResult.formData[1].tsEvening+"</td>" +
            "<td align=\"center\">"+currentResult.formData[1].teEvening+"</td>" +
            "</tr>" +
            "</table>" +
            "</td>" +
            "<td align=\"center\" style=\"border: 1px solid grey\">"+currentResult.formData[1].lunch+"</td>" +
            "<td align=\"center\" style=\"border: 1px solid grey\">"+currentResult.formData[1].bed+"</td>" +
            "</tr>" +
            "</table>" +
            "<table style=\"width:100%;margin-top: 1em\">" +
            "<tr style=\"background-color:#eee\">" +
            "<th>Weight Day box</th>" +
            ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                ?"<th>Weight PM box</th>"
                :"") +
            "<th>Weight Evening box</th>" +
            "<th>Roller Coaster effect</th>" +
            "</tr>" +
            "<tr style=\"border: 1px solid grey; border-top: 0;\">" +
            "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[2].weight1+"</td>" +
            ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                ?"<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[2].weight7+"</td>"
                :"") +
            "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[2].weight4+"</td>" +
            "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[2].weight5+"</td>" +
            "</tr>" +
            "</table>";

            //formData[4] === advanceTabAcessible
            if(currentResult.formData[4]){
                inputs += ("<table style=\"width:100%;margin-top: 1em\">" +
                "<tr style=\"background-color:#eee\">" +
                    "<th>Number of Simulations</th>" +
                    "<th>Half Day (AM)</th>" +
                ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                    ?"<th>Half Day (PM)</th>"
                    :"") +
                    "<th>Evening</th>" +
                    "<th>Threshold</th>" +
                "</tr>" +
                "<tr style=\"border: 1px solid grey; border-top: 0;\">" +
                "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[3].numberOfSimulations+"</td>" +
                "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+
                    "<table style=\"width:100%;border-collapse: collapse\">" +
                        "<tr>" +
                            "<th style=\"border: 1px solid grey;border-top:0;\">Cmin</th>" +
                            "<th style=\"border: 1px solid grey;border-top:0;\">Cmax</th>" +
                        "</tr>" +
                        "<tr style=\"border: 1px solid grey\">" +
                            "<td align=\"center\">"+currentResult.formData[3].cMinTherapeuticHalfDayAM+"</td>" +
                            "<td align=\"center\">"+currentResult.formData[3].cMaxTherapeuticHalfDayAM+"</td>" +
                        "</tr>" +
                    "</table>"+
                "</td>" +
                ((currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                    ?"<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+
                        "<table style=\"width:100%;border-collapse: collapse\">" +
                            "<tr>" +
                                "<th style=\"border: 1px solid grey;border-top:0;\">Cmin</th>" +
                                "<th style=\"border: 1px solid grey;border-top:0;\">Cmax</th>" +
                            "</tr>" +
                            "<tr style=\"border: 1px solid grey\">" +
                                "<td align=\"center\">"+currentResult.formData[3].cMinTherapeuticDayPM+"</td>" +
                                "<td align=\"center\">"+currentResult.formData[3].cMaxTherapeuticDayPM+"</td>" +
                            "</tr>" +
                        "</table>"+
                    "</td>"
                    :"") +
                "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+
                    "<table style=\"width:100%;border-collapse: collapse\">" +
                        "<tr>" +
                            "<th style=\"border: 1px solid grey;border-top:0;\">Cmin</th>" +
                            "<th style=\"border: 1px solid grey;border-top:0;\">Cmax</th>" +
                        "</tr>" +
                        "<tr style=\"border: 1px solid grey\">" +
                            "<td align=\"center\" >"+currentResult.formData[3].cMinTherapeuticHalfDayAM+"</td>" +
                            "<td align=\"center\">"+currentResult.formData[3].cMaxTherapeuticHalfDayAM+"</td>" +
                        "</tr>" +
                    "</table>"+
                "</td>"+
                "<td align=\"center\" style=\"border: 1px solid grey; border-top: 0;\">"+currentResult.formData[3].threshold+"</td>" +
                "</tr>" +
                "</table>")
            }

        //console.log(inputs);

        return inputs

    };

    //generate html sets up the html for the html to pdf conversion
    generateHTML = (pkProfileBase64Data, performanceDayBase64Data, performancePMBase64Data, performanceEveningBase64Data) =>{
        let currentResult = this.state.list[this.state.currentPosition];
        //this is a copy of what we find on the render place, because I can't, as of now, think of a way to get the appropriate
        let allPieData= currentResult.data;
        let firstPieData = [
            (allPieData.characNR*100).toFixed(1),
            (allPieData.characNRR*100).toFixed(1),
            (allPieData.characR*100).toFixed(1),
            (allPieData.characRAR*100).toFixed(1),
            (allPieData.characAR*100).toFixed(1),
            (allPieData.characNRRAR*100).toFixed(1)
        ];
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =[
            (allPieData.characNRNuit*100).toFixed(1),
            (allPieData.characNRRNuit*100).toFixed(1),
            (allPieData.characRNuit*100).toFixed(1),
            (allPieData.characRARNuit*100).toFixed(1),
            (allPieData.characARNuit*100).toFixed(1),
            (allPieData.characNRRARNuit*100).toFixed(1)
        ];
        let nbTherapeuticBoxes = currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)";
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = [
                (allPieData.characNRAM*100).toFixed(1),
                (allPieData.characNRRAM*100).toFixed(1),
                (allPieData.characRAM*100).toFixed(1),
                (allPieData.characRARAM*100).toFixed(1),
                (allPieData.characARAM*100).toFixed(1),
                (allPieData.characNRRARAM*100).toFixed(1)
            ]
        }
        let PMhtml = (
            performancePMBase64Data
                ?"<div style=\"position:relative\">"+
                "<div> <img src=\"data:image/jpeg;base64,"+ performancePMBase64Data+"\" alt=\"PerformanceDay_image\" style=\"width:38%;\"/> <div class=\"row\">"+
                "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:62%; top:100px\">"+
                "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
                "<tr><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+secondPieData[0]  +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+secondPieData[1]  +"%</td><td></td></tr>"+
                "<tr><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+secondPieData[2]  +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+secondPieData[3]  +"%</td><td></td></tr>"+
                "<tr><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+secondPieData[4]  +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+secondPieData[5]  +"%</td><td></td> </tr> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
                "</div>"+
                "</div>"
                : ""
        );

        //console.log("this.is inputs: "+inputs);

        let html ="<!-- This nosy one is looking up this html, please, go ahead, just note that this was made by Jeffery Farly-Provencher-->"+
            "<div class=\"navbar-header\"style=\"color:#53a1d8; font-size: 4em !important; text-align: center;\"><strong>We Take Care &trade;</strong></div>"+
            "<h1 style=\"background-color:grey; color:white; text-align: center; padding:0.5em\">Results for the test: "+ currentResult.name +"</h1>"+
            "<h2>Results were calculated on the "+currentResult.date+"</h3>"+
            //inputs
            "<div style=\"padding-bottom:"+((currentResult.formData[4])?"40%":"50%")+"\">" +
            this.generateHtmlInput()+
            "</div>"+
            //pk profile graph
            "<div style=\"background-color:lightgrey\"><h3>PK Profile<h3></div>"+
            "<div> <img src=\"data:image/jpeg;base64,"+ pkProfileBase64Data +"\" alt=\"PK_Profile_image\" style=\""+(Platform.OS==="ios"?"height:70%":"width:80%")+"; display: block;margin-left: auto;margin-right: auto;\"/>"+
            //there should be percentages here
            //here we start the pie graphs
            //performance
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<br/>"+
            "<div>   </div>"+
            "<div style=\"background-color:lightgrey; margin-top: 10em\"><h3>Performance<h3></div>"+
            //day
            "<div style=\"position:relative\">"+
            "<div> <img src=\"data:image/jpeg;base64,"+ performanceDayBase64Data+"\" alt=\"PerformanceDay_image\" style=\"width:38%;\"/> <div class=\"row\">"+
            "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:62%; top:100px\">"+
            "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
            "<tr><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+ firstPieData[0] +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+ firstPieData[1] +"%</td><td></td></tr>"+
            "<tr><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+ firstPieData[2] +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+ firstPieData[3] +"%</td><td></td></tr>"+
            "<tr><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+ firstPieData[4] +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+ firstPieData[5] +"%</td><td></td> </tr> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
            "</div>"+
            "</div>"+
            //pm
            PMhtml +
            //evening
            "<div style=\"position:relative\">"+
            "<div> <img src=\"data:image/jpeg;base64,"+ performanceEveningBase64Data+"\" alt=\"PerformanceDay_image\" style=\"width:38%  \"/> <div class=\"row\">"+
            "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:62%; top:100px\">"+
            "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
            "<tr><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+ eveningPieData[0] +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+ eveningPieData[1] +"%</td><td></td></tr>"+
            "<tr><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+ eveningPieData[2] +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+ eveningPieData[3] +"%</td><td></td></tr>"+
            "<tr><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+ eveningPieData[4] +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+ eveningPieData[5] +"%</td><td></td> </tr> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
            "</div>"+
            "</div>"+
            //Footer
            "<div style=\"bottom:0; right:0; position:absolute; font-size: 10px\">In collaboration with <img style=\"width:10em; bottom: 0;right: 0;\" src=\"https://medecine.umontreal.ca/wp-content/uploads/sites/8/2018/02/UdeM-officiel-RVB.png\" alt=\"UdeM_logo\"/> </div></div>"
        return html;
    };

    generatePDF = async() => {
        await this.toggleSpinner();
        await this.requestExternalStorageRead();
        await this.requestExternalStorageWrite();
        let pkProfileBase64Data = await this.capture(this.pkProfileRef);
        let performanceDayBase64Data = await this.capture(this.performanceDayRef);
        let performancePMBase64Data = false;
        if (this.performancePMRef)
            performancePMBase64Data = await this.capture(this.performancePMRef);

        let performanceEveningBase64Data = await this.capture(this.performanceEveningRef);

        let html = this.generateHTML(pkProfileBase64Data, performanceDayBase64Data, performancePMBase64Data, performanceEveningBase64Data);

        let fileName = this.state.list[this.state.currentPosition].name;
        //remove all ponctuations off the fileName
        fileName = "MDRA_Result_" + fileName.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "");
        //
        let options = {
            html: html,
            fileName: (fileName),
            directory: 'Documents',
            base64: true
        };
        //
        let file = await RNHTMLtoPDF.convert(options);
        // console.log(file.filePath);

        //Unfortunately, openGeneratedPDF cannot find the RNHTMLtoPDF 'Documents' location
        // so, a new pdf file is generated at the same spot as the first
        let filePath = file.filePath;
        //console.log("Base64: "+ file.base64);
        let writeResult = "No need, it is IOS";

        const DocumentDir = RNFetchBlob.fs.dirs.DocumentDir;
        if (Platform.OS === 'android') {
            filePath = DocumentDir + "/resultPdfs/" + fileName + '.pdf';
            await RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64')
                .then(response => {
                    console.log('Success Log: ', response);
                    writeResult = 'Success Log: ' + response;
                })
                .catch(errors => {
                    console.log(" Error Log: ", errors);
                    writeResult = " Error Log: " + errors;
                })

        }


        //as there
        await this.props.onAddPDFToResult(this.state.currentPosition, filePath);

        if (this.props.state.main.resultsList[this.state.currentPosition].filePDF){
            this.toggleSpinner();
            setTimeout(
                () => {
                    if (Platform.OS === 'android')
                        Alert.alert(
                            'PDF Creation Confirmation',
                            ("The pdf was created at this location: " + filePath))
                },
                (Platform.OS === 'ios' ? 200 : 100)
            )
        }
        else{
            alert("PDF creation error")
        }
    };

    /**
     * Capture "takes a picture" of the ref tag
     * IMPORTANT; it returns the base64 of the image NOT the uri like written
     * @param ref of the react-native <this>
     * @returns {Promise<string>} which is the base64 of the picture generated by capture
     */
    capture = async(ref) => {
        let capturePath = "";
        await captureRef(ref, {
            format: 'jpg',
            quality: 1,
            result: "base64"
        }).then(uri => {
            capturePath = uri;
        });
        if(capturePath !== "")
        {
            //console.log("capture result:"+ capturePath);
            return capturePath
        }
        else{
            console.log(ref+"'s capture failed")
        }
    };


    handleGeneratePDF = () => {
        Alert.alert(
            'Confirmation',
            ('Do you really want to generate a PDF for the result '+this.state.list[this.state.currentPosition].name+'?'), [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Agree',
                    onPress: () =>{
                        this.generatePDF();
                    }
                }
            ],
            {
                cancelable: false
            }
        );
    };

    handleRetryGeneratePDF = () => {
        this.deletePDF();
        this.generatePDF();
    };

    handleDeletePDF = () => {
        Alert.alert(
            'Confirmation',
            ('Do you really want to delete the PDF for the result '+this.state.list[this.state.currentPosition].name+'?'), [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Agree',
                    onPress: () =>{
                        this.deletePDF();
                    }
                }
            ],
            {
                cancelable: false
            }
        );
    };

    deletePDF = () => {
        RNFetchBlob.fs.exists(this.state.list[this.state.currentPosition].filePDF)
            .then((exist) => {
                console.log(`file ${exist ? '' : 'not'} exists`);
                if(exist) {
                    //alert(`file ${exist ? '' : 'not'} exists`);
                    RNFetchBlob.fs.unlink(this.state.list[this.state.currentPosition].filePDF);
                    this.props.onRemovePDFFromResult(this.state.currentPosition);
                }
            })
    };



    openGeneratedPDF = (sentPath) => {
        let path = this.state.list[this.state.currentPosition].filePDF;
        if(sentPath)
        {
            console.log("sent path: "+ sentPath);
            path = "data/"+ sentPath;
        }
        console.log("CURRENT PATH BEFORE OPENING IS: "+ path);
        if(Platform.OS === "ios"){
            RNFetchBlob.fs.exists(this.state.list[this.state.currentPosition].filePDF)
                .then((exist) => {
                    console.log(`file ${exist ? '' : 'not'} exists for opening`);
                    if(exist) {
                        //alert(`file ${exist ? '' : 'not'} exists`);
                        RNFetchBlob.ios.openDocument(path);
                    }
                    else{
                        alert("Not able to open because does not exist")
                    }
                });

        }
        else{
            const android = RNFetchBlob.android;
            android.actionViewIntent(path, 'application/pdf');
        }
    };

    /////// END OF PDF SECTION

    generateFormulationSections = (formData0) => {
        return(
            <View>
                <View style={styles.formulationContainerStyle}>
                    <View style={{borderWidth: 0.5, marginBottom: 5, padding: 5, alignItems:"center"}}>
                        <Text>Formulation 1</Text>
                    </View>
                    <View style={styles.formulationRowStyle}>
                        <InputDisplay
                            rowTitle="Drug"
                            rowValue={formData0.formula0}
                        />
                        <InputDisplay
                            rowTitle="With food"
                            rowValue={formData0.food0? "Yes": "No"}
                        />
                    </View>
                    <View style={styles.formulationRowStyle}>
                        <InputDisplay
                            rowTitle="Dose"
                            rowValue={formData0.dose0}
                        />
                        <InputDisplay
                            rowTitle="Time"
                            rowValue={formData0.adminTime0}
                        />
                    </View>
                </View>
                {
                    formData0.amountOfPills > 1 ?
                        <View style={styles.formulationContainerStyle}>
                            <View style={{borderWidth: 0.5, marginBottom: 5, padding: 5, alignItems:"center"}}>
                                <Text>Formulation 2</Text>
                            </View>
                            <View style={styles.formulationRowStyle}>
                                <InputDisplay
                                    rowTitle="Drug"
                                    rowValue={formData0.formula1}
                                />
                                <InputDisplay
                                    rowTitle="With food"
                                    rowValue={formData0.food1? "Yes": "No"}
                                />
                            </View>
                            <View style={styles.formulationRowStyle}>
                                <InputDisplay
                                    rowTitle="Dose"
                                    rowValue={formData0.dose1}
                                />
                                <InputDisplay
                                    rowTitle="Time"
                                    rowValue={formData0.adminTime1}
                                />
                            </View>
                        </View>
                        : <View/>
                }
                {formData0.amountOfPills > 2 ?
                    <View style={styles.formulationContainerStyle}>
                        <View style={{borderWidth: 0.5, marginBottom: 5, padding: 5, alignItems:"center"}}>
                            <Text>Formulation 3</Text>
                        </View>
                        <View style={styles.formulationRowStyle}>
                            <InputDisplay
                                rowTitle="Drug"
                                rowValue={formData0.formula2}
                            />
                            <InputDisplay
                                rowTitle="With food"
                                rowValue={formData0.food2? "Yes": "No"}
                            />
                        </View>
                        <View style={styles.formulationRowStyle}>
                            <InputDisplay
                                rowTitle="Dose"
                                rowValue={formData0.dose2}
                            />
                            <InputDisplay
                                rowTitle="Time"
                                rowValue={formData0.adminTime2}
                            />
                        </View>
                    </View>:<View/>
                }
                {formData0.amountOfPills > 3 ?
                    <View style={styles.formulationContainerStyle}>
                        <View style={{borderWidth: 0.5, marginBottom: 5, padding: 5, alignItems: "center"}}>
                            <Text>Formulation 4</Text>
                        </View>
                        <View style={styles.formulationRowStyle}>
                            <InputDisplay
                                rowTitle="Drug"
                                rowValue={formData0.formula3}
                            />
                            <InputDisplay
                                rowTitle="With food"
                                rowValue={formData0.food3 ? "Yes" : "No"}
                            />
                        </View>
                        <View style={styles.formulationRowStyle}>
                            <InputDisplay
                                rowTitle="Dose"
                                rowValue={formData0.dose3}
                            />
                            <InputDisplay
                                rowTitle="Time"
                                rowValue={formData0.adminTime3}
                            />
                        </View>
                    </View>:<View/>
                }
            </View>
        )
    };

    renderTabIndicator =  () => {
        return (
            <PagerTabIndicator
                tabs={
                    [
                        {
                            text: 'Pk Profile',
                            iconSource: areaImage,
                            selectedIconSource: areaImage
                        },
                        {
                            text: 'Performance',
                            iconSource: pieImage,
                            selectedIconSource: pieImage
                        },
                        {
                            text: 'Input',
                            iconSource: textDocument,
                            selectedIconSource: textDocument
                        },
                        {
                            text: 'PDF Generator',
                            iconSource: pdfImage,
                            selectedIconSource: pdfImage
                        }
                    ]
                }
                iconStyle={{height: 30, width: 30}}
                selectedIconStyle={{height: 40, width: 40}}
            />
        )
    };

    //**********************************
    // START OF ARROW HANDLING SECTION
    //**********************************

    handleArrowActivation = (targetValue) => {
        this.setState(oldState => {
            return {
                ...oldState,
                sliderIndicatorActivated: targetValue,
            }
        })
    };

    handleArrowOffset = (nativeEvent) => {
        this.setState(oldState => {
            return {
                ...oldState,
                sliderOffset: Dimensions.get("window").height*0.3 + nativeEvent.contentOffset.y
            }
        })
    };

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    //**********************************
    // END OF ARROW HANDLING SECTION
    //**********************************

//    Animated.sequence([

    render() {
        let currentResult = this.state.list[this.state.currentPosition];
        //console.log("If currentResult has a PDF it is there or this or whatever: "+ JSON.stringify(currentResult.filePDF));

        //console.log("UpdateTitle? " + this.state.updateTitle);
        if(this.state.title !== currentResult.name && this.state.updateTitle) {
            this.setTitleOnChange();
        }

        if(this.state.visible  && Platform.OS === "ios"){
            this._handleOnStartUp();
        }

        let allPieData= currentResult.data;
        //console.log("THIS IS THE filePDF OF THIS RESULT: "+JSON.stringify(currentResult.filePDF));
        //console.log("THIS IS THE FORMDATA page 1 OF THIS RESULT: "+JSON.stringify(currentResult.formData[1]));
        let firstPieData = [allPieData.characNR, allPieData.characNRR, allPieData.characR, allPieData.characRAR, allPieData.characAR, allPieData.characNRRAR];
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =[allPieData.characNRNuit, allPieData.characNRRNuit, allPieData.characRNuit, allPieData.characRARNuit, allPieData.characARNuit, allPieData.characNRRARNuit];
        let nbTherapeuticBoxes = currentResult.formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)";
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = [allPieData.characNRAM, allPieData.characNRRAM, allPieData.characRAM, allPieData.characRARAM, allPieData.characARAM, allPieData.characNRRARAM]
        }
        let backDisabled = this.state.listLength<1 || this.state.currentPosition === 0;
        let nextDisabled = this.state.listLength<1 || this.state.currentPosition > this.state.listLength-2;

        let advancedTabAccessible = currentResult.advanceTabAccessible;

        let patient = "None Selected";
        if(currentResult.formData[0].patientProfile !== null)
            patient = currentResult.formData[0].patientProfile.id?currentResult.formData[0].patientProfile.id:currentResult.formData[0].patientProfile;

        return (
            <View style={{backgroundColor:"#FFF", flex: 1}}>
                <IndicatorViewPager
                    style={{height:'90%', width:"100%"}}
                    indicator={this.renderTabIndicator()}
                    indicatorOnTop={true}
                >
                    <View>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{alignItems:'center',justifyContent:"center"}} pointerEvents="none">
                                <TitleComponent text={"PK Profile"}/>
                                <ViewShot ref={ref => this.pkProfileRef = ref}>
                                    <GraphComponent
                                        data={currentResult.data}
                                        formData = {currentResult.formData}
                                        style={{backgroundColor:"white"}}
                                        animate={this.state.animationFlag}
                                    />
                                </ViewShot>
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView
                            onScroll={
                                ({nativeEvent})=> {
                                    if (this.isCloseToBottom(nativeEvent)) {
                                        this.handleArrowActivation(false)
                                    }else{
                                        this.handleArrowOffset(nativeEvent)
                                    }

                                }
                            }
                        >
                            <View style={this.state.orientation?styles.pieChartStylesPortrait:styles.pieChartStylesLandscape}>
                                <TitleComponent text={"Performance"}/>
                                <ViewShot ref={ref => this.performanceDayRef = ref}>
                                    <SinglePieChartComponent
                                        data={firstPieData}
                                        formData = {currentResult.formData}
                                        title={
                                            (nbTherapeuticBoxes)
                                                ? "AM Pie Graph"
                                                : "Day Pie Graph"
                                        }
                                        style={{backgroundColor:"white"}}
                                        Animated={true}
                                    />
                                </ViewShot>
                                {nbTherapeuticBoxes?
                                    <ViewShot ref={ref => this.performancePMRef = ref}>
                                        <SinglePieChartComponent
                                            data={secondPieData}
                                            formData = {currentResult.formData}
                                            title="PM Pie Graph"
                                            style={{backgroundColor:"white"}}
                                            Animated={true}
                                        />
                                    </ViewShot>
                                    :<View/>
                                }
                                <ViewShot ref={ref => this.performanceEveningRef = ref}>
                                    <SinglePieChartComponent
                                        data={eveningPieData}
                                        formData = {currentResult.formData}
                                        title="Evening Pie Graph"
                                        style={{backgroundColor:"white"}}
                                        Animated={true}
                                    />
                                </ViewShot>
                            </View>
                            {this.state.sliderIndicatorActivated!== null && this.state.sliderIndicatorActivated
                                ?<View
                                    style={{
                                        position: "absolute",
                                        top: this.state.sliderOffset,
                                        //top: 100,
                                        alignItems: "center",
                                        justifyContent:"center",
                                        flex: 1,
                                        height: Dimensions.get("window").height*0.15,
                                        width: Dimensions.get("window").width,
                                        zIndex: 1
                                    }}
                                >
                                    <ScrollDownIndicator
                                        activated={this.state.sliderIndicatorActivated}
                                    />
                                </View>
                                :<View/>
                            }
                        </ScrollView>
                    </View>
                    <View style={{backgroundColor:"#EEE"}}>
                        <ScrollView
                            ref={ref => this.inputScrollView = ref}
                            onContentSizeChange={(contentWidth, contentHeight)=>{
                                this.inputScrollView.scrollToEnd({animated: true});
                            }}
                        >
                            <View style={styles.inputContainerStyle}>
                                <ViewToggle label={"Page 0"} togglerStyle={{borderRadius: 30}}>
                                    <View>
                                        <View>
                                            <InputDisplay
                                                rowTitle="Patient"
                                                rowValue={patient}
                                            />
                                            <InputDisplay
                                                rowTitle="Gender"
                                                rowValue={currentResult.formData[0].gender}
                                            />
                                            <InputDisplay
                                                rowTitle="Weight"
                                                rowValue={currentResult.formData[0].weight + " "+ (currentResult.formData[0].kg_lbs?"lbs":'kg')}
                                            />
                                            {this.generateFormulationSections(currentResult.formData[0])}
                                        </View>
                                    </View>
                                </ViewToggle>
                            </View>
                            <View style={styles.inputContainerStyle}>
                                <ViewToggle label={"Page 1"} togglerStyle={{borderRadius: 30}}>
                                    <View>
                                        <View style={{
                                            padding: 5,
                                            backgroundColor:"#EEE",
                                            borderRadius: 50,
                                            borderWidth:0.5,
                                            alignItems:"center",
                                            marginVertical: 10
                                        }}>
                                            <Text>{currentResult.formData[1].nbTherapeuticBoxes}</Text>
                                        </View>
                                        <View style={styles.formulationContainerStyle}>
                                            <LinedLabel
                                                label={ nbTherapeuticBoxes?"Day Box": "AM Box" }
                                                containerStyle={
                                                    {
                                                        paddingTop: 0,
                                                        width: "70%"
                                                    }
                                                }
                                                textContainerStyle={
                                                    {
                                                        backgroundColor:"transparent",
                                                        height: Dimensions.get("window").height*0.03,
                                                    }
                                                }
                                                lineStyle={
                                                    {
                                                        marginTop:Dimensions.get("window").height*0.015
                                                    }
                                                }

                                                textStyle={
                                                    {
                                                        color: "#000"
                                                    }
                                                }
                                            />
                                            <View style={styles.formulationRowStyle}>
                                                <InputDisplay
                                                    rowTitle="Start"
                                                    rowValue={currentResult.formData[1].tsDay}
                                                />
                                                <InputDisplay
                                                    rowTitle="End"
                                                    rowValue={currentResult.formData[1].teDay}
                                                />
                                            </View>
                                        </View>
                                        {nbTherapeuticBoxes
                                            ? <View style={styles.formulationContainerStyle}>
                                                <LinedLabel
                                                    label={"PM Box"}
                                                    containerStyle={
                                                        {
                                                            paddingTop: 0,
                                                            width: "70%"
                                                        }
                                                    }
                                                    textContainerStyle={
                                                        {
                                                            backgroundColor: "transparent",
                                                            height: Dimensions.get("window").height * 0.03,
                                                        }
                                                    }
                                                    lineStyle={
                                                        {
                                                            marginTop: Dimensions.get("window").height * 0.015
                                                        }
                                                    }

                                                    textStyle={
                                                        {
                                                            color: "#000"
                                                        }
                                                    }
                                                />
                                                <View style={styles.formulationRowStyle}>
                                                    <InputDisplay
                                                        rowTitle="Start"
                                                        rowValue={currentResult.formData[1].tsPM}
                                                    />
                                                    <InputDisplay
                                                        rowTitle="End"
                                                        rowValue={currentResult.formData[1].tePM}
                                                    />
                                                </View>
                                            </View>
                                            : <View/>
                                        }
                                        <View style={styles.formulationContainerStyle}>
                                            <LinedLabel
                                                label={"Evening Box"}
                                                containerStyle={
                                                    {
                                                        paddingTop: 0,
                                                        width: "70%"
                                                    }
                                                }
                                                textContainerStyle={
                                                    {
                                                        backgroundColor:"transparent",
                                                        height: Dimensions.get("window").height*0.03,
                                                    }
                                                }
                                                lineStyle={
                                                    {
                                                        marginTop:Dimensions.get("window").height*0.015
                                                    }
                                                }

                                                textStyle={
                                                    {
                                                        color: "#000"
                                                    }
                                                }
                                            />
                                            <View style={styles.formulationRowStyle}>
                                                <InputDisplay
                                                    rowTitle="Start"
                                                    rowValue={currentResult.formData[1].tsEvening}
                                                />
                                                <InputDisplay
                                                    rowTitle="End"
                                                    rowValue={currentResult.formData[1].teEvening}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <InputDisplay
                                                rowTitle={"Lunch Time"}
                                                rowValue={currentResult.formData[1].lunch}
                                            />
                                        </View>
                                        <View>
                                            <InputDisplay
                                                rowTitle={"Bed Time"}
                                                rowValue={currentResult.formData[1].bed}
                                            />
                                        </View>
                                    </View>
                                </ViewToggle>
                            </View>
                            <View style={styles.inputContainerStyle}>
                                <ViewToggle label={"Page 2"} togglerStyle={{borderRadius: 30}}>
                                    <View>
                                        <LifeBar title={(nbTherapeuticBoxes?"Morning":"Day")+" issues"} value={currentResult.formData[2].weight1}/>
                                        {nbTherapeuticBoxes?
                                            <LifeBar title={"Afternoon issues"}
                                                     value={currentResult.formData[2].weight6}/>
                                            : <View/>
                                        }
                                        <LifeBar title={"Evening issues"} value={currentResult.formData[2].weight2}/>
                                        <LifeBar title={"Roller Coaster"} value={currentResult.formData[2].weight5}/>
                                    </View>
                                </ViewToggle>
                            </View>
                            {
                                advancedTabAccessible
                                    ?<View style={styles.inputContainerStyle}>
                                        <ViewToggle label={"Page 3"}>
                                            <View style={{backgroundColor:"green",}}>
                                                <Text>HALLo</Text>
                                            </View>
                                        </ViewToggle>
                                    </View>
                                    :<View/>
                            }
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            {currentResult.filePDF
                                ?<View style={{padding: 10, height:"100%"}}>
                                    <TitleComponent text={"PDF already generated for this result"} />
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                console.log("not implemented yet?");
                                                this.openGeneratedPDF();}}
                                        >
                                            <View  style={[styles.drawerItem]}>
                                                <Ionicon
                                                    size={40}
                                                    name= {"md-open"}
                                                    color="#52afff"
                                                    style={styles.drawerItemIcon}
                                                />
                                                <View style={styles.drawerTextContainer}>
                                                    <Text style={styles.drawerText}>{"Press to view or share the generated PDF"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.handleRetryGeneratePDF}>
                                            <View  style={styles.drawerItem}>
                                                <Ionicon
                                                    size={40}
                                                    name= {"ios-repeat"}
                                                    color="#52afff"
                                                    style={styles.drawerItemIcon}
                                                />
                                                <View style={styles.drawerTextContainer}>
                                                    <Text style={styles.drawerText}>{"Press to generate PDF again in case of an Error"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.handleDeletePDF}>
                                            <View  style={[styles.drawerItem]}>
                                                <Ionicon
                                                    size={40}
                                                    name= {"ios-trash"}
                                                    color="#f9000b" style={styles.drawerItemIcon}
                                                />
                                                <View style={styles.drawerTextContainer}>
                                                    <Text style={styles.drawerText}>{"Delete generated PDF"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                :<View  style={[styles.pdfButtonContainerStyle]}>
                                    <TouchableOpacity onPress={this.handleGeneratePDF} style={{alignItems:"center"}}>
                                        <Image source={pdfRed} style={{height:100, width:100}}/>
                                        <Text style={{color:"red",fontSize:20}}>Press to generate PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </IndicatorViewPager>
                {/*{this.state.sliderIndicatorActivated!== null && this.state.sliderIndicatorActivated*/}
                    {/*?<View*/}
                        {/*style={{*/}
                            {/*position: "absolute",*/}
                            {/*top: Dimensions.get("window").height * 0.5,*/}
                            {/*//top: 100,*/}
                            {/*alignItems: "center",*/}
                            {/*flex: 1,*/}
                            {/*height: 70,*/}
                            {/*width: Dimensions.get("window").width,*/}
                            {/*zIndex: 1*/}
                        {/*}}*/}
                        {/*onLayout={event => {*/}
                            {/*const layout = event.nativeEvent.layout;*/}
                            {/*// console.log('e height:', layout.height);*/}
                            {/*// console.log('e width:', layout.width);*/}
                            {/*// console.log('e x:', layout.x);*/}
                            {/*console.log('e y:', layout.y);*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<ScrollDownIndicator activated={this.state.sliderIndicatorActivated}/>*/}
                    {/*</View>*/}
                    {/*:<View/>*/}
                {/*}*/}
                <View
                    ref={(ref)=>{this.buttonBar = ref; }}
                    style={[styles.buttonsContainer, {paddingHorizontal:10, marginLeft:10}]}
                >
                    <View style={{justifyContent:"center"}}>
                        <TouchableOpacity
                            onPress={this._handleOnPressBack}
                            disabled={
                                backDisabled
                            }
                            style={{flexDirection: 'row', justifyContent:"center"}}
                        >
                            <Ionicon
                                size={30}
                                name= {"md-arrow-dropleft"}
                                color= {backDisabled?"#eee":"#52afff"}
                                style={[styles.drawerItemIcon,{paddingTop:4.5}]}
                            />
                            <View style={{paddingTop:7, paddingHorizontal: 10}}>
                                <Text style={{color:backDisabled?"#eee":"#52afff", fontSize:20}}>
                                    Go back
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{marginLeft: 0}}>
                        <Button
                            title="Restore Data"
                            onPress={this._handleOnPressReuse}
                            buttonStyle={{backgroundColor:"#27408b"}}
                        />
                    </View>
                    <View style={{justifyContent:"center"}}>
                        <TouchableOpacity
                            onPress={this._handleOnPressNext} 
                            disabled={
                                nextDisabled
                            }
                            style={{flexDirection: 'row', justifyContent:"center"}}
                        >
                            <View style={{paddingTop:7, paddingHorizontal: 10}}>
                                <Text style={{color:nextDisabled?"#eee":"#52afff", fontSize:20}}>
                                    Go next
                                </Text>
                            </View>
                            <Ionicon
                                size={30}
                                name= {"md-arrow-dropright"}
                                color={nextDisabled?"#eee":"#52afff"}
                                style={[styles.drawerItemIcon,{paddingTop:4.5}]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Spinner visible={this.state.visible} textContent={this.state.creatingPDF?"Generating PDF":"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: "25%",
        height:"7%"
    },

    pieChartStylesPortrait: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    pieChartStylesLandscape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    buttonsContainer: {
        flexDirection:"row",
        justifyContent:'center',
        alignItems: "center",
        height:"10%",
    },

    pdfButtonContainerStyle: {
        justifyContent: 'center',
        marginTop:"30%",
        marginVertical: "5%",
        paddingTop:(Platform.OS === 'ios'?"20%":50),
        paddingVertical: (Platform.OS === 'ios'?0:50),
        backgroundColor:"#eee",
        alignItems:"center"
    },

    pdfButtonStyle:{
        backgroundColor: 'red',
        borderRadius:80,
        height: 100,
    },
    drawerItemIcon: {
        width: "10%"
    },

    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        padding:10,
        marginVertical: 10,
        backgroundColor: "#eee",
    },

    drawerTextContainer: {
        width: "90%",
        padding: 10,

    },

    drawerText:{
        textAlign: 'center'
    },

    selectorTile:{
        backgroundColor:"#FFF",
        width:Dimensions.get("window").width*0.85,
        padding:20
    },

    selectorTileText:{
        fontSize: Dimensions.get("window").width*0.045,
        color: "#000"
    },

    inputContainerStyle:{
        margin:10
    },

    formulationContainerStyle:{
        borderWidth: 0.5,
        margin:5
    },

    formulationRowStyle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal: 10
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (position) => dispatch(changePosition(position)),
        allowAdvancedOptions: () => dispatch(allowAdvancedOptions()),
        onAddPDFToResult: (selectedResult, pdfLocation) => dispatch(addPDFToResult(selectedResult,pdfLocation)),
        onRemovePDFFromResult: (selectedResult) => dispatch(removePDFFromResult(selectedResult))
    }
};

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ResultPage);