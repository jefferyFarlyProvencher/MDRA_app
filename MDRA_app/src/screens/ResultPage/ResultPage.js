import React, {PureComponent} from 'react';
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
    Image
} from 'react-native';
//import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import ViewShot, {captureRef} from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie_small.png';
import pdfImage from '../../assets/pdf-2.png';
import udemLogo from '../../assets/UdeMLogo.png';

//redux imports
import {connect} from 'react-redux';
import {addData, changePosition, allowAdvancedOptions, addPDFToResult, removePDFFromResult} from "../../store/actions";
//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import TitleComponent from "../../components/TitleComponent/TitleComponent";

import SinglePieChartComponent from "../../components/ResultPage_PieChartsComponent/SinglePieChartComponent";
//assets
//import {udemDark} from "../../assets/colors";
import pdfRed from '../../assets/pdf-red.png';

class ResultPage extends PureComponent {
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
        orientation: true, //portrait true, landscape false
        modalVisible: false,
        visible: Platform.OS==="ios",
        creatingPDF: false,

    };

    handleBackButton = () => {

    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    };

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
            const granted = await PermissionsAndroid.request(
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

    _renderTabIndicator = () => {
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
                            text: 'PDF Generator',
                            iconSource: pdfImage,
                            selectedIconSource: pdfImage
                        }
                    ]
                }
                iconStyle={{height:30, width:30}}
                selectedIconStyle={{height:40, width:40}}
            />
        )
    };

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
                    onPress: () => this.setFormValues()
                }
            ],
            {
                cancelable: false
            }
        );
    };

    setFormValues = () => {
        //collect current result's formData
        let formData = this.props.state.main.resultsList[this.state.currentPosition].formData;
        // console.log("FORM BEFORE: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );
        //console.log("FORMDATA: " + JSON.stringify(formData));
        //set It to each page
        this.props.onAddData(formData[0],0);
        this.props.onAddData(formData[1],1);
        this.props.onAddData(formData[2],2);
        this.props.onAddData(formData[3],3);
        //console.log("formData[4] => "+ formData[4]);
        if(this.props.state.main.advanceTabAccessible !== formData[4])
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
        //go to empty screen, then, back to 1,
        // in order to reset form to new values
        this.props.onChangePosition(6);
        this.props.onChangePosition(0);

        //close modal
        this.props.navigator.pop({
            animated: false,
        });
        //change screen
        this.props.navigator.switchToTab({
            tabIndex: 0 // (optional) if missing, this screen's tab will become selected
        });
    };

    setTitleOnChange = () => {
        console.log("Changing title");
        this.props.navigator.setTitle({
            title: this.props.state.main.resultsList[this.state.currentPosition].name
        });
    };

    toggleSpinner = ()=> {
        this.setState((oldState) =>{
            return({
                ...oldState,
                //remove spinner
                visible: !oldState.visible
            })
        })
    };

    //////STARTING THE PDF SECTION OF THE CODE

    generateHtmlInput = () => {
        let currentResult = this.props.state.main.resultsList[this.state.currentPosition];
        let inputs = "<div style=\"background-color:lightgrey\"><h3>Inputs<h3></div>" +
            "<br/>"+
            "<br/>"+
            "<div style=\"background-color:#eee\"><div>Gender: "+currentResult.formData[0].gender+"</div><div>Weight: "+currentResult.formData[0].weight+"kg</div></div>" +
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
        let currentResult = this.props.state.main.resultsList[this.state.currentPosition];
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
                "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
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
            (Platform.OS === "android"
                    ?"<br/><br/>"
                    :""
            )+
            "<div style=\"background-color:lightgrey; margin-top: 10em\"><h3>Performance<h3></div>"+
            //day
            "<div style=\"position:relative\">"+
            "<div> <img src=\"data:image/jpeg;base64,"+ performanceDayBase64Data+"\" alt=\"PerformanceDay_image\" style=\"width:38%;\"/> <div class=\"row\">"+
            "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
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
            "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
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
        if(this.performancePMRef)
            performancePMBase64Data = await this.capture(this.performancePMRef);

        let performanceEveningBase64Data = await this.capture(this.performanceEveningRef);

        let html = this.generateHTML(pkProfileBase64Data, performanceDayBase64Data, performancePMBase64Data, performanceEveningBase64Data);

        let fileName = this.props.state.main.resultsList[this.state.currentPosition].name;
        //remove all ponctuations off the fileName
        fileName = "MDRA_Result_"+ fileName.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"");
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
        if(Platform.OS === 'android'){
            filePath = RNFetchBlob.fs.dirs.DownloadDir +"/"+ fileName +'.pdf';
            await RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64')
                .then(response => {
                    console.log('Success Log: ', response);
                    writeResult = 'Success Log: '+ response;
                })
                .catch(errors => {
                    console.log(" Error Log: ", errors);
                    writeResult = " Error Log: "+ errors;
                })

        }

        // await Alert.alert(
        //     'PDF Creation Confirmation',
        //     ("The pdf was created at this location: " + filePath+ " and writeResult??->>>"+writeResult)
        // );
        //as there
        await this.props.onAddPDFToResult(this.state.currentPosition, filePath);

        this.toggleSpinner();
    };

    /**
     * Capture "takes a picture" of the ref tag
     *0. IMPORTANT; it returns the base64 of the image NOT the uri like written
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
            ('Do you really want to generate a PDF for the result '+this.props.state.main.resultsList[this.state.currentPosition].name+'?'), [
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
    }

    handleDeletePDF = () => {
        Alert.alert(
            'Confirmation',
            ('Do you really want to delete the PDF for the result '+this.props.state.main.resultsList[this.state.currentPosition].name+'?'), [
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
        RNFetchBlob.fs.exists(this.props.state.main.resultsList[this.state.currentPosition].filePDF)
            .then((exist) => {
                console.log(`file ${exist ? '' : 'not'} exists`);
                if(exist) {
                    //alert(`file ${exist ? '' : 'not'} exists`);
                    RNFetchBlob.fs.unlink(this.props.state.main.resultsList[this.state.currentPosition].filePDF);
                    this.props.onRemovePDFFromResult(this.state.currentPosition);
                }
            })
    };



    openGeneratedPDF = (sentPath) => {
        let path = this.props.state.main.resultsList[this.state.currentPosition].filePDF;
        if(sentPath)
        {
            console.log("sent path: "+ sentPath);
            path = "data/"+ sentPath;
        }
        console.log("CURRENT PATH BEFORE OPENING IS: "+ path);
        if(Platform.OS === "ios"){
            RNFetchBlob.ios.openDocument(path);
        }
        else{
            const android = RNFetchBlob.android;
            android.actionViewIntent(path, 'application/pdf');
        }
    };

    /////// END OF PDF SECTION


//    Animated.sequence([

    render() {
        this.setTitleOnChange();
        if(this.state.visible  && Platform.OS === "ios")this._handleOnStartUp();
        let allPieData= this.props.state.main.resultsList[this.state.currentPosition].data;
        //console.log("THIS IS THE filePDF OF THIS RESULT: "+JSON.stringify(this.props.state.main.resultsList[this.state.currentPosition].filePDF));
        //console.log("THIS IS THE FORMDATA page 1 OF THIS RESULT: "+JSON.stringify(this.props.state.main.resultsList[this.state.currentPosition].formData[1]));
        let firstPieData = [allPieData.characNR, allPieData.characNRR, allPieData.characR, allPieData.characRAR, allPieData.characAR, allPieData.characNRRAR];
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =[allPieData.characNRNuit, allPieData.characNRRNuit, allPieData.characRNuit, allPieData.characRARNuit, allPieData.characARNuit, allPieData.characNRRARNuit];
        let nbTherapeuticBoxes = this.props.state.main.resultsList[this.state.currentPosition].formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)";
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = [allPieData.characNRAM, allPieData.characNRRAM, allPieData.characRAM, allPieData.characRARAM, allPieData.characARAM, allPieData.characNRRARAM]
        }
        let backDisabled = this.state.listLength<1 || this.state.currentPosition === 0;
        let nextDisabled = this.state.listLength<1 || this.state.currentPosition > this.state.listLength-2;

        return (
            <View style={{backgroundColor:"#FFF", flex: 1}}>
                <IndicatorViewPager
                    style={{height:'90%', width:"100%"}}
                    indicator={this._renderTabIndicator()}
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
                                        data={this.props.state.main.resultsList[this.state.currentPosition].data}
                                        formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                        style={{backgroundColor:"white"}}
                                    />
                                </ViewShot>
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={this.state.orientation?styles.pieChartStylesPortrait:styles.pieChartStylesLandscape}>
                                <TitleComponent text={"Performance"}/>
                                <ViewShot ref={ref => this.performanceDayRef = ref}>
                                    <SinglePieChartComponent
                                        data={firstPieData}
                                        formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                        title={
                                            (nbTherapeuticBoxes)
                                                ? "AM Pie Graph"
                                                : "Day Pie Graph"
                                        }
                                        style={{backgroundColor:"white"}}
                                    />
                                </ViewShot>
                                {nbTherapeuticBoxes?
                                    <ViewShot ref={ref => this.performancePMRef = ref}>
                                        <SinglePieChartComponent
                                            data={secondPieData}
                                            formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                            title="PM Pie Graph"
                                            style={{backgroundColor:"white"}}
                                        />
                                    </ViewShot>
                                    :<View/>
                                }
                                <ViewShot ref={ref => this.performanceEveningRef = ref}>
                                    <SinglePieChartComponent
                                        data={eveningPieData}
                                        formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                        title="Evening Pie Graph"
                                        style={{backgroundColor:"white"}}
                                    />
                                </ViewShot>
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            {this.props.state.main.resultsList[this.state.currentPosition].filePDF
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
                                                    color="#52afff" style={styles.drawerItemIcon}
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
                                                    color="#52afff" style={styles.drawerItemIcon}
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
                <View style={[styles.buttonsContainer, {paddingHorizontal:10, marginLeft:10}]}>
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
                                color= {backDisabled?"#eee":"#52afff"} style={styles.drawerItemIcon}
                                style={{paddingTop:4.5}}
                            />
                            <View style={{paddingTop:7, paddingHorizontal: 10}}>
                                <Text style={{color:backDisabled?"#eee":"#52afff", fontSize:20}}>
                                    Go back
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{marginLeft: 10}}>
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

 {/*<Button*/}
     {/*title="Go next"*/}
     {/*onPress={this._handleOnPressNext}*/}
     {/*iconRight={*/}
         {/*{*/}
             {/*name:"chevron-right"*/}
         {/*}*/}
     {/*}*/}
     {/*disabled={*/}
         {/*this.state.listLength<1 ||*/}
         {/*this.state.currentPosition > this.state.listLength-2*/}
     {/*}*/}
     {/*raise={*/}
         {/*this.state.listLength < 1 ||*/}
         {/*this.state.currentPosition > this.state.listLength - 2*/}
     {/*}*/}
 {/*/>*/}
{/*<View style={{flexDirection: 'row',justifyContent:"center"}}>*/}
    {/*<Ionicon*/}
        {/*size={30}*/}
        {/*name= {"md-arrow-dropleft"}*/}
        {/*color= {(this.state.listLength<1 || this.state.currentPosition === 0)?"#eee" :"#52afff"} style={styles.drawerItemIcon}*/}
        {/*style={{paddingTop:4.5}}*/}
    {/*/>*/}
    {/*<Button*/}
        {/*title="Go back"*/}
        {/*onPress={this._handleOnPressBack}*/}
        {/*disabled={*/}
            {/*this.state.listLength<1 ||*/}
            {/*this.state.currentPosition === 0*/}
        {/*}*/}
        {/*raise={*/}
            {/*this.state.listLength<1 ||*/}
            {/*this.state.currentPosition === 0*/}
        {/*}*/}
        {/*icon={*/}
            {/*{*/}
                {/*name: "chevron-left",*/}
                {/*color: "white",*/}
                {/*type: "ionicons"*/}
            {/*}*/}
        {/*}*/}

    {/*/>*/}
{/*</View>*/}