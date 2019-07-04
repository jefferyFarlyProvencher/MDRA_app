import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    BackHandler,
    ScrollView,
    TouchableOpacity, Switch, Platform, Alert
} from 'react-native';
//import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {Formik} from "formik";
import * as Yup from "yup";
import NewYupString from "../../components/NewYupString/NewYupString";
import Input from "../../components/Input/Input";

//component imports
import GenderSelector from '../../components/GenderSelector/GenderSelector'
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker'
import * as colors from "../../assets/colors";
import CustomTimeModal from "../../components/CustomTimeModal/CustomTimeModal";
import {convertTimeToHourFormat} from "../../functions/FormatTime";
import {Button} from "react-native-elements";

//assets
//import {udemDark} from "../../assets/colors";

//Lets write down what should happen with this.
//lets start with what a patient should have...?
//Name (unique between patients? -> No)
//Weight
//Gender
//Birthday?
//Dinner Time
//Bed Time
//Colored profile pics?


class PatientPage extends PureComponent {

    dateObject = new Date();

    state = {
        currentProfile: this.props.patientProfile,
        maxDate:  this.dateObject.toISOString().slice(0,10),
        dateError: false,
        //verify if patientprofile exists, if not sets it to true (lbs)
        switchValue: this.props.patientProfile?this.props.patientProfile.kg_lbs:false
    };

