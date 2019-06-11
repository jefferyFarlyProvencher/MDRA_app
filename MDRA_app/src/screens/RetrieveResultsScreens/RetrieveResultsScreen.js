//System imports
import React, {Component} from "react";
import {Image, Platform, StyleSheet, View, Text, TouchableOpacity, DatePickerIOS, ScrollView, Dimensions} from "react-native";
import {
    Button,
    SearchBar
} from 'react-native-elements';
import SendRetrieval from '../../components/SendRetrieval/SendRetrieval';
import {addToResultList} from "../../store/actions";
import {connect} from "react-redux";
import DatePicker from "react-native-datepicker"
import * as Yup from "yup";
import NewYupString from "../../components/NewYupString/NewYupString";
import {Formik} from "formik";
import Spinner from "react-native-loading-spinner-overlay";

//component imports
import Input from '../../components/Input/Input'
import TitleComponent from '../../components/TitleComponent/TitleComponent'
import LinedLabel from '../../components/LinedLabel/LinedLabel'
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

//asset import
import * as colors from "../../assets/colors";
import CustomTimePicker from "../../components/CustomTimePicker/CustomTimePicker";



class RetrieveResultsScreen extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    dateObject = new Date();

    state = {
        searchItems: false,
        displayedMessage: "Enter proper information to make the appropriate search",
        dateFrom: "2019-01-01",
        dateTo:  this.dateObject.toISOString().slice(0,10),
        dateFromError: false,
        dateToError: false,
        minDate: "01/01/2019",
        maxDate: this.dateObject.toISOString().slice(0,10),
        resultName: "wut",
        visible:false
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarNoBorder: false,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: false,
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            navBarButtonColor: Platform.OS === 'android'?'#3057e1': null
        });
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };

    toggleSpinnerVisibility = ()=>{
        this.setState(oldState=>{
            return{
                ...oldState,
                visible: !oldState.visible
            }
        })
    };

    /**
     *
     * @param message
     */

    changeDisplayedMessage = (message) => {
        this.setState(oldState => {
            return({
                ...oldState,
                displayedMessage: message
            })
        });
    };
    /**
     *
     * @param resultToCompare
     * @returns {boolean}
     */
    verifyIfNotDuplicate = (resultToCompare) =>{

        let currentResultList = this.props.state.main.resultsList;
        for(let i = 0; i < currentResultList.length; i++)
        {
            console.log("this is the current result form from resultList: " + JSON.stringify(currentResultList[i].id));
            console.log("and this is the result form compared to: "+ JSON.stringify(resultToCompare.name));
            if(JSON.stringify(currentResultList[i].id) === JSON.stringify(resultToCompare.name))
            {
                return false;
            }
        }
        return true;
    };

    /**
     *
     * @returns {Promise<void>}
     */

    handleRetrieveResults = async() => {
        let dateToCorrected = this.state.dateTo.split("-");
        console.log("dateTo : "+ this.state.dateTo);
        dateToCorrected[2] = ""+ (parseInt(dateToCorrected[2]) + 1 );
        dateToCorrected = dateToCorrected.join('-');
        console.log("dateToCorrected: "+ dateToCorrected);
        let retrievalResult = await SendRetrieval(this.state.resultName,dateFrom=this.state.dateFrom, dateTo=dateToCorrected, this.props.state.main.linkedAccount.token);
        //console.log('handleRetrieveResult: '+ JSON.stringify(retrievalResult));
        if(retrievalResult !== -1 && retrievalResult.length > 0) {
            let possibleDuplicatesList = [];
            for (let i = 0; i < retrievalResult.length; i++) {
                let currentResult = retrievalResult[i];
                if (this.verifyIfNotDuplicate(currentResult)) {
                    //this.changeDisplayedMessage("Currently adding the result: "+ currentResult.name + " , to the list.");
                    this.props.onAddToResultList(currentResult.data, currentResult.name, currentResult.formData, currentResult.date)
                } else {
                    possibleDuplicatesList.push(currentResult.name)
                }

            }

            this.toggleSpinnerVisibility();
            if (possibleDuplicatesList.length > 0) {
                setTimeout(
                    ()=> {
                        alert((retrievalResult.length-possibleDuplicatesList.length+" were added to the Results List\n")+(possibleDuplicatesList.length === 1 ? "This result was a possible duplicate and thus has " : "These results were possible duplicates and thus have ") + "not been added to the list: " + possibleDuplicatesList)
                    }
                    ,10
                )
            }
            else if(possibleDuplicatesList.length === 0){
                setTimeout(
                    ()=> {
                        alert((retrievalResult.length-possibleDuplicatesList.length+" were added to the Results List\n"))
                    }
                    ,10
                )
            }
        }
        else{
            this.toggleSpinnerVisibility();
            setTimeout(
                ()=> {
                    alert(retrievalResult === -1
                        ? "An error occured which prevented the retrieval of the desired data..."
                        : "No Results Were pulled"
                    )
                }
                ,10
            )

        }
        //await this.toggleSpinnerVisibility();
    };

    // /**
    //  * FOR SERVER
    //  */
    //
    // sqlQueryGenerator = (arrayOfDates) =>{
    //   for(let i = 0; i<arrayOfDates.length; i++){
    //
    //   }
    // };
    //
    // /**
    //  * FOR SERVER
    //  * @param dateArray
    //  */
    // dumbDateRangeGenerator = (dateArray) => {
    //     let localDateArray = [dateArray[0].split('_'), dateArray[1].split('_')];
    //     let stopFlag = true;
    //
    //     localDateArray = [[parseInt(localDateArray[0][0]),parseInt(localDateArray[0][1]),parseInt(localDateArray[0][2])],[parseInt(localDateArray[1][0]),parseInt(localDateArray[1][1]),parseInt(localDateArray[1][2])]];
    //     //using the american dating system
    //     // aka MM/DD/YYYY
    //
    //     let y = localDateArray[1][2];
    //     let m = localDateArray[1][0];
    //     let d = localDateArray[1][1]-1;
    //
    //     'SELECT * FROM Results WHERE CONTAINS(creationDate, \'3\/26\/2019\',1)'
    //
    //     console.log("about to enter decrease loop\n y: "+y+" m: "+m+" d: "+d);
    //     //year loop
    //     for(y;y > 0 && stopFlag; y--) {
    //         //console.log("current year: "+ y);
    //         console.log("y's stopFlag: "+ stopFlag);
    //         //month loop
    //         for (m; m > 0 && stopFlag; m--)
    //         {
    //             //console.log("current month: "+ m);
    //             console.log("m's stopFlag: "+ stopFlag);
    //             //day Loop
    //             for(d; d > 0 && stopFlag; d--){
    //                 //console.log("current day: "+ d);
    //                 console.log("evaluation correspondence of: "+ localDateArray[0][2]+ "/"+localDateArray[0][0]+"/"+ localDateArray[0][1]+ " with "+ y +"/"+ m +"/"+ d + " and result is: "+ ((localDateArray[0][2]+ "/"+localDateArray[0][0]+"/"+ localDateArray[0][1]) === (y +"/"+ m +"/"+ d)));
    //                 //verifies stop point
    //                 if(((localDateArray[0][2]+ "/"+localDateArray[0][0]+"/"+ localDateArray[0][1]) === (y +"/"+ m +"/"+ d)))
    //                 {
    //                     stopFlag = false;
    //                     break;
    //                 }
    //                 else{
    //                     localDateArray.splice(1,0,[m,d,y])
    //                 }
    //             }
    //             //reset to 31 days
    //             d = 31;
    //         }
    //         //reset it to 12 months
    //         m = 12;
    //     }
    //
    //     console.log("Current localDateArray generated after the loops: "+ JSON.stringify(localDateArray))
    // };
    //
    // handleRetrieveResults2 = () => {
    //     let startDate = this.state.dateFrom.replace(/\//gi,'_');
    //     let endDate = this.state.dateTo.replace(/\//gi,'_');
    //     console.log("start Date: "+ startDate + " ; end Date: "+ endDate);
    //     let dateArray = [startDate,endDate];
    //
    //     let arrayOfDates = this.dumbDateRangeGenerator(dateArray);
    //
    //
    // };

    render() {
        console.log("this is dateTo: "+ this.state.dateTo);
        return (
            <View style={{flex:1}}>
                <TitleComponent
                    text={"Retrieve old results"}
                />
                <ScrollView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <View style={styles.containerStyle}>
                            <View style={[{marginBottom: Dimensions.get("window").width * 0.02},styles.displayTextContainer]}>
                                <Text style={{color:"#FFF"}}>
                                    {this.state.displayedMessage}
                                </Text>
                            </View>
                            <Formik
                                initialValues={{ newName: JSON.stringify(this.props.state.main.data)}}
                                onSubmit={()=>{console.log("I did a thing!")}}
                                validationSchema={Yup.object().shape({
                                    resultName: NewYupString().required(),
                                })}
                                render={({
                                             values,
                                             handleSubmit,
                                             setFieldValue,
                                             errors,
                                             touched,
                                             setFieldTouched,
                                             isValid,
                                             isSubmitting
                                         }) => (
                                             <View style={{width:"50%", marginRight:0}}>
                                                <Input
                                                    label={"Name of result"}
                                                    labelPosition={"center"}
                                                    value={values.resultName}
                                                    style={{marginRight:0}}
                                                    onChange={(name,value) =>{
                                                        setFieldValue(name,value)
                                                    }}
                                                    onTouch={setFieldTouched}
                                                    name="resultName"
                                                    error={touched.resultName && errors.resultName}
                                                    onBlur={() =>{
                                                       //console.log(this.props.state.main.indicatorVisibility)
                                                    }}
                                                />
                                             </View>
                                )}
                            />
                            <LinedLabel
                                label={"Select the start date."}
                            />
                            <View style={styles.containerStyle2}>
                                <CustomDatePicker
                                    style={{width: 300,paddingRight: 20}}
                                    date={this.state.dateFrom} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    androidMode={"default"}
                                    placeholder="Select date"
                                    format="YYYY-MM-DD"
                                    minDate={this.state.minDate}
                                    maxDate={this.state.maxDate}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        },
                                        datePickerCon:{
                                            backgroundColor:colors.udemDark
                                        },
                                        btnTextCancel:{
                                            color:'#FFF'
                                        },
                                        btnTextConfirm:{
                                            color:colors.royalBlue1
                                        },
                                        datePicker:{
                                            backgroundColor:"#FFF"
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        if(date > this.state.dateTo)
                                            this.setState(oldState=> {
                                                return{
                                                    ...oldState,
                                                    dateFrom: date,
                                                    dateFromError: true
                                                }});
                                        else{
                                            this.setState(oldState=> {
                                                return{
                                                    ...oldState,
                                                    dateFrom: date,
                                                    dateFromError: false,
                                                    dateToError: false
                                                }
                                            })
                                        }
                                    }}
                                    error={this.state.dateFromError?"Start Date cannot be after End Date":null}
                                />
                            </View>
                            <LinedLabel
                                label={"Select the end date."}
                                style={styles.linedLabelStyle}
                            />
                            <View style={styles.containerStyle2}>
                                <CustomDatePicker
                                    style={{width: 300, paddingRight: 20}}
                                    date={this.state.dateTo} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    minDate="2019-01-01"
                                    maxDate={this.state.maxDate}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        },
                                        datePickerCon:{
                                            backgroundColor:colors.udemDark
                                        },
                                        btnTextCancel:{
                                          color:'#FFF'
                                        },
                                        btnTextConfirm:{
                                            color:colors.royalBlue1
                                        },
                                        datePicker:{
                                            backgroundColor:"#FFF"
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        if(date < this.state.dateFrom)
                                            this.setState(oldState=> {
                                                return{
                                                    ...oldState,
                                                    dateTo: date,
                                                    dateToError: true
                                                }});
                                        else{
                                            this.setState(oldState=> {
                                                return{
                                                    ...oldState,
                                                    dateTo: date,
                                                    dateToError: false,
                                                    dateFromError: false
                                                }
                                            })
                                        }
                                    }}
                                    error={this.state.dateToError?"End date cannot be before Start Date":null}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{alignItems:'center', padding:10 ,backgroundColor:"#EEE"}}>
                    <TouchableOpacity
                        title={"Send"}
                        onPress={()=>{console.log("HEY HEY HEY STARTING SENDSEARCH!");this.toggleSpinnerVisibility();this.handleRetrieveResults();}}
                        disabled={this.state.dateToError||this.state.dateFromError}
                    >
                        <View style={[styles.pillButton2,{backgroundColor: (this.state.dateToError || this.state.dateFromError)?"#DDD":"#3057e1"}]}>
                            <Text style={{textAlign: 'center', color:'#FFF', fontSize: 18}}>
                                Start Retrieval Process
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <Spinner visible={this.state.visible} textContent="Fetching data..." textStyle={{color: '#FFF'}} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    pillButton2: {
        borderRadius:100,
        width:"100%",
        flexDirection:"row",
        padding:12,
    },
    containerStyle2: {
        flex:1,

    },

    linedLabelStyle: {
        height: "10%",
        backgroundColor: 'red'
    },

    displayTextContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*0.05,
        marginBottom: 10,
        backgroundColor: '#111e6c',
        opacity: 0.8,
        alignItems: "center",
        justifyContent: "center"
    }
});

const mapStateToProps = state => {
    return{
        state
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onAddToResultList: (data,name, formData, date)=>dispatch(addToResultList(data, name, formData, date)),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(RetrieveResultsScreen);