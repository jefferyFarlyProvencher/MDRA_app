import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler,
    Alert, Animated
} from 'react-native';
import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie_small.png';

//redux imports
import {connect} from 'react-redux';
import {addData, changePosition, allowAdvancedOptions} from "../../store/actions";
//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import SinglePieChartComponent from '../../components/ResultPage_PieChartsComponent/SinglePieChartComponent';
import TitleComponent from "../../components/TitleComponent/TitleComponent";

import {udemDark} from "../../assets/colors";

class TestCapturePDF extends PureComponent {
    state = {

    };
    
    handleBackButton = () => {

    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    };

    onCapture = uri => {
        console.log("do something with ", uri);
        alert("do something with "+ uri)
    };

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
                        }
                    ]
                }
                iconStyle={{height:30, width:30}}
                selectedIconStyle={{height:40, width:40}}
            />
        )
    };

    //generate html sets up the html for the html to pdf conversion
    generateHTML = (pkProfilePath, performanceDayPath, performancePMPath, performanceEveningPath) =>{
        //this is a copy of what we find on the render place, because I can't, as of now, think of a way to get the appropriate 
        let allPieData= this.props.state.main.resultsList[0].data;
        let firstPieData = [allPieData.characNR*100, allPieData.characNRR*100, allPieData.characR*100, allPieData.characRAR*100, allPieData.characAR*100, allPieData.characNRRAR*100];
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =[allPieData.characNRNuit*100, allPieData.characNRRNuit*100, allPieData.characRNuit*100, allPieData.characRARNuit*100, allPieData.characARNuit*100, allPieData.characNRRARNuit*100];
        let nbTherapeuticBoxes = this.props.state.main.resultsList[0].formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)"
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = [allPieData.characNRAM*100, allPieData.characNRRAM*100, allPieData.characRAM*100, allPieData.characRARAM*100, allPieData.characARAM*100, allPieData.characNRRARAM*100]
        }
        let PMhtml = (
                    performancePMPath
                        ?"<div style=\"position:relative\">"+
                            "<div> <img src=\""+ performancePMPath+"\" alt=\"PerformanceDay_image\" style=\"width:38%;\"/> <div class=\"row\">"+
                            "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
                                "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
                                    "<TR><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+secondPieData[0]  +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+secondPieData[1]  +"%</td><td></td></TR>"+
                                    "<TR><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+secondPieData[2]  +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+secondPieData[3]  +"%</td><td></td></TR>"+
                                    "<TR><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+secondPieData[4]  +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+secondPieData[5]  +"%</td><td></td> </TR> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
                            "</div>"+
                        "</div>"
                        : ""
                    );
        let html ="<!-- This nosy one is looking up this html, please, go ahead, just note that this was made by Jeffery Farly-Provencher-->"+ 
        "<div class=\"navbar-header\"style=\"color:#53a1d8; font-size: 4em !important; text-align: center;\"><strong>We Take Care &trade;</strong></div>"+
        "<h1 style=\"background-color:grey; color:white; text-align: center; padding:0.5em\">Results for the test: "+ this.props.state.main.resultsList[0].name +"</h1>"+
               "<h2>Results were calculated on the "+"THIS IS A DATE"+"</h3>"+
               //pk profile graph
                "<div style=\"background-color:lightgrey\"><h3>PK Profile<h3></div>"+
                "<div> <img src=\""+ pkProfilePath +"\" alt=\"PK_Profile_image\" style=\"height:70%; display: block;margin-left: auto;margin-right: auto;\"/>"+
                //there should be percentages here
                //here we start the pie graphs
                //performance
                "<div style=\"background-color:lightgrey; margin-top: 10em\"><h3>Performance<h3></div>"+
                //day
                "<div style=\"position:relative\">"+
                    "<div> <img src=\""+ performanceDayPath+"\" alt=\"PerformanceDay_image\" style=\"width:38%;\"/> <div class=\"row\">"+
                    "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
                        "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
                            "<TR><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+ firstPieData[0] +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+ firstPieData[1] +"%</td><td></td></TR>"+
                            "<TR><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+ firstPieData[2] +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+ firstPieData[3] +"%</td><td></td></TR>"+
                            "<TR><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+ firstPieData[4] +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+ firstPieData[5] +"%</td><td></td> </TR> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
                    "</div>"+
                "</div>"+
                //pm
                PMhtml +
                //evening
                "<div style=\"position:relative\">"+
                    "<div> <img src=\""+ performanceEveningPath+"\" alt=\"PerformanceDay_image\" style=\"width:38%  \"/> <div class=\"row\">"+
                    "<div class=\"col-sm-8\" style=\"position:absolute;right:0; width:50%; top:100px\">"+
                        "<table class=\"table table-bordered table-condensed\"> <tbody style=\"background-color:white;\">"+
                            "<TR><td style=\"background-color:#1b3e70;\"></td><td>Non Responder:</td><td>"+ eveningPieData[0] +"%</td><td></td> <td style=\"background-color:#62c9e4;\"></td><td>Non Responder / Responder:</td><td>"+ eveningPieData[1] +"%</td><td></td></TR>"+
                            "<TR><td style=\"background-color:#c2c822;\"></td><td>Responder:</td><td>"+ eveningPieData[2] +"%</td><td></td><td style=\"background-color:#f8c82c;\"></td><td>Responder / Adverse Responder: </td><td>"+ eveningPieData[3] +"%</td><td></td></TR>"+
                            "<TR><td style=\"background-color:#ed5f6d;\"></td><td>Adverse Responder:</td><td>"+ eveningPieData[4] +"%</td><td></td> <td style=\"background-color:#f6922d;\"></td><td>Non Responder / Responder / Adverse Responder:</td><td>"+ eveningPieData[5] +"%</td><td></td> </TR> </table> </div> </div> </div> </div> <div style=\"position:relative\">"+
                    "</div>"+
                "</div>"+
                //Footer
                "<div style=\"bottom:0; right:0; position:absolute; font-size: 10px\">In collaboration with <img style=\"width:10em; bottom: 0;right: 0;\" src=\"https://medecine.umontreal.ca/wp-content/uploads/sites/8/2018/02/officiel-RVB.png\" alt=\"UdeM_logo\"/> </div></div>"
        return html;
    };

    toggleViewShot = () => {
        this.setState((oldState) => {
            return({
                ...oldState,
                allowViewShot: !oldState.allowViewShot
            })
        })
    };

    generatePDF = async() => {
        let pkProfilePath = await this.capture(this.pkProfileRef);
        let performanceDayPath = await this.capture(this.performanceDayRef);
        let performancePMPath = false;
        if(this.performancePMRef)
            performancePMPath = await this.capture(this.performancePMRef);
        
        let performanceEveningPath = await this.capture(this.performanceEveningRef);
        
        let html = this.generateHTML(pkProfilePath, performanceDayPath, performancePMPath, performanceEveningPath);
        
        let options = {
          html: html,
          fileName: 'DocumentForResult',
          directory: 'Documents',
        };
    
        let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        await alert(file.filePath);
    };

    capture = async(ref) => {
        let capturePath = "";
        await captureRef(ref, {
            format: 'jpg',
            quality: 1,
        }).then(uri => {
            capturePath = uri;
          });
        if(capturePath != "")
        {
            return capturePath
        }
    }

    render() {
        let allPieData= this.props.state.main.resultsList[0].data;
        let firstPieData = [allPieData.characNR, allPieData.characNRR, allPieData.characR, allPieData.characRAR, allPieData.characAR, allPieData.characNRRAR];
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =[allPieData.characNRNuit, allPieData.characNRRNuit, allPieData.characRNuit, allPieData.characRARNuit, allPieData.characARNuit, allPieData.characNRRARNuit];
        let nbTherapeuticBoxes = this.props.state.main.resultsList[0].formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)"
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = [allPieData.characNRAM, allPieData.characNRRAM, allPieData.characRAM, allPieData.characRARAM, allPieData.characARAM, allPieData.characNRRARAM]
        }
        return (
        <View style={{backgroundColor:"#FFF", flex: 1}}>
            <View>
                <Button onPress={this.generatePDF} title={"Press to test PDF"}/>
                <ScrollView>
                    <View>
                        <TitleComponent text={"PK Profile"}/>
                        <ViewShot ref={ref => this.pkProfileRef = ref}>    
                            <GraphComponent
                                data={this.props.state.main.resultsList[0].data}
                                formData = {this.props.state.main.resultsList[0].formData}
                                style={{backgroundColor:"white"}}
                                tempRef={this.pkProfileRef}
                            />
                        </ViewShot>
                        <TitleComponent text={"Performance"}/>
                        <ViewShot ref={ref => this.performanceDayRef = ref}>
                            <SinglePieChartComponent
                                data={firstPieData}
                                formData = {this.props.state.main.resultsList[0].formData}
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
                                    formData = {this.props.state.main.resultsList[0].formData}
                                    title="PM Pie Graph"
                                    style={{backgroundColor:"white"}}
                                />
                            </ViewShot>
                            :<View/>
                        }
                        <ViewShot ref={ref => this.performanceEveningRef = ref}>
                            <SinglePieChartComponent
                                data={eveningPieData}
                                formData = {this.props.state.main.resultsList[0].formData}
                                title="Evening Pie Graph"
                                style={{backgroundColor:"white"}}
                            />
                        </ViewShot>
                    </View>
                </ScrollView>
            </View>}
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
        height:"10%",
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (position) => dispatch(changePosition(position)),
        allowAdvancedOptions: () => dispatch(allowAdvancedOptions()),

    }
};

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(TestCapturePDF);