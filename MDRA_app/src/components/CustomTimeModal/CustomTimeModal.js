import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Text,
    TextInput,
    Dimensions
} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';

import * as colors from "../../assets/colors";

import {Formik} from "formik";
import * as Yup from "yup";

//functions imports
import {convertTimeToHourFormat} from '../../functions/FormatTime';
import timeToAmPmFormat from "../../functions/timeToAmPmFormat";
//components
import NewYupString from "../NewYupString/NewYupString";
import TitleComponent from "../../components/TitleComponent/TitleComponent";


class CustomTimeModal extends PureComponent{

    state = {

        timeValue: "??:?? AM",
        modalVisible: false,
        switchValue: true,
        amOrPmSwitch: true,
        amOrPmMode: true,
        hour: "",
        minute: ""

    };

    componentDidMount() {
        this.handleTextDisplay()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.handleTextDisplay()
    }

    constructor(props){
        super(props);
    }

    handleChangeText = (value, name)=> {
        //console.log("changeText for "+name + ": "+ value);
        let localValue = value;
        switch (name) {
            case "hour":
                if(parseInt(localValue) > 12)
                {
                    localValue = "12"
                }
                this.setState(oldState=>{
                    return{
                        ...oldState,
                        hour: localValue
                    }
                });
                break;
            case "minute":
                if(parseInt(localValue) > 59)
                {
                    localValue = "59"
                }
                this.setState(oldState=>{
                    return{
                        ...oldState,
                        minute: localValue
                    }
                });
                break

        }
    };


    handleTouch = () => {
        this.props.onTouch(this.props.name)
    };

    handleLabelPosition = (labelPosition) =>{
        switch (labelPosition) {
            case "left":
                return "flex-start";
                break;
            case "center":
                return "center";
                break;
            case "right":
                return "flex-end";
                break;
        }
    };

    //puts everything back to 24hr format and sends to onChange

    handleConfirm = () => {
        console.log("Confirming hour: "+ this.state.hour + "; minute: "+ this.state.minute);
        let localHour = this.state.hour===""?"00":this.state.hour;
        let localMinute = this.state.minute===""?"00":this.state.minute;
        let parsedLocalHour = parseInt(localHour);

        //if time equals 12:00
        if(parsedLocalHour === 12)
        {
            console.log("passed parsedLocalHour === 12");
            // 12AM => 0
            if(this.state.amOrPmSwitch)
            {
                localHour = "00"
            }
            // 12PM => 12
            else{
                localHour = "12"
            }
        }else{
            localHour = parsedLocalHour+(this.state.amOrPmSwitch?0:12)
        }
        //need to add a zero
        let returnedTime = localHour+":"+localMinute;
        console.log("returnedTime: "+ returnedTime);
        this.props.onChange(this.props.name, this.handleFormatTime(returnedTime));
        // this.setState(oldState => {
        //     return{
        //         ...oldState,
        //         timeValue: displayedTime+" "+ (this.state.amOrPmSwitch?"AM":"PM")
        //     }
        // });
        this.setModalVisible(false);
    };

    //takes the text in HH:MM (24H) format to HH:MM AM/PM(12H) format
    handleTextDisplay = () => {
        let unadjustedValue = this.props.value;
        //console.log("unadjustedValue: "+ unadjustedValue + " for " + this.props.name);
        // let adjustedValue = "";
        // if(unadjustedValue === '')
        // {
        //     unadjustedValue = ["",""];
        //     adjustedValue = '??:?? AM'
        // }
        // else if(unadjustedValue.includes("AM") || unadjustedValue.includes("PM") )
        // {
        //     adjustedValue = unadjustedValue
        // }else{
        //     unadjustedValue = unadjustedValue.split(":");
        //     //console.log("updated 1 unadjustedValue: "+ unadjustedValue);
        //     let amOrPm = "AM";
        //     if(parseInt(unadjustedValue[0]) > 11)
        //     {
        //         amOrPm = "PM";
        //
        //         if(unadjustedValue[0] !== '12') {
        //             unadjustedValue[0] = parseInt(unadjustedValue[0]) - 12;
        //         }
        //     }
        //     if(unadjustedValue[0] === '0' || unadjustedValue[0] === '00' ){
        //         unadjustedValue[0] = '12';
        //     }
        //     //console.log("updated 2 unadjustedValue: "+ unadjustedValue);
        //
        //     adjustedValue = unadjustedValue[0]+":"+unadjustedValue[1]+" "+amOrPm;
        //
        //
        // }
        //console.log("adjustedTime: "+ adjustedValue);
        this.setState((oldState)=>{
            return{
                ...oldState,
                timeValue: timeToAmPmFormat(unadjustedValue),
            }
        })
    };


    handleFormatTime= (value) => {
        return convertTimeToHourFormat(""+value)
    };

    setModalVisible(value){
        //need to translate timeValue into the hh and mm
        //So we separate HH:MM AM/PM
        let localTimeValue = this.state.timeValue.split(' ');
        //and then HH : MM
        localTimeValue[0]= localTimeValue[0].split(':');
        this.setState(
            oldState => {
                return {
                    ...oldState,
                    modalVisible: value,
                    hour: localTimeValue[0][0] ==="??"?"":localTimeValue[0][0],
                    minute:localTimeValue[0][1] === "??"?"":localTimeValue[0][1],
                    amOrPmSwitch: localTimeValue[1] === "AM"
                }
            }
        );

        //this.hoursInput.focus();
    }

