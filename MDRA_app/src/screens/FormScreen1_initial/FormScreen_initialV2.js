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
    TouchableWithoutFeedback
} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


//function imports
import {convertTimeToHourFormat} from '../../functions/FormatTime';
import containsOnlyNumbers from '../../functions/containsOnlyNumbers';

//component imports
import Input from "../../components/Input/Input";
import DropDownListV2 from "../../components/dropDownList/DropDownListV2";
import LinedLabel from "../../components/LinedLabel/LinedLabel";
import NewYupString from '../../components/NewYupString/NewYupString';
//actions imports
import {connect}  from "react-redux";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";


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
        timeValues:
            this.props.data
                ?[
                    this.props.data.adminTime0,
                    this.props.data.adminTime1,
                    this.props.data.adminTime2,
                    this.props.data.adminTime3,
                ]
                :["","","",""]
        ,
        //if there is data and an amountOfPills,
        // Number of pill given (1 to 4)
        amountOfPills:this.props.data
            ?this.props.data.amountOfPills
                ? this.props.data.amountOfPills
                : 1
            :1,
        //Switch value indicates if weight is in pounds (true) or in kg (false)
        switchValue: this.props.data?
            this.props.data.switchWeightFormat: false,
    };

    _handleSubmit =(async (values, bag) => {
        try {
            //console.log(JSON.stringify(values));
            this.props.onAddData(values, this.state.currentPosition);
            bag.setSubmitting(false);
            this.props.onChangePosition(this.state.currentPosition+1);
            console.log("doing setPage");
            this.props.setPage(this.state.currentPosition+1);

        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    _handleChangeSwitch = (switchBoolean) => {
        this.setState(oldState =>{
            return {
                ...oldState,
                switchValue:switchBoolean
            }
        });
    };

    _handleValidation = () => {
        let requiredMessage = "This is required";
        switch (this.state.amountOfPills)
        {

            case 1:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(160).required(requiredMessage):Yup.number().positive().lessThan(80).required(requiredMessage),
                        adminTime0: NewYupString().containsOnlyNumbers().required(requiredMessage),
                    })
                );
            case 2:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(160).required():Yup.number().positive().lessThan(80).required(requiredMessage),
                        adminTime0: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString().containsOnlyNumbers().required(requiredMessage),
                    })
                );
            case 3:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(160).required():Yup.number().positive().lessThan(80).required(requiredMessage),
                        adminTime0: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime2: NewYupString().containsOnlyNumbers().required(requiredMessage)
                    })
                );
            case 4:
                return (
                    Yup.object().shape({
                        weight: this.state.switchValue?Yup.number().positive().lessThan(160).required():Yup.number().positive().lessThan(80).required(requiredMessage),
                        adminTime0: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime1: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime2: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        adminTime3: NewYupString().containsOnlyNumbers().required(requiredMessage),

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

    handleFormatTime = (value)=>{
        return convertTimeToHourFormat(""+value);
    };

    render() {
        let drugList = ["Ritalin IR","Pms-Methylphenidate IR", "Concerta", "Pms-Methylphenidate ER"];
        let picker = this.props.Picker;
        return(
            <View style={styles.container}>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                >
                    <KeyboardAwareScrollView>
                        <View>
                            <View style={styles.centerElements}>
                                <Text>Initialization</Text>
                            </View>
                            <Formik
                                initialValues={
                                    (this.props.data)
                                        ?{
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
                                            switchWeightFormat: this.props.switchWeightFormat
                                        }
                                        :{
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
                                            switchWeightFormat: this.state.switchValue,
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
                                             isSubmitting
                                         }) => (
                                    <View>
                                        <View style={{margin:"5%"}}>
                                            <View style={[styles.twoPerRowContainer,{marginBottom:"0%"}]}>
                                                <DropDownListV2
                                                    style={styles.inputContainer}
                                                    value={values.gender}
                                                    label={"Gender"}
                                                    name="gender"
                                                    onChange={setFieldValue}
                                                    itemList={["Male","Female"]}
                                                    Picker={picker}
                                                />
                                                <View style={[styles.inputContainer,styles.twoPerRowContainer, {width:"45%", justifyContent:"space-around"} ]}>
                                                    <View style={{width:"80%", marginRight:0}}>
                                                        <Input
                                                            label={"Weight"}
                                                            value={values.weight}
                                                            onChange={(name,value) =>{
                                                                setFieldValue(name,value)
                                                            }}
                                                            onTouch={setFieldTouched}
                                                            name="weight"
                                                            error={touched.weight && errors.weight}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                    <View style={{paddingTop:"20%", marginLeft:0, paddingRight:20, flexDirection:'row', justifyContent:'center'}}>
                                                        <View style={{paddingTop:"25%"}}>
                                                            <Text>{(this.state.switchValue?"lbs":"kg ")}</Text>
                                                        </View>
                                                        <Switch
                                                            value={this.state.switchValue}
                                                            onValueChange={(value) => {
                                                                setFieldValue('switchWeightFormat', !this.state.switchValue);
                                                                this._handleChangeSwitch(value);
                                                            }
                                                            }
                                                            tintColor={"#a8eebc"}
                                                            onTintColor={"#b1d6ee"}
                                                            thumbTintColor={(Platform==="ios"? "white": '#eee')}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={styles.drugContainer}>
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
                                                    />
                                                    <DropDownListV2
                                                        style={[styles.inputContainer, {width:"35%"}]}
                                                        label={"Food"}
                                                        value={values.food0}
                                                        name="food0"
                                                        onChange={setFieldValue}
                                                        itemList={["No","Yes"]}
                                                        Picker={picker}
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
                                                    />
                                                    <View style={[styles.inputContainer, {width:"55%"}]}>
                                                        <Input
                                                            label="Administration Time"
                                                            value={values.adminTime0}
                                                            onChange={(name,value) => {
                                                                setFieldValue("adminTime0", value);
                                                            }}
                                                            onBlur={() =>{
                                                                setFieldValue("adminTime0", this.handleFormatTime(values.adminTime0));
                                                            }}
                                                            name="adminTime0"
                                                            error={touched.adminTime0 && errors.adminTime0}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                this.state.amountOfPills >= 2
                                                    ?
                                                    <View style={[styles.styleEvenFormulations,styles.drugContainer]}>
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
                                                            />
                                                            <DropDownListV2
                                                                style={[styles.inputContainer, {width:"35%"}]}
                                                                label={"Food"}
                                                                value={values.food1}
                                                                name="food1"
                                                                onChange={setFieldValue}
                                                                itemList={["No","Yes"]}
                                                                Picker={picker}
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
                                                            />
                                                            <View style={[styles.inputContainer, {width:"55%"}]}>
                                                                <Input
                                                                    label="Administration Time"
                                                                    value={values.adminTime1}
                                                                    onChange={(name,value) => {
                                                                        setFieldValue("adminTime1", value);
                                                                    }}
                                                                    onBlur={() =>{
                                                                        setFieldValue("adminTime1", this.handleFormatTime(values.adminTime1));
                                                                    }}
                                                                    onTouch={setFieldTouched}
                                                                    name="adminTime1"
                                                                    error={this.state.amountOfPills>=1?(touched.adminTime1 && errors.adminTime1): null}
                                                                    keyboardType="numeric"
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :null
                                            }
                                            {
                                                this.state.amountOfPills >= 3
                                                    ?
                                                    <View style={[styles.drugContainer]}>
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
                                                            />
                                                            <DropDownListV2
                                                                style={[styles.inputContainer, {width:"35%"}]}
                                                                label={"Food"}
                                                                value={values.food2}
                                                                name="food2" onChange={setFieldValue}
                                                                itemList={["No","Yes"]}
                                                                Picker={picker}
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
                                                            />
                                                            <View style={[styles.inputContainer, {width:"55%"}]}>
                                                                <Input
                                                                    label="Administration Time"
                                                                    value={values.adminTime2}
                                                                    onChange={(name,value) => {
                                                                        setFieldValue("adminTime2", value);
                                                                    }}
                                                                    onBlur={() =>{
                                                                        setFieldValue("adminTime2", this.handleFormatTime(values.adminTime2));
                                                                    }}
                                                                    onTouch={setFieldTouched}
                                                                    name="adminTime2"
                                                                    error={this.state.amountOfPills>=2?(touched.adminTime2&& errors.adminTime2): null }
                                                                    keyboardType="numeric"
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :null
                                            }
                                            {
                                                this.state.amountOfPills >= 4
                                                    ?
                                                    <View style={[styles.drugContainer,styles.styleEvenFormulations]}>
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
                                                            />
                                                            <DropDownListV2
                                                                style={[styles.inputContainer, {width:"35%"}]}
                                                                label={"Food"}
                                                                value={values.food3}
                                                                name="food3" onChange={setFieldValue}
                                                                itemList={["No","Yes"]}
                                                                Picker={picker}
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
                                                            />
                                                            <View style={[styles.inputContainer, {width:"55%"}]}>
                                                                <Input
                                                                    label="Administration Time"
                                                                    value={values.adminTime3}
                                                                    onChange={(name,value) => {
                                                                        setFieldValue("adminTime3", value);
                                                                    }}
                                                                    onBlur={() =>{
                                                                        setFieldValue("adminTime3", this.handleFormatTime(values.adminTime3));
                                                                    }}
                                                                    onTouch={setFieldTouched}
                                                                    name="adminTime3"
                                                                    error={this.state.amountOfPills>=3?(touched.adminTime3 && errors.adminTime3): null}
                                                                    keyboardType="numeric"
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :null
                                            }
                                        </View>
                                        <View style={styles.pillButtonsContainer}>
                                            <Button
                                                icon={{ name: 'minus', type: 'font-awesome' }}
                                                buttonStyle={styles.pillButton}
                                                title="Remove a pill!"
                                                onPress={() => {
                                                    setFieldValue("amountOfPills", this.state.amountOfPills-1);
                                                    this.removeDrugs();
                                                }
                                                }
                                                disabled={this.state.amountOfPills<=1}
                                            />
                                            <Button
                                                iconRight={{ name: 'plus', type: 'font-awesome'}}
                                                buttonStyle={styles.pillButton}
                                                title="Add a pill!"
                                                onPress={() =>{
                                                    setFieldValue("amountOfPills", this.state.amountOfPills+1);
                                                    this.addDrugs();
                                                }}
                                                disabled={this.state.amountOfPills>=4}
                                            />
                                        </View>
                                        <Button
                                            buttonStyle={styles.button}
                                            title="Go to next step"
                                            onPress={handleSubmit}
                                            disabled={(!isValid || isSubmitting) && this.props.data==null}
                                            loading={isSubmitting}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
    },


    centerElements:{
        alignItems: "center",
        justifyContent: "center",
    },

    button: {
        marginVertical: 20,
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },

    pillButton: {
        borderRadius:100,
        backgroundColor: "#262626"
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
        padding: 10
    },

});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (pos) => dispatch(changePosition(pos))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenInitial);