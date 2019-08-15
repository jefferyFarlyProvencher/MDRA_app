//system imports
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Dimensions,
    Switch,
    Text,
    Platform,
    NetInfo,
    ScrollView,
    TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

//function imports
import {convertTimeToHourFormat} from '../../functions/FormatTime';
import containsOnlyNumbers from '../../functions/containsOnlyNumbers';

//component imports
import Input from "../../components/Input/Input";
import CustomTimeModal from '../../components/CustomTimeModal/CustomTimeModal';
import DropDownListV2 from "../../components/DropDownList/DropDownListV2";
import LinedLabel from "../../components/LinedLabel/LinedLabel";
import NewYupString from '../../components/NewYupString/NewYupString';
import TitleComponent from '../../components/TitleComponent/TitleComponent';
//actions imports
import {connect}  from "react-redux";
import {addData, changePosition, toggleIndicatorVisibility} from "../../store/actions";

//asset imports
import * as colors from "../../assets/colors";

class FormScreenInitial extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        //current position is the current step of the form
        currentPosition: 0,
        //formulation values are there to set the dosage
        formulaValues:
            this.props.data
                ?[this.props.data.formula0,this.props.data.formula1,this.props.data.formula2,this.props.data.formula3]
                :["Ritalin IR","Ritalin IR","Ritalin IR","Ritalin IR"]
        ,
        //time values are there to set the dosage
        // timeValues:
        //     this.props.data
        //         ?[
        //             this.props.data.adminTime0,
        //             this.props.data.adminTime1,
        //             this.props.data.adminTime2,
        //             this.props.data.adminTime3,
        //         ]
        //         :["","","",""]
        // ,
        //if there is data and an amountOfPills,
        // Number of pill given (1 to 4)
        amountOfPills:this.props.data
            ?this.props.data.amountOfPills
                ? this.props.data.amountOfPills
                : 1
            :1,
        //Switch value indicates if weight is in pounds (true) or in kg (false)
        switchValue: this.props.data?
            this.props.data.kg_lbs: false,

        darkVisible: false,

        //selectedPatientProfile: this.props.state.main.patientsList[0].name

        defaultPatient: {name:"None Selected", id: "None Selected"}
    };

    // componentDidMount() {
    //     console.log("componentDidMount");
    //     console.log("formScreenInitial's props: "+ JSON.stringify(this.props.data) );
    //     if(typeof this.props.data !== "undefined") {
    //         console.log("this is the value of kg_lbs in props: " + this.props.data.kg_lbs + " and this is the value in state: " + this.state.switchValue);
    //         if (this.props.data.kg_lbs) {
    //             console.log('Setting kg_LBS');
    //             this.setState(oldState => {
    //                 return {
    //                     ...oldState,
    //                     switchValue: true
    //                 }
    //
    //             })
    //         }
    //     }
    // }

    _handleSubmit =(async (values, bag) => {
        try {
            //console.log(JSON.stringify(values));
            this.props.onAddData(values, this.state.currentPosition);
            this.props.onChangePosition(this.state.currentPosition + 1);
            console.log("doing setPage");
            this.props.setPage(this.state.currentPosition + 1);
            setTimeout(
                () => {
                    bag.setSubmitting(false);
                },
                1000
            )
        }
        catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    _handleChangeSwitch = (switchBoolean, setFieldValue) => {
        this.setState(oldState =>{
            return {
                ...oldState,
                switchValue:switchBoolean
            }
        });

        if(setFieldValue !== null) {
            setFieldValue('kg_lbs', switchBoolean)
        }
    };

    _handleValidation = () => {
        let requiredMessage = "This is required";
        let timeMessage = "Time Format is incorrect";
        switch (this.state.amountOfPills)
        {

            case 1:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(201).required(requiredMessage):Yup.number().positive().lessThan(101).required(requiredMessage),
                        adminTime0: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                    })
                );
            case 2:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(201).required():Yup.number().positive().lessThan(101).required(requiredMessage),
                        adminTime0: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                    })
                );
            case 3:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(201).required():Yup.number().positive().lessThan(101).required(requiredMessage),
                        adminTime0: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime2: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage)
                    })
                );
            case 4:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(201).required():Yup.number().positive().lessThan(101).required(requiredMessage),
                        adminTime0: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime2: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),
                        adminTime3: NewYupString(timeMessage).containsOnlyNumbers().required(requiredMessage),

                    })
                );
        }
    };

    addDrugs = () => {
        if (this.state.amountOfPills <4) {
            this.setState(oldState => {
                return {
                    ...oldState,
                    amountOfPills: oldState.amountOfPills + 1
                }
            })
        }
    };

    removeDrugs = () =>{
        if(this.state.amountOfPills >1) {
            this.setState(oldState => {
                return {
                    ...oldState,
                    amountOfPills: oldState.amountOfPills - 1
                }
            })
        }
    };
    //Sets current formulation for each
    setCurrentFormulation = (index, value)=>{
        let copyOfArray = (this.state.formulaValues).slice();
        copyOfArray[index] = value;
        this.setState(oldState =>{
            return({
                ...oldState,
                formulaValues: copyOfArray
            })
        })
        //then hopeful, garbage collector gets the old array
    };

    getDoses = (index)=>{
        //console.log("FORMULA VALUES: "+JSON.stringify(this.state.formulaValues[index]));
        switch (this.state.formulaValues[index]) {
            case "Ritalin IR":
                return ["10","20"];
            case "Pms-Methylphenidate IR":
                return ["5","10","20"];
            case "Pms-Methylphenidate ER":
                return ["18","27","36","54"];
            case "Concerta":
                return ["18","27","36","54"];
            case "Biphentin":
                return ["5","10","15","20"];
            default:
        }
    };


    setFormValues = (formData, currentProfile, setFieldValue) => {
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
        //this._handleChangeSwitch()
        // console.log("FORM AFTER: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );

        //go to empty screen, then, back to 1,
        // in order to reset form to new values
        this.props.onChangePosition(6);
        this.props.onChangePosition(0);
    };

    handlePatientProfileSelection = (patientProfile, setFieldValue) => {

        console.log("patientProfile: 5 "+ patientProfile);

        if(patientProfile.name !== 'None Selected' && patientProfile !== 'None Selected')
        {
            console.log("patientProfile received: " + JSON.stringify(patientProfile));

            // let pseudoPatientProfile = patientProfile.split("\n");

            // console.log("pseudoPatientProfile: " + JSON.stringify(pseudoPatientProfile));

            //should replace values for gender, weight, kg/lbs, and, of course, patientProfile
            //filter MIGHT not be efficient for this case as it goes through EVERY
            let currentProfile = (this.props.patientsList.filter(patient => {
                //console.log("patient: "+ JSON.stringify(patient));
                //console.log("patient.id === pseudo[1]: "+ patient.id +"==="+ patientProfile +"?"+(patient.id === patientProfile));
                return patient.id === patientProfile;
            }));

            currentProfile = currentProfile[0];

            //console.log("currentProfile: "+ JSON.stringify(currentProfile));

            if(typeof currentProfile !== 'undefined') {
                if(typeof currentProfile.formData !== 'undefined' && currentProfile.formData !== null) {
                    Alert.alert('Confirmation',
                        'Do you want to reload the patient ' + currentProfile.name + (currentProfile.name[currentProfile.name.length-1] === 's'?'\'':'\'s') + " last drug regiment?", [
                            {
                                text: 'No',
                                onPress: (() => {
                                    console.log('Cancel Pressed');
                                    setFieldValue('patientProfile', currentProfile);
                                    setFieldValue('weight', currentProfile['weight']);
                                    setFieldValue('gender', currentProfile['gender']);
                                    //console.log("currentProfile's kg_lbs: "+ currentProfile["kg_lbs"]);
                                    this._handleChangeSwitch(currentProfile['kg_lbs'], setFieldValue);
                                }),
                                style: 'cancel'
                            }, {
                                text: 'Yes',
                                onPress: () => {
                                    this.setFormValues(currentProfile.formData, currentProfile);
                                }
                            }
                        ],
                        {
                            cancelable: false
                        }
                    )
                }
                else{
                    setFieldValue('patientProfile', currentProfile);
                    setFieldValue('weight', currentProfile['weight']);
                    setFieldValue('gender', currentProfile['gender']);
                    //console.log("currentProfile's kg_lbs: "+ currentProfile["kg_lbs"]);
                    this._handleChangeSwitch(currentProfile['kg_lbs'], setFieldValue);
                }
                //console.log("current Profile selected: " + JSON.stringify(currentProfile));

                //setFieldValue('patientProfile', patientProfileName);
            }
            else{
                setFieldValue('patientProfile', this.state.defaultPatient)
            }
        }
        else{
            setFieldValue('patientProfile', this.state.defaultPatient);
        } //do not change anything

    };

    handleStepVisibility = (name,setFieldTouched) => {
        //console.log("step visibility toggle");

        this.props.onToggleIndicator();
        setFieldTouched(name)
    };

    handleSetDarkVisibility = (flag) => {
        this.setState(oldState =>{
            return({
                ...oldState,
                darkVisible: flag
            })
        })
    };

    handleFormatTime = (value)=>{
        return convertTimeToHourFormat(""+value);
    };

    render() {
        let drugList = ["Ritalin IR","Pms-Methylphenidate IR", "Concerta", "Pms-Methylphenidate ER"];

        let patientsList_id = ["None Selected"];

        //console.log("patientsList size: "+ this.props.patientsList.length);

        for(let i = 0; i < this.props.patientsList.length; i++)
        {

            patientsList_id.push(this.props.patientsList[i].id);
        }
        //console.log("patient list name: "+patientsList_id);
        //console.log("patient list: "+JSON.stringify(this.props.patientsList[0].name));
        let picker = this.props.Picker;
        return(
            <View style={styles.container}>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        if(this.state.amountOfPills>1)this.scrollView.scrollToEnd({animated: true});
                    }}
                >
                    <View>
                        <View style={[styles.centerElements]}>
                            <TitleComponent text={"Initialization"}/>
                        </View>
                        <Formik
                            initialValues={
                                (this.props.data)
                                    ?{
                                        patientProfile: this.props.data.patientProfile && typeof this.props.data.patientProfile !== 'undefined'
                                            ?this.props.data.patientProfile
                                            :this.state.defaultPatient, //always none selected because error otherwise?
                                        gender: this.props.data.gender,
                                        weight: this.props.data.weight,
                                        dose0: this.props.data.dose0,
                                        adminTime0: this.props.data.adminTime0,
                                        formula0: this.props.data.formula0,
                                        food0: this.props.data.food0,
                                        dose1: this.props.data.dose1,
                                        adminTime1: this.props.data.adminTime1,
                                        formula1: this.props.data.formula1,
                                        food1: this.props.data.food1,
                                        dose2: this.props.data.dose2,
                                        adminTime2: this.props.data.adminTime2,
                                        formula2: this.props.data.formula2,
                                        food2: this.props.data.food2,
                                        dose3: this.props.data.dose3,
                                        adminTime3: this.props.data.adminTime3,
                                        formula3: this.props.data.formula3,
                                        food3: this.props.data.food3,
                                        amountOfPills: this.props.data.amountOfPills,
                                        kg_lbs: parseInt(this.props.weight) > 101? true :(this.props.data.kg_lbs?this.props.data.kg_lbs:this.props.data.switchWeightFormat)
                                    }
                                    :{
                                        patientProfile:this.state.defaultPatient,
                                        gender: 'Male',
                                        weight: '40',
                                        dose0: '10',
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
                                        food3: 'No',
                                        amountOfPills: this.state.amountOfPills,
                                        kg_lbs: this.state.switchValue,
                                    }
                            }
                            onSubmit={this._handleSubmit}
                            validationSchema={this._handleValidation()}
                            validateOnBlur={false}
                            render={({
                                         values,
                                         handleSubmit,
                                         setFieldValue,
                                         errors,
                                         touched,
                                         setFieldTouched,
                                         isValid,
                                         isSubmitting,
                                     }) => (
                                <View>
                                    <View style={{flexDirection:"row", marginHorizontal: "10%"}}>
                                        <DropDownListV2
                                            value={values.patientProfile.name}
                                            label={"Patient Profile"}
                                            name="patientProfile"
                                            onChange={(name,value)=>{
                                                console.log("in development...? "+ value);
                                                this.handlePatientProfileSelection(value, setFieldValue)
                                            }}
                                            itemList={patientsList_id}
                                            Picker={picker}
                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                        />
                                    </View>
                                    <View style={[styles.genderWeightContainerContainer]}>
                                        <View style={[styles.twoPerRowContainer,{marginBottom:"0%"}]}>
                                            <DropDownListV2
                                                style={styles.inputContainer}
                                                value={values.gender}
                                                label={"Gender"}
                                                name="gender"
                                                onChange={setFieldValue}
                                                itemList={["Male","Female"]}
                                                Picker={picker}
                                                setDarkVisibility = {this.handleSetDarkVisibility}
                                            />
                                            <View style={[styles.inputContainer,styles.twoPerRowContainer, {width:"45%", justifyContent:"space-around"} ]}>
                                                <View style={{width:"80%", marginRight:0}}>
                                                    <Input
                                                        label={"Weight"}
                                                        labelPosition={"left"}
                                                        value={values.weight}
                                                        onChange={(name,value) =>{
                                                            setFieldValue(name,value)
                                                        }}
                                                        name="weight"
                                                        error={touched.weight && errors.weight}
                                                        keyboardType="numeric"
                                                        onBlur={setFieldTouched}
                                                        maxLength={5}
                                                    />
                                                </View>
                                                <View style={{paddingTop:"20%", marginLeft:0, paddingRight:20, flexDirection:'row', justifyContent:'center'}}>
                                                    <View style={{paddingTop:"25%"}}>
                                                        <Text>{(this.state.switchValue?"lbs":"kg ")}</Text>
                                                    </View>
                                                    <Switch
                                                        value={values.kg_lbs}
                                                        onValueChange={(value) => {
                                                            console.log("value of switch: "+ value);
                                                            this._handleChangeSwitch(value, setFieldValue);
                                                        }
                                                        }
                                                        tintColor={colors.royalBlue1}
                                                        onTintColor={colors.paleBlue1}
                                                        thumbTintColor={(Platform==="ios"? "white": '#eee')}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            ref={ref => this.formulation1 = ref}
                                            style={styles.drugContainer}
                                        >
                                            <LinedLabel label={"Formulation 1"} textPosition={"center"}/>
                                            <View style={styles.twoPerRowContainer}>
                                                <DropDownListV2
                                                    style={[styles.inputContainer, {width:"55%"}]}
                                                    label={ "Drug Formulation" }
                                                    value={values.formula0}
                                                    name="formula0"
                                                    onChange={(name, value) =>
                                                    {
                                                        this.setCurrentFormulation(0,value);
                                                        setFieldValue(name, value);
                                                        setFieldValue("dose0", this.getDoses(0)[0] )
                                                    }}
                                                    itemList={drugList}
                                                    Picker={picker}
                                                    setDarkVisibility = {this.handleSetDarkVisibility}
                                                />
                                                <DropDownListV2
                                                    style={[styles.inputContainer, {width:"35%"}]}
                                                    label={"Food"}
                                                    value={values.food0}
                                                    name="food0"
                                                    onChange={setFieldValue}
                                                    itemList={["No","Yes"]}
                                                    Picker={picker}
                                                    setDarkVisibility = {this.handleSetDarkVisibility}

                                                />
                                            </View>
                                            <View style={styles.twoPerRowContainer}>
                                                <DropDownListV2
                                                    style={styles.inputContainer}
                                                    value={values.dose0}
                                                    label={"Dosage"}
                                                    name="dose0"
                                                    onChange={setFieldValue}
                                                    itemList={this.getDoses(0)}
                                                    Picker={picker}
                                                    setDarkVisibility = {this.handleSetDarkVisibility}
                                                />
                                                <View style={[styles.inputContainer, {width:"55%"}]}>
                                                    {/*<Input*/}
                                                        {/*label="Administration Time"*/}
                                                        {/*value={values.adminTime0}*/}
                                                        {/*onChange={(name,value) => {*/}
                                                            {/*setFieldValue("adminTime0", value);*/}
                                                        {/*}}*/}
                                                        {/*onBlur={() =>{*/}
                                                            {/*setFieldValue("adminTime0", this.handleFormatTime(values.adminTime0));*/}
                                                        {/*}}*/}
                                                        {/*onTouch={setFieldTouched}*/}
                                                        {/*name="adminTime0"*/}
                                                        {/*error={touched.adminTime0 && errors.adminTime0}*/}
                                                        {/*keyboardType="numeric"*/}
                                                        {/*maxLength={5}*/}
                                                    {/*/>*/}
                                                    <CustomTimeModal
                                                        label="Administration Time"
                                                        onChange={(name, value) => {
                                                            // let time = value.split(":");
                                                            // if(amOrPmSwitch != null) {
                                                            //     //console.log("time[0] result before: "+ time[0]);
                                                            //     time[0] = parseInt(time[0]) + (amOrPmSwitch? 0 : 12);
                                                            //     //console.log("time[0] result after: "+ time[0]);
                                                            //
                                                            // }
                                                            // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                            setFieldValue(name, this.handleFormatTime(value));
                                                            //scroll to end or to next component? NOT WORKING
                                                            // let scrollTarget = this.state.amountOfPills > 1?this.formulation2:this.submitButton;
                                                            // console.log(this.scrollView)
                                                        }}
                                                        value={values.adminTime0}
                                                        name="adminTime0"
                                                        error={touched.adminTime0 && errors.adminTime0}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            this.state.amountOfPills >= 2
                                                ?
                                                <View
                                                    style={[styles.styleEvenFormulations,styles.drugContainer]}
                                                    ref={ref => this.formulation2 = ref}
                                                >
                                                    <LinedLabel label={"Formulation 2"} textPosition={"center"}/>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"55%"}]}
                                                            label={ "Drug Formulation" }
                                                            value={values.formula1}
                                                            name="formula1"
                                                            onChange={(name, value) =>
                                                            {
                                                                this.setCurrentFormulation(1,value);
                                                                setFieldValue(name, value);
                                                                setFieldValue("dose1", this.getDoses(1)[0] )
                                                            }}
                                                            itemList={drugList}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"35%"}]}
                                                            label={"Food"}
                                                            value={values.food1}
                                                            name="food1"
                                                            onChange={setFieldValue}
                                                            itemList={["No","Yes"]}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                    </View>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={styles.inputContainer}
                                                            value={values.dose1}
                                                            label={"Dosage"}
                                                            name="dose1"
                                                            onChange={setFieldValue}
                                                            itemList={this.getDoses(1)}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                        <View style={[styles.inputContainer, {width:"55%"}]}>
                                                            {/*<Input*/}
                                                                {/*label="Administration Time"*/}
                                                                {/*value={values.adminTime1}*/}
                                                                {/*onChange={(name,value) => {*/}
                                                                    {/*setFieldValue("adminTime1", value);*/}
                                                                {/*}}*/}
                                                                {/*onBlur={() =>{*/}
                                                                    {/*setFieldValue("adminTime1", this.handleFormatTime(values.adminTime1));*/}
                                                                    {/*setFieldTouched("adminTime1", true)*/}
                                                                {/*}}*/}
                                                                {/*onTouch={setFieldTouched}*/}
                                                                {/*name="adminTime1"*/}
                                                                {/*error={this.state.amountOfPills>=1?(touched.adminTime1 && errors.adminTime1): null}*/}
                                                                {/*keyboardType="numeric"*/}
                                                                {/*maxLength={5}*/}
                                                            {/*/>*/}
                                                            <CustomTimeModal
                                                                label="Administration Time"
                                                                onChange={(name, value) => {
                                                                    // let time = value.split(":");
                                                                    // if(amOrPmSwitch != null) {
                                                                    //     //console.log("time[0] result before: "+ time[0]);
                                                                    //     time[0] = parseInt(time[0]) + (amOrPmSwitch? 0 : 12);
                                                                    //     //console.log("time[0] result after: "+ time[0]);
                                                                    //
                                                                    // }
                                                                    // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                                    setFieldValue(name, this.handleFormatTime(value));
                                                                    //scroll to end or to next component? NOT WORKING
                                                                    // let scrollTarget = this.state.amountOfPills > 1?this.formulation2:this.submitButton;
                                                                    // console.log(this.scrollView)
                                                                }}
                                                                value={values.adminTime1}
                                                                name="adminTime1"
                                                                error={touched.adminTime1 && errors.adminTime1}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                :null
                                        }
                                        {
                                            this.state.amountOfPills >= 3
                                                ?
                                                <View
                                                    style={[styles.drugContainer]}
                                                    ref={ref => this.formulation3 = ref}
                                                >
                                                    <LinedLabel label={"Formulation 3"} textPosition={"center"}/>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"55%"}]}
                                                            label={ "Drug Formulation" }
                                                            value={values.formula2}
                                                            name="formula2" onChange={(name, value) =>
                                                        {
                                                            this.setCurrentFormulation(2,value);
                                                            setFieldValue(name, value);
                                                            setFieldValue("dose2", this.getDoses(2)[0] )
                                                        }}
                                                            itemList={drugList}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"35%"}]}
                                                            label={"Food"}
                                                            value={values.food2}
                                                            name="food2" onChange={setFieldValue}
                                                            itemList={["No","Yes"]}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                    </View>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={styles.inputContainer}
                                                            value={values.dose2}
                                                            label={"Dosage"}
                                                            name="dose2"
                                                            onChange={setFieldValue}
                                                            itemList={this.getDoses(2)}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}
                                                        />
                                                        <View style={[styles.inputContainer, {width:"55%"}]}>
                                                            {/*<Input*/}
                                                                {/*label="Administration Time"*/}
                                                                {/*value={values.adminTime2}*/}
                                                                {/*onChange={(name,value) => {*/}
                                                                    {/*setFieldValue("adminTime2", value);*/}
                                                                {/*}}*/}
                                                                {/*onBlur={() =>{*/}
                                                                    {/*setFieldValue("adminTime2", this.handleFormatTime(values.adminTime2));*/}
                                                                    {/*setFieldTouched("adminTime2", true)*/}

                                                                {/*}}*/}
                                                                {/*onTouch={setFieldTouched}*/}
                                                                {/*name="adminTime2"*/}
                                                                {/*error={this.state.amountOfPills>=2?(touched.adminTime2&& errors.adminTime2): null }*/}
                                                                {/*keyboardType="numeric"*/}
                                                                {/*maxLength={5}*/}
                                                            {/*/>*/}
                                                            <CustomTimeModal
                                                                label="Administration Time"
                                                                onChange={(name, value) => {
                                                                    // let time = value.split(":");
                                                                    // if(amOrPmSwitch != null) {
                                                                    //     //console.log("time[0] result before: "+ time[0]);
                                                                    //     time[0] = parseInt(time[0]) + (amOrPmSwitch? 0 : 12);
                                                                    //     //console.log("time[0] result after: "+ time[0]);
                                                                    //
                                                                    // }
                                                                    // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                                    setFieldValue(name, this.handleFormatTime(value));
                                                                    //scroll to end or to next component? NOT WORKING
                                                                    // let scrollTarget = this.state.amountOfPills > 1?this.formulation2:this.submitButton;
                                                                    // console.log(this.scrollView)
                                                                }}
                                                                value={values.adminTime2}
                                                                name="adminTime2"
                                                                error={touched.adminTime2 && errors.adminTime2}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                :null
                                        }
                                        {
                                            this.state.amountOfPills >= 4
                                                ?
                                                <View
                                                    style={[styles.drugContainer,styles.styleEvenFormulations]}
                                                    ref={ref => this.formulation4 = ref}
                                                >
                                                    <LinedLabel label={"Formulation 4"} textPosition={"center"}/>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"55%"}]}
                                                            label={ "Drug Formulation" }
                                                            value={values.formula3}
                                                            name="formula3"
                                                            onChange={
                                                                (name, value) =>
                                                                {
                                                                    this.setCurrentFormulation(3,value);
                                                                    setFieldValue(name, value);
                                                                    setFieldValue("dose3", this.getDoses(3)[0] )
                                                                }
                                                            }
                                                            itemList={drugList}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}

                                                        />
                                                        <DropDownListV2
                                                            style={[styles.inputContainer, {width:"35%"}]}
                                                            label={"Food"}
                                                            value={values.food3}
                                                            name="food3" onChange={setFieldValue}
                                                            itemList={["No","Yes"]}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}

                                                        />
                                                    </View>
                                                    <View style={styles.twoPerRowContainer}>
                                                        <DropDownListV2
                                                            style={styles.inputContainer}
                                                            value={values.dose3}
                                                            label={"Dosage"}
                                                            name="dose3"
                                                            onChange={setFieldValue}
                                                            itemList={this.getDoses(3)}
                                                            Picker={picker}
                                                            setDarkVisibility = {this.handleSetDarkVisibility}

                                                        />
                                                        <View style={[styles.inputContainer, {width:"55%"}]}>
                                                            {/*<Input*/}
                                                                {/*label="Administration Time"*/}
                                                                {/*value={values.adminTime3}*/}
                                                                {/*onChange={(name,value) => {*/}
                                                                    {/*setFieldValue("adminTime3", value);*/}
                                                                {/*}}*/}
                                                                {/*onBlur={() =>{*/}
                                                                    {/*setFieldValue("adminTime3", this.handleFormatTime(values.adminTime3));*/}
                                                                    {/*setFieldTouched("adminTime3", true)*/}

                                                                {/*}}*/}
                                                                {/*onTouch={setFieldTouched}*/}
                                                                {/*name="adminTime3"*/}
                                                                {/*error={this.state.amountOfPills>=3?(touched.adminTime3 && errors.adminTime3): null}*/}
                                                                {/*keyboardType="numeric"*/}
                                                                {/*maxLength={5}*/}
                                                            {/*/>*/}
                                                            <CustomTimeModal
                                                                label="Administration Time"
                                                                onChange={(name, value) => {
                                                                    // let time = value.split(":");
                                                                    // if(amOrPmSwitch != null) {
                                                                    //     //console.log("time[0] result before: "+ time[0]);
                                                                    //     time[0] = parseInt(time[0]) + (amOrPmSwitch? 0 : 12);
                                                                    //     //console.log("time[0] result after: "+ time[0]);
                                                                    //
                                                                    // }
                                                                    // let formattedTime = this.handleFormatTime(time[0]+":"+ time[1]);
                                                                    setFieldValue(name, this.handleFormatTime(value));
                                                                    //scroll to end or to next component? NOT WORKING
                                                                    // let scrollTarget = this.state.amountOfPills > 1?this.formulation2:this.submitButton;
                                                                    // console.log(this.scrollView)
                                                                }}
                                                                value={values.adminTime3}
                                                                name="adminTime3"
                                                                error={touched.adminTime3 && errors.adminTime3}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                :null
                                        }
                                    </View>
                                    <View style={styles.pillButtonsContainer}>
                                        {/*<Button*/}
                                            {/*icon={{ name: 'minus', type: 'font-awesome' }}*/}
                                            {/*buttonStyle={styles.pillButton}*/}
                                            {/*title="Remove a pill!"*/}
                                            {/*onPress={() => {*/}
                                                {/*setFieldValue("amountOfPills", this.state.amountOfPills-1);*/}
                                                {/*this.removeDrugs();*/}
                                            {/*}*/}
                                            {/*}*/}
                                            {/*disabled={this.state.amountOfPills<=1}*/}
                                        {/*/>*/}
                                        <View style={{marginRight: 10}}>
                                            <TouchableOpacity
                                                onPress={() =>{
                                                    setFieldValue("amountOfPills", this.state.amountOfPills-1);
                                                    this.removeDrugs();
                                                }}
                                                disabled={this.state.amountOfPills<=1}
                                            >
                                                <View style={[styles.pillButton2, (this.state.amountOfPills<=1? styles.pillButtonDisabled: styles.pillButtonEnabled)]}>
                                                    <View style={{alignItems:"center", justifyContent:"center", paddingLeft: 5, paddingRight:10}}>
                                                        <Icon name={"minus"} color="#FFF"/>
                                                    </View>
                                                    <Text style={{textAlign: 'center', color:'#FFF', fontSize: 18}}>
                                                        Remove a pill
                                                    </Text>

                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {/*<Button*/}
                                            {/*iconRight={{ name: 'plus', type: 'font-awesome'}}*/}
                                            {/*buttonStyle={styles.pillButton}*/}
                                            {/*title="Add a pill!"*/}
                                            {/*onPress={() =>{*/}
                                                {/*setFieldValue("amountOfPills", this.state.amountOfPills+1);*/}
                                                {/*this.addDrugs();*/}
                                            {/*}}*/}
                                            {/*disabled={this.state.amountOfPills>=4}*/}
                                        {/*/>*/}
                                        <View>
                                            <TouchableOpacity
                                                onPress={() =>{
                                                    setFieldValue("amountOfPills", this.state.amountOfPills+1);
                                                    this.addDrugs();
                                                }}
                                                disabled={this.state.amountOfPills>=4}
                                            >
                                                <View style={[styles.pillButton2, (this.state.amountOfPills>=4? styles.pillButtonDisabled: styles.pillButtonEnabled)]}>
                                                    <Text style={{textAlign: 'center', color:'#FFF', fontSize: 18}}>Add a pill</Text>
                                                    <View style={{alignItems:"center", justifyContent:"center", paddingLeft: 10, paddingRight:5}}>
                                                        <Icon name={"plus"} color="#FFF"/>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.buttonContainer}
                                        ref={ref => this.submitButton = ref}
                                    >
                                        <Button
                                            buttonStyle={styles.button}
                                            title="Go to next step"
                                            onPress={handleSubmit}
                                            disabled={(!isValid || isSubmitting) && this.props.data==null}
                                            loading={isSubmitting}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
                {(this.state.darkVisible)?
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.handleSetDarkVisibility(!this.state.darkVisible);
                            this.props.Picker.hide()
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#000',
                                opacity: 0.5,
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                zIndex: 2
                            }}
                        />
                    </TouchableWithoutFeedback>
                    :<View/>
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
    },

    genderWeightContainerContainer: {
        marginHorizontal: Dimensions.get('window').width*0.05,
        //marginTop: Dimensions.get('window').height*0.12,
    },

    centerElements:{
        alignItems: "center",
        justifyContent: "center",
    },

    button: {

        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.royalBlue2

    },

    buttonContainer:{
        marginVertical: 15,
    },

    pillButton: {
        borderRadius:100,
        backgroundColor: "#262626",
    },

    pillButton2: {
        borderRadius:100,
        backgroundColor: "#262626",
        width:"100%",
        flexDirection:"row",
        padding:12,
    },

    pillButtonEnabled: {
        backgroundColor: "#262626"
    },

    pillButtonDisabled: {
        backgroundColor: "#dcdcdc"
    },

    pillButtonsContainer: {
        width: '100%',
        flexDirection:'row',
        justifyContent: "center",
        alignItems: 'flex-end',
        borderWidth:0,
        marginTop: (Dimensions.get('window').height)*0.005
    },

    twoPerRowContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },

    inputContainer:{
        width: '45%',
    },
    indicatorContainer:{
        flex:1,
        flexDirection: "row",
        justifyContent:"space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
    },

    styleEvenFormulations:{
      backgroundColor: '#ebebeb',
    },

    styleUnevenFormulations:{

    },

    drugContainer:{
        borderColor:"#555",
        borderWidth: 0,
        borderRadius:0,
        width: "100%",
        marginLeft: 0,
        marginBottom:3,
        padding: 10,
        paddingTop:0
    },

});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (pos) => dispatch(changePosition(pos)),
    };
};

export default connect(null,mapDispatchToProps)(FormScreenInitial);