    constructor(props) {
        super(props);
        // the next line throws
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "deletePatient") {

                this.handleDeletePatient()
            }
        }
    };


    handleFormatTime = (value)=>{
        return convertTimeToHourFormat(""+value);
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    };

    handleChangeSwitch = (switchBoolean, setFieldValue) => {
        this.setState(oldState =>{
            return {
                ...oldState,
                switchValue:switchBoolean
            }
        });

        setFieldValue('kg_lbs', switchBoolean)
    };

    handleSubmit = async (values, bag, isNewProfile) => {
        values.color = this.getRandomColor();
        console.log("is this fucking accessed??!?");
        try {
            console.log("test 2");
            if(isNewProfile){
                await this.handleCreateSubmit(values,bag);
                bag.setSubmitting(false);
            }else{
                await this.handleUpdateSubmit(values,bag)
            }
        }
        catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    };

    handleUpdateSubmit = async (values, bag) => {
        values.key = this.state.currentProfile.key;
        values.id = this.state.currentProfile.id;
        values.color = this.state.currentProfile.color;
        this.props.onUpdatePatientInfo(values);
        this.props.navigator.pop({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        })
    };

    handleCreateSubmit = (values, bag) => {
        this.props.onCreatePatientProfile(values);
        this.props.navigator.pop({
            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        })
    };

    handleSetNavigatorButtons = (isNewProfile)=>{
        this.props.navigator.setButtons({
            rightButtons:[
                {
                    title: 'Delete Patient', // for a textual button, provide the button title (label)
                    id: 'deletePatient', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    disabled: isNewProfile, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
                    buttonColor: '#F00', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 16, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)}]
                }
            ]
        })
    };

    handleDeletePatient = () => {
        Alert.alert(
            'Confirmation',
            'Do you really want to remove the patient '+this.state.currentProfile.name+"?", [
                {
                    text: 'Nevermind, no',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Yes, erase it',
                    onPress: () =>{
                        this.props.onRemovePatientProfile(this.state.currentProfile.name+"", this.state.currentProfile.key);
                        this.props.navigator.pop({
                            animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
                        })
                    }
                }
            ],
            {
                cancelable: false
            }
        );

    };

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        if(color === "#FFF" || color === "#DDD")
        {
           return this.getRandomColor();
        }

        return color;
    };

    render() {
        let isNewProfile = typeof this.state.currentProfile === 'undefined' || this.state.currentProfile === null;

        this.handleSetNavigatorButtons(isNewProfile);

        console.log("isNewProfile :" + isNewProfile);
        return (
            <View style={{backgroundColor:"#FFF", flex: 1}}>
                <ScrollView>
                        <View style={{alignItems: "center", justifyContent: "center", height: "20%", width: "100%"}}>
                            <View style={{marginTop: 10}}>
                                <FontAwesome
                                    name={"user-circle"}
                                    size={80}
                                    color={isNewProfile?"#DDD":this.state.currentProfile.color}
                                />
                            </View>
                            <View style={{alignSelf: "center", justifyContent:"center", margin: 15}}>
                                <Text style={{color:isNewProfile?"grey":this.state.currentProfile.color, fontSize:20}}>{isNewProfile?"Create Account":this.state.currentProfile.name}</Text>
                            </View>
                            <View style={{width:"100%", borderWidth: 0.5}}/>
                        </View>
                        <View>
                            <Formik
                                initialValues={
                                    isNewProfile
                                        ?{
                                            name: null,
                                            gender: "Male",
                                            weight: null,
                                            dateOfBirth: "2005-05-01",
                                            dinerTime:"12:00",
                                            bedTime: "20:00",
                                            kg_lbs: this.state.switchValue
                                        }
                                        :{
                                            name: this.state.currentProfile.name,
                                            gender: this.state.currentProfile.gender,
                                            weight: this.state.currentProfile.weight,
                                            dateOfBirth: this.state.currentProfile.dateOfBirth?this.state.currentProfile.dateOfBirth:"2005-05-01",
                                            dinerTime:this.state.currentProfile.dinerTime?this.state.currentProfile.dinerTime:"12:00",
                                            bedTime: this.state.currentProfile.bedTime?this.state.currentProfile.bedTime:"20:00",
                                            kg_lbs: this.state.currentProfile.kg_lbs,
                                        }
                                }
                                isInitialValid={!isNewProfile}
                                onSubmit={(values,bag) => this.handleSubmit(values,bag,isNewProfile)}
                                validationSchema={Yup.object().shape({
                                    name: NewYupString().required(),
                                    gender: NewYupString().required(),
                                    weight: this.state.switchValue?Yup.number().positive().lessThan(200).required():Yup.number().positive().lessThan(100).required(),
                                    dateOfBirth: NewYupString().required(),
                                    dinerTime:NewYupString().required(),
                                    bedTime: NewYupString().required()
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
                                             <View style={{alignItems:"center", justifyContent:"center"}}>
                                                <View style={{width:"75%", marginRight:0}}>
                                                    <Input
                                                        label={"Name of patient"}
                                                        labelPosition={"center"}
                                                        value={values.name}
                                                        style={{marginRight:0}}
                                                        onChange={(name,value) =>{
                                                            setFieldValue(name,value)
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="name"
                                                        error={touched.name && errors.name}
                                                        onBlur={() =>{
                                                            setFieldTouched
                                                        }}
                                                        textAlign={"center"}
                                                    />
                                                </View>
                                                 <View style={styles.separatorStyle}/>
                                                 <View style={{width:"100%", marginRight:0, alignItems:"center", justifyContent:"center"}}>
                                                     <GenderSelector
                                                         value={isNewProfile?true:this.state.currentProfile.gender==="Male"}
                                                         onPress={(value)=>{
                                                            setFieldValue("gender", value)
                                                         }}
                                                     />
                                                 </View>
                                                 <View style={styles.separatorStyle}/>
                                                 <View style={[{width:"45%", justifyContent:"space-around", flexDirection:"row", marginLeft:60} ]}>
                                                     <View style={{width:"80%", marginRight:0}}>
                                                         <Input
                                                             label={"Weight"}
                                                             labelPosition={"center"}
                                                             value={values.weight}
                                                             onChange={(name,value) =>{
                                                                 setFieldValue(name,value)
                                                             }}
                                                             name="weight"
                                                             error={touched.weight && errors.weight}
                                                             keyboardType="numeric"
                                                             onBlur={setFieldTouched}
                                                             maxLength={5}
                                                             inputStyle={{textAlign: "center"}}
                                                         />
                                                     </View>
                                                     <View style={{paddingTop:"20%", marginLeft:30, paddingRight:20, flexDirection:'row', justifyContent:'center'}}>
                                                         <View style={{paddingTop:10}}>
                                                             <Text>{(this.state.switchValue?"lbs":"kg ")}</Text>
                                                         </View>
                                                         <Switch
                                                             value={this.state.switchValue}
                                                             onValueChange={(value) => {
                                                                 console.log("value of switch: "+ value);
                                                                 this.handleChangeSwitch(value, setFieldValue);
                                                             }
                                                             }
                                                             tintColor={colors.royalBlue1}
                                                             onTintColor={colors.paleBlue1}
                                                             thumbTintColor={(Platform==="ios"? "white": '#eee')}
                                                         />
                                                     </View>
                                                 </View>
                                                 <View style={styles.separatorStyle}/>
                                                 <View style={{width:"100%", marginRight:0, alignItems:"center", justifyContent:"center"}}>
                                                     <CustomDatePicker
                                                         style={{width: 300, paddingRight: 20}}
                                                         label={"Date Of Birth"}
                                                         labelPosition={"center"}
                                                         date={values.dateOfBirth} //initial date from state
                                                         mode="date" //The enum of date, datetime and time
                                                         placeholder="select date"
                                                         format="YYYY-MM-DD"
                                                         minDate="2000-01-01"
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
                                                             // this.setState(oldState=> {
                                                             //     return{
                                                             //         ...oldState,
                                                             //         date: date,
                                                             //         dateToError: true
                                                             //     }
                                                             // });

                                                             setFieldValue("dateOfBirth",date);

                                                             console.log(JSON.stringify(values));

                                                             console.log('isValid: '+ isValid + " isSubmitting: "+ isSubmitting)

                                                         }}
                                                         error={this.state.dateToError?"End date cannot be before Start Date":null}
                                                     />
                                                 </View>
                                                 <View style={styles.separatorStyle}/>
                                                 <View>
                                                     <CustomTimeModal
                                                         label="Diner Time"
                                                         onChange={(name, value) => {
                                                             // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                             setFieldValue(name, this.handleFormatTime(value));
                                                         }}
                                                         value={values.dinerTime}
                                                         name="dinerTime"
                                                         error={touched.dinerTime && errors.dinerTime}
                                                     />
                                                 </View>
                                                 <View style={styles.separatorStyle}/>
                                                 <View>
                                                     <CustomTimeModal
                                                         label="Bed Time"
                                                         onChange={(name, value) => {
                                                             // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                             setFieldValue(name, this.handleFormatTime(value));
                                                         }}
                                                         value={values.bedTime}
                                                         name="bedTime"
                                                         error={touched.bedTime && errors.bedTime}
                                                     />
                                                 </View>
                                                 <View style={{marginVertical: 20}}>
                                                     <Button
                                                         buttonStyle={styles.button}
                                                         title={isNewProfile?"Create Profile":"Update Profile"}
                                                         onPress={handleSubmit}
                                                         disabled={(!isValid || isSubmitting)}
                                                         loading={isSubmitting}
                                                     />
                                                 </View>
                                             </View>

                                )}
                            />
                        </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: "25%",
        height:"7%"
    },

    separatorStyle:{
        width:"100%",
        borderWidth: 0.5,
        borderColor: "#CCC",
        marginTop: 20
    },

    button: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.royalBlue2
    },
});

export default PatientPage;