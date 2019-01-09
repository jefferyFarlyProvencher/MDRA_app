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
    Alert, Animated
} from 'react-native';
import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";

//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie_small.png';
import pdfImage from '../../assets/pdf-2.png';
import udemLogo from '../../assets/UdeM-officiel-RVB.png';

//redux imports
import {connect} from 'react-redux';
import {addData, changePosition, allowAdvancedOptions} from "../../store/actions";
//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import ViewShot, {captureRef} from "react-native-view-shot";
import SinglePieChartComponent from "../../components/ResultPage_PieChartsComponent/SinglePieChartComponent";
import {udemDark} from "../../assets/colors";


class ResultPage extends PureComponent {
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
        orientation: true, //portrait true, landscape false
        modalVisible: false,
        visible: Platform.OS==="ios",

    };

    handleBackButton = () => {

    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

    setTitleOnChange = () => {
        console.log("Changing title");
        this.props.navigator.setTitle({
            title: this.props.state.main.resultsList[this.state.currentPosition].name
        });
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
         console.log("FORMDATA: " + JSON.stringify(formData));
        //set It to each page
        this.props.onAddData(formData[0],0);
        this.props.onAddData(formData[1],1);
        this.props.onAddData(formData[2],2);
        this.props.onAddData(formData[3],3);
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

    _handleOnPressReuse = () => {
        Alert.alert(
            'Confirmation',
            'Restore these values and go to form?', [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Okay',
                    onPress: () => this.setFormValues()
                }
            ],
            {
                cancelable: false
            }
        );
    };

    //////
    //generate html sets up the html for the html to pdf conversion
    generateHTML = (pkProfilePath, performanceDayPath, performancePMPath, performanceEveningPath) =>{
        //this is a copy of what we find on the render place, because I can't, as of now, think of a way to get the appropriate
        let allPieData= this.props.state.main.resultsList[this.state.currentPosition].data;
        let firstPieData = parseInt([allPieData.characNR*100, allPieData.characNRR*100, allPieData.characR*100, allPieData.characRAR*100, allPieData.characAR*100, allPieData.characNRRAR*100]);
        let secondPieData = [0,0,0,0,0,0];
        let eveningPieData =parseInt([allPieData.characNRNuit*100, allPieData.characNRRNuit*100, allPieData.characRNuit*100, allPieData.characRARNuit*100, allPieData.characARNuit*100, allPieData.characNRRARNuit*100]);
        let nbTherapeuticBoxes = this.props.state.main.resultsList[this.state.currentPosition].formData[1].nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)";
        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if(nbTherapeuticBoxes)
        {
            secondPieData = firstPieData;
            firstPieData = parse[allPieData.characNRAM*100, allPieData.characNRRAM*100, allPieData.characRAM*100, allPieData.characRARAM*100, allPieData.characARAM*100, allPieData.characNRRARAM*100]
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
            "<h1 style=\"background-color:grey; color:white; text-align: center; padding:0.5em\">Results for the test: "+ this.props.state.main.resultsList[this.state.currentPosition].name +"</h1>"+
            "<h2>Results were calculated on the "+this.props.state.main.resultsList[this.state.currentPosition].date+"</h3>"+
            //pk profile graph
            "<div style=\"background-color:lightgrey\"><h3>PK Profile<h3></div>"+
            "<div> <img src=\""+ pkProfilePath +"\" alt=\"PK_Profile_image\" style=\"height:70%; display: block;margin-left: auto;margin-right: auto;\"/>"+
            //there should be percentages here
            //here we start the pie graphs
            //performance
            "<br/>"+
            "<br/>"+
            "<br/>"+
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
            "<div style=\"bottom:0; right:0; position:absolute; font-size: 10px\">In collaboration with <img style=\"width:10em; bottom: 0;right: 0;\" src=\"https://medecine.umontreal.ca/wp-content/uploads/sites/8/2018/02/UdeM-officiel-RVB.png\" alt=\"UdeM_logo\"/> </div></div>"
        return html;
    };

    generatePDF = async() => {
        let pkProfilePath = await this.capture(this.pkProfileRef);
        let performanceDayPath = await this.capture(this.performanceDayRef);
        let performancePMPath = false;
        if(this.performancePMRef)
            performancePMPath = await this.capture(this.performancePMRef);

        let performanceEveningPath = await this.capture(this.performanceEveningRef);

        let html = this.generateHTML(pkProfilePath, performanceDayPath, performancePMPath, performanceEveningPath);

        let fileName = this.props.state.main.resultsList[this.state.currentPosition].name;
        //remove all ponctuations
        fileName = fileName.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"");
        let options = {
            html: html,
            fileName: ('Result'+fileName),
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);
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
        if(capturePath !== "")
        {
            return capturePath
        }
        else{
            console.log(ref+"'s capture failed")
        }
    };
    //////

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
                    onPress: () => this.generatePDF()
                }
            ],
            {
                cancelable: false
            }
        );
    };

//    Animated.sequence([

    render() {
        this.setTitleOnChange();
        if(this.state.visible  && Platform.OS === "ios")this._handleOnStartUp();
        let allPieData= this.props.state.main.resultsList[this.state.currentPosition].data;
        console.log("THIS IS THE DATE OF THIS RESULT: "+this.props.state.main.resultsList[this.state.currentPosition].date);
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
                    <View style={styles.pdfButtonContainerStyle}>
                        <Button onPress={this.handleGeneratePDF} title={"Press to generate PDF"} buttonStyle={styles.pdfButtonStyle}/>
                    </View>
                </IndicatorViewPager>
                <View style={[styles.buttonsContainer]}>
                    <Button
                        title="Go back"
                        onPress={this._handleOnPressBack}
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        icon={
                            {
                                name: "chevron-left",
                                color: "white",
                                type: "ionicons"
                            }
                        }
                    />
                    <Button
                        title="Restore Data"
                        onPress={this._handleOnPressReuse}
                        buttonStyle={{backgroundColor:"#27408b"}}
                    />
                    <Button
                        title="Go next"
                        onPress={this._handleOnPressNext}
                        iconRight={
                            {
                                name:"chevron-right"
                            }
                        }
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                    />
                </View>
                <View>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
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
        height:"10%",
    },

    pdfButtonContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    pdfButtonStyle:{
        backgroundColor: 'red',
        borderRadius:80,
        height: 100
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

export default connect(mapStateToProps,mapDispatchToProps)(ResultPage);