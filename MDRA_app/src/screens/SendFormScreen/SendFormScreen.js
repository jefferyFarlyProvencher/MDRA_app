//system imports
import React,{PureComponent} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, ToastAndroid, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

//component imports
import PrepareToSend from '../../components/PrepareToSend/PrepareToSend';
import SendForm from '../../components/SendForm/SendForm';
import TitleComponent from '../../components/TitleComponent/TitleComponent';

//redux imports
import {connect} from "react-redux";
import {addToResultList, changePosition, setPatientLatestForm} from "../../store/actions";

class SendFormScreen extends PureComponent{
    state = {
        dataReceived: false,
        textToDisplay: 'Data Sending?!',
        iconName: "md-refresh-circle"

    };

    componentDidMount(){
        if(this.props.state.main.Page0Data) {
            this.sendGenerateRequest();
        }
        else{
            this.setState((oldState) =>({
                ...oldState,
                dataReceived: true,
                textToDisplay: "DATA RECEIVED!!!"
            }));
        }
    }
// This section serves to stop the setStates that happen after item has unmounted
    hasNotUnMounted = true;
    componentWillUnmount(){
        this.hasNotUnMounted = false;
    }

    generateName = (d) => {
        return (//this.props.state.main.userId
            d.getDate()+"_"+(d.getMonth()+1)+"_"+d.getFullYear()+"___"+parseInt(Math.random()*1000000+1)
        );
    };
//TODO: do something about page3, might cause bug in the future for the user
    prepareToStoreData (data, name, date, patientID) {
        //console.log(JSON.stringify(data));
        //console.log(JSON.stringify(name));
        //console.log(JSON.stringify(date));

        console.log(JSON.stringify(patientID));

        //current data in redux will be copied to be stored with the result
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
            this.props.state.main.advanceTabAccessible+""
        ];

        //console.log("new result's FormData: "+formData);

        //everything is added to the resultsList
        this.props.onAddToResultList(data, name, formData, date, patientID);

        this.props.onSetPatientFormInput(patientID,formData)

    }

    sendGenerateRequest = async () => {
        if(this.hasNotUnMounted) {
            this.setState((oldState) => ({
                ...oldState,
                dataReceived: false,
            }));
        }

        let formData = this.props.state.main;

        let preparedInput = PrepareToSend(formData);

        //transforms array into object or turns it into null

        let patient = formData.Page0Data.patientProfile !== "None Selected"
            ?{
                name:formData.Page0Data.patientProfile.name,
                id:formData.Page0Data.patientProfile.id
            }
            :{
                name:null,
                id:null
            };

        console.log("SendScreen's patient: "+ JSON.stringify(patient));

        let calculatedResult = await SendForm(preparedInput, this.props.state.main.linkedAccount.token, patient);

        //console.log("this is the calculated result: "+ JSON.stringify(calculatedResult));

        //alert("this is the calculated result: "+ JSON.stringify(calculatedResult));

        let data = calculatedResult[0];
        let name = calculatedResult[1];
        let date = calculatedResult[2];
        let patientId = calculatedResult[3];
        //console.log(JSON.stringify(data));
        if(calculatedResult !== -1) {
            this.prepareToStoreData(data, name, date, patientId);
            if(this.hasNotUnMounted) {
                this.setState((oldState) => ({
                    ...oldState,
                    dataReceived: true,
                    textToDisplay: "DATA RECEIVED!"
                }));
                if (this.state.dataReceived) {
                    if (Platform.OS === "android") ToastAndroid.showWithGravity("Data added to List", 1, ToastAndroid.BOTTOM + 15);
                    this.props.navigator.push({
                        screen: "MDRA_app.resultPage",
                        title: this.props.state.main.resultsList[0].name,
                        passProps: {
                            selectedPosition: 0
                        }
                    });
                }
            }
        }
        else{
            if(this.hasNotUnMounted) {
                this.setState((oldState) => ({
                    ...oldState,
                    dataReceived: true,
                    textToDisplay: "CONNECTION ERROR",
                    iconName: "ios-warning-outline"
                }));
            }
        }
    };

    _handlerOnPress = async () => {
        let message = (!this.state.dataReceived)? "Not Received Yet": "Received!";
        //ToastAndroid.showWithGravity("GOING BACK TO PAGE 1!!!", 1, ToastAndroid.TOP);
        if(this.state.dataReceived)
            this.props.onChangePosition(0);
    };

    render() {
        console.log("Update of SendForm");
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this._handlerOnPress}>
                    <View style={{alignItems: 'center', paddingTop: 10, position: "absolute", width:"100%"}}>
                        <TitleComponent text={this.state.textToDisplay}/>
                    </View>
                    <View style={{
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 10
                    }}>
                        {!this.state.dataReceived
                            ?<ActivityIndicator size={Platform.OS==='android'?100:0} color="#4169e1" />
                            :<Icon
                                size={150}
                                name={this.state.iconName}
                                color="#4169e1"
                                />
                        }
                        {
                            !this.state.dataReceived
                                ?<Text style={{padding: 20}}>Sending Data to server...</Text>
                                : (this.state.textToDisplay === "CONNECTION ERROR"
                                    ? <Text style={{textAlign: "center", padding:20}}>
                                        Form was not sent due to a connection issue with the server.
                                        Please verify that the application is connected to the server by using
                                        the side menu's [Connection Test] Button and then pressing the warning triangle
                                        to try again.
                                    </Text>
                                    : <Text style={{padding: 20}}>{"Redo Form?"}</Text>
                                )
                        }
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        height: '100%'
    }
});

const mapStateToProps = state => {
    return{
        state
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onAddToResultList: (data,name, formData, date, patient)=>dispatch(addToResultList(data, name, formData, date, patient)),
        onChangePosition:   (pos) => dispatch(changePosition(pos)),
        onSetPatientFormInput: (patientID, formData) => dispatch(setPatientLatestForm(patientID,formData)),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SendFormScreen);