    switchAmOrPm = () => {
      this.setState((oldState)=>{
          return{
              ...oldState,
              amOrPmSwitch: !oldState.amOrPmSwitch
          }
      })
    };

    render() {
        const {label, error, backgroundColor, name, labelPosition, ...rest } = this.props;

        // console.log("Time value of TimeModal: "+ this.state.timeValue);

        return(
            <View style={[styles.root,this.props.style]}>
                <View style={{alignItems:"center", justifyContent:"center"}}>
                    {label
                        ?<FormLabel
                            containerStyle={
                                {
                                    alignItems: labelPosition?this.handleLabelPosition(labelPosition): "flex-start",

                                }
                            }
                        >
                            {label}
                        </FormLabel>
                        :<View/>
                    }
                   <TouchableOpacity onPress={()=>{this.setModalVisible(true)}}>
                       <View style={[
                           styles.displayBox,
                           this.props.displayBox,
                           error
                               ?{backgroundColor:"#ffb8c3"}
                               :{backgroundColor:"#c8e5f9"},
                       ]}>
                           <Text style={[styles.displayTextStyle, this.props.displayTextStyle]}>
                               {this.state.timeValue}
                           </Text>
                       </View>
                   </TouchableOpacity>
                </View>
                <View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    this.hoursInput.focus();
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor:'#000',
                                        opacity: 0.5,
                                        flex:1,
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                    }}
                                />
                            </TouchableWithoutFeedback>
                            <View style={[styles.modalStyle, {padding: 10}]}>
                                <View style={{backgroundColor: "#ffffff", padding:30}}>
                                    <TitleComponent
                                        text={'Please enter time'}
                                        textStyle={{fontSize:20}}
                                        containerStyle={{backgroundColor:"transparent"}}
                                    />
                                    <Formik
                                        initialValues={{ hour: "", minute:""}}
                                        onSubmit={()=>{console.log("I did a thing!")}}
                                        validationSchema={Yup.object().shape({
                                            hour: NewYupString().containsOnlyNumbers().required(),
                                            minute: NewYupString().containsOnlyNumbers().required(),
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
                                            <View>
                                                <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center"}}>
                                                    <View style={{width:"45%"}}>
                                                        <FormInput
                                                            ref={(input)=>{this.hoursInput = input}}
                                                            center={true}
                                                            value={this.state.hour}
                                                            placeholder={"00"}
                                                            onChangeText={(value) => {this.handleChangeText(value, "hour")}}
                                                            // onFocus={this.props.onTouch}
                                                            onBlur={() => this.handleChangeText(this.state.hour, "hour")}
                                                            containerStyle={[
                                                                {
                                                                    justifyContent:'flex-start',
                                                                    margin:0
                                                                },
                                                            ]}
                                                            inputStyle={[
                                                                {
                                                                    width:"100%",
                                                                    fontSize: 50,
                                                                    textAlign: "center"
                                                                },
                                                                this.props.inputStyle
                                                            ]}
                                                            underlineColorAndroid={"#636363"}
                                                            maxLength={2}
                                                            keyboardType="numeric"
                                                            returnKeyType={"next"}
                                                            onSubmitEditing={() => { this.minutesInput.focus(); }}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text style={{fontSize:30, justifyContent:"center", paddingTop: 10}}>:</Text>
                                                    </View>
                                                    <View style={{width:"45%"}}>
                                                        <FormInput
                                                            ref={(input) => { this.minutesInput = input; }}
                                                            center={true}
                                                            value={this.state.minute}
                                                            placeholder={"00"}
                                                            onChangeText={(value) => {this.handleChangeText(value, "minute")}}
                                                            // onFocus={this.handleTouch}
                                                            onBlur={() => this.handleChangeText(this.state.minute, "minute")}
                                                            containerStyle={[
                                                                {
                                                                    justifyContent:'flex-start',
                                                                    margin: 0,
                                                                    backgroundColor:"#FFF"
                                                                },
                                                            ]}
                                                            inputStyle={[
                                                                {
                                                                    width:"100%",
                                                                    fontSize: 50,
                                                                    textAlign: "center"
                                                                },
                                                                this.props.inputStyle
                                                            ]}
                                                            underlineColorAndroid={"#636363"}
                                                            maxLength={2}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                    {(this.state.amOrPmMode)
                                                        ?<View style={{width:"15%", backgroundColor:"#FFF", marginVertical:15, justifyContent:"center"}}>
                                                            <TouchableOpacity onPress={this.switchAmOrPm}>
                                                                <Text style={{fontSize:25, paddingVertical: 10, textAlign:"center"}}>
                                                                    {this.state.amOrPmSwitch?"AM":"PM"}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        :<View/>
                                                    }
                                                </View>
                                                <View>
                                                    <TouchableOpacity onPress={this.handleConfirm}>
                                                        <View style={[styles.confirmButtonStyle]}>
                                                            <Text style={{fontSize:20, textAlign:"center", color: "#FFF"}}>
                                                                Confirm
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}/>
                                    </View>
                                </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    confirmButtonStyle: {
        width:"100%",
        height: 50,
        justifyContent:"center",
        alignItems:"center",
        marginTop: 10,
        paddingHorizontal: 5,
        backgroundColor: colors.royalBlue3
    },

    displayTextStyle: {
        textAlign:"center",
        //fontSize: Dimensions.get('window').height*0.018
    },

    displayBox: {
        width: "100%",
        borderWidth: 0,
        padding: 15,
        paddingHorizontal: "25%",
        marginTop: 0,
        borderRadius: 90,

    }
});

export default CustomTimeModal;