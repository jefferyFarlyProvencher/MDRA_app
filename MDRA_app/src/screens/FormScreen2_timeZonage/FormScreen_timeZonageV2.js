//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView, Alert, Dimensions, Text, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Ionicon from 'react-native-vector-icons/Ionicons'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'

//functions imports
import {convertTimeToHourFormat, convertTimeToDecimal} from '../../functions/FormatTime';


//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";
import CustomMultiSlider from "../../components/CustomMultiSlider/CustomMultiSlider";
import LinedLabel from "../../components/LinedLabel/LinedLabel";
import NewYupString from "../../components/NewYupString/NewYupString";
import FormBackButton from "../../components/FormBackButton/FormBackButton";

//redux imports
import {connect} from "react-redux";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";
import DropDownListV2 from "../../components/dropDownList/DropDownListV2";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

//assets imports
import * as colors from "../../assets/colors"

//THIS CLASS REFERS TO THE BOXES FOR RESULT PAGE
// THERE IS A WEIRD BUG THAT PREVENTS ME FROM CHANGING the name
// Look, we all know timeZonage is a weird name, but I didn't know what the
//page was going to look like so leave it as it is instead of trying to deal with the bug
// AND LETS BE HONEST, IT'S A FUNNY NAME!
class FormScreenTimeZonage extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        currentPosition: 1,
        nbOfBoxes: this.props.data
            ?this.props.data.nbTherapeuticBoxes==="One therapeutic box (from AM to PM)"
                ?1:2
            :1,

    };

    /*
        _handleSumbit adds the data to the local storage
        removes loading status of button and changes screen
     */
    _handleSubmit =(async (values, bag) => {
        try {
            this.props.onAddData(values, this.state.currentPosition);

            this.props.setPage(this.state.currentPosition+1);
            this.props.onChangePosition(this.state.currentPosition+1);
            setTimeout(
                () => {
                    bag.setSubmitting(false);
                },
                1000)
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    /*
        There are two validations,
        one for 1 box and one for 2 boxes
     */
    _handleValidation = () => {
        let requiredMessage = "This is required";
        let thisTimeShouldBe = "This time should be ";
        switch (this.state.nbOfBoxes) {
            case 1:
                return (
                    Yup.object().shape({
                        tsDay: NewYupString().containsOnlyNumbers().required(requiredMessage),
                        teDay: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsDay', null)).isEarlierThan('16:00', thisTimeShouldBe + "earlier than 16:00").required(requiredMessage),
                        tsEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('teDay', null)).required(requiredMessage),
                        teEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        lunch: NewYupString().containsOnlyNumbers().isLaterThan('11:00', thisTimeShouldBe + "later than 11:00").isEarlierThan(Yup.ref('tsEvening', null)).required(requiredMessage),//Yup.number().positive().lessThan(Yup.ref('tsEvening', null)).moreThan(10).required(requiredMessage),
                        bed: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('teEvening', null)).required(requiredMessage),//Yup.number().positive().lessThan(24.00001,"Cannot exceed 24").moreThan(18.99999,"Cannot be less than 19").required(requiredMessage)
                    })
                );
            case 2:
                return (
                    Yup.object().shape({
                        tsDay: NewYupString().containsOnlyNumbers().required(requiredMessage),//Yup.number().positive().lessThan(Yup.ref('teDay', null)).required(requiredMessage),
                        teDay: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsDay', null)).required(requiredMessage),//Yup.number().positive().moreThan(Yup.ref('tsDay', null)).lessThan(12.0001).required(requiredMessage),
                        tsPM:  NewYupString().containsOnlyNumbers().isLaterThan('12:00', thisTimeShouldBe + "later than 11:59").required(requiredMessage),//Yup.number().positive().moreThan(11.999999).required(requiredMessage),
                        tePM: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsPM', null)).required(requiredMessage),//Yup.number().positive().moreThan(Yup.ref('tsPM', null)).required(requiredMessage),
                        tsEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tePM', null)).required(requiredMessage),//Yup.number().positive().moreThan(Yup.ref('teDay'), null).required(requiredMessage),
                        teEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsEvening', null)).required(requiredMessage),//Yup.number().positive().moreThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        lunch: NewYupString().containsOnlyNumbers().isLaterThan('11:00', thisTimeShouldBe + "later than 11:00").isEarlierThan(Yup.ref('tsEvening', null)).required(requiredMessage),//Yup.number().positive().lessThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        bed: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('teEvening', null)).required(requiredMessage),//Yup.number().positive().lessThan((24.00001)).moreThan(Yup.ref('teEvening', null)).required(requiredMessage)
                    })
                );
        }
    };

    _handleGoToPreviousStep = () => {
        this.props.onChangePosition(this.state.currentPosition-1);
        this.props.setPage(this.state.currentPosition-1);
    };

    handleFormatTime= (value) => {
        return convertTimeToHourFormat(""+value)
    };

    /*
        takes HH:MM value
        returns float
     */
    handleUnFormatTime = (value) => {
        return parseFloat(convertTimeToDecimal(""+value))
    };

    render() {
        return(
            <View>
                <KeyboardAwareScrollView>
                        <View style={styles.centerElements}>
                            <TitleComponent text={"Therapeutic Boxes"}/>
                        </View>
                        <FormBackButton
                            onPress={this._handleGoToPreviousStep}
                        />
                        <View>
                            <Formik
                                initialValues={(this.props.data)
                                    ?{
                                        nbTherapeuticBoxes:this.props.data.nbTherapeuticBoxes,
                                        tsDay: this.props.data.tsDay,
                                        teDay:this.props.data.teDay,
                                        tsPM:this.props.data.tsPM,
                                        tePM:this.props.data.tePM,
                                        tsEvening:this.props.data.tsEvening,
                                        teEvening:this.props.data.teEvening,
                                        lunch:this.props.data.lunch,
                                        bed:this.props.data.bed,
                                    }
                                    :{
                                        nbTherapeuticBoxes:"One therapeutic box (from AM to PM)",
                                        tsDay: '6:00',
                                        teDay:'15:00',
                                        tsPM:'15:00',
                                        tePM:'18:00',
                                        tsEvening:'18:00',
                                        teEvening:'20:00',
                                        lunch:'12:00',
                                        bed:'24:00',
                                    }
                                }
                                onSubmit={this._handleSubmit}
                                validationSchema={this._handleValidation}
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
                                        <View style={{flexDirection:"row"}}>
                                            <DropDownListV2
                                                onChange={(name,value) => {
                                                    let onlyOneBox= value==="One therapeutic box (from AM to PM)";
                                                    if(!onlyOneBox) { //if two boxes
                                                        if(parseFloat(values.teDay) > 12) {
                                                            setFieldValue('teDay', '12:00');
                                                        }
                                                    }
                                                    this.setState( (oldState) =>
                                                        {
                                                            return(
                                                                {
                                                                    ...oldState,
                                                                    nbOfBoxes: (onlyOneBox)
                                                                        ?1
                                                                        :2
                                                                }
                                                            )
                                                        }
                                                    );
                                                    setFieldValue(name,value)
                                                }}
                                                name="nbTherapeuticBoxes"
                                                label={"Select how many Therapeutic boxes"}
                                                value={values.nbTherapeuticBoxes}
                                                itemList={["One therapeutic box (from AM to PM)","Two therapeutic boxes (AM and PM)"]}
                                                Picker={this.props.Picker}
                                            />
                                        </View>
                                        <View style={{backgroundColor: "white"}}>
                                            <LinedLabel
                                                label={(this.state.nbOfBoxes===1)?"Day Box": "AM Box" }
                                                textPosition="left"/>
                                            <View>
                                                <View style={styles.twoPerRowContainer}>
                                                    <View style={styles.inputContainerForTwo}>
                                                        <Input
                                                            label="Start Time"
                                                            value={values.tsDay}
                                                            onChange={(name,value) => {
                                                                setFieldValue(name,value)
                                                            }}
                                                            onBlur={() =>{
                                                                setFieldValue("tsDay", this.handleFormatTime(values.tsDay));
                                                            }}
                                                            onTouch={setFieldTouched}
                                                            name="tsDay"
                                                            error={touched.tsDay && errors.tsDay}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                    <View style={styles.inputContainerForTwo}>
                                                        <Input
                                                            label="End Time"
                                                            value={values.teDay}
                                                            onChange={(name,value) => {
                                                                setFieldValue(name,value)
                                                            }}
                                                            onBlur={() =>{
                                                                setFieldValue("teDay", this.handleFormatTime(values.teDay));
                                                            }}
                                                            onTouch={setFieldTouched}
                                                            name="teDay"
                                                            error={touched.teDay && errors.teDay}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                            >
                                                <CustomMultiSlider
                                                    sliderLength={Dimensions.get("window").width*0.80}
                                                    min={0}
                                                    max={17}
                                                    step={0.5}
                                                    values={[this.handleUnFormatTime(values.tsDay),this.handleUnFormatTime(values.teDay)]}
                                                    onValuesChange={
                                                        (values) => {
                                                            setFieldValue('tsDay', this.handleFormatTime(values[0].toString()));
                                                            setFieldValue('teDay', this.handleFormatTime(values[1].toString()));
                                                        }
                                                    }
                                                />
                                            </View>
                                        </View>
                                        {(this.state.nbOfBoxes === 2)
                                            ?
                                            <View style={{backgroundColor: "white"}}>
                                                <LinedLabel
                                                    label={"PM Box"}
                                                    textPosition="center"/>
                                                <View style={styles.twoPerRowContainer}>
                                                    <View style={styles.inputContainerForTwo}>
                                                        < Input
                                                        label = "Start Time"
                                                        value={values.tsPM}
                                                        onChange={(name,value) => {
                                                            setFieldValue(name,value)
                                                        }}
                                                        onBlur={() =>{
                                                            setFieldValue("tsPM", this.handleFormatTime(values.tsPM));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="tsPM"
                                                        error={touched.tsPM && errors.tsPM}
                                                        keyboardType="numeric"
                                                        />
                                                    </View>
                                                    <View style={styles.inputContainerForTwo}>
                                                        <Input
                                                        label="End Time"
                                                        value={values.tePM}
                                                        onChange={(name,value) => {
                                                            setFieldValue(name,value)
                                                        }}
                                                        onBlur={() =>{
                                                            setFieldValue("tePM", this.handleFormatTime(values.tePM));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="tePM"
                                                        error={touched.tePM && errors.tePM}
                                                        keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        margin:20,
                                                        flexDirection:'row',
                                                        justifyContent:'space-around'
                                                    }}
                                                >
                                                    <CustomMultiSlider
                                                        sliderLength={Dimensions.get("window").width*0.80}
                                                        min={this.handleUnFormatTime(values.teDay)}
                                                        max={18}
                                                        step={0.5}
                                                        values={[this.handleUnFormatTime(values.tsPM),this.handleUnFormatTime(values.tePM)]}
                                                        onValuesChange={
                                                            (values) => {
                                                                setFieldValue('tsPM', this.handleFormatTime(values[0].toString()));
                                                                setFieldValue('tePM', this.handleFormatTime(values[1].toString()));
                                                            }
                                                        }
                                                    />
                                            </View>
                                            </View>
                                            :<View/>
                                        }
                                        <View style={{backgroundColor: "white"}}>
                                            <LinedLabel
                                                label={"Evening Box"}
                                                textPosition="right"/>
                                            <View style={styles.twoPerRowContainer}>
                                                <View style={styles.inputContainerForTwo}>
                                                    <Input
                                                        label="Start Time"
                                                        value={
                                                            values.tsEvening
                                                        }
                                                        onChange={setFieldValue}
                                                        onTouch={setFieldTouched}
                                                        onBlur={() =>{
                                                            setFieldValue("tsEvening", this.handleFormatTime(values.tsEvening));
                                                        }}
                                                        name="tsEvening"
                                                        error={touched.tsEvening && errors.tsEvening}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                <View style={styles.inputContainerForTwo}>
                                                    <Input
                                                        label="End Time"
                                                        value={
                                                            this.handleFormatTime(values.teEvening)<this.handleFormatTime(values.tsEvening)
                                                                ?setFieldValue('teEvening', values.tsEvening)+0.5
                                                                :values.teEvening

                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={() =>{
                                                            setFieldValue("teEvening", this.handleFormatTime(values.teEvening));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="teEvening"
                                                        error={touched.teEvening && errors.teEvening}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>
                                            <View
                                                style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                            >
                                                <CustomMultiSlider
                                                    sliderLength={Dimensions.get("window").width*0.80}
                                                    min={this.state.nbOfBoxes === 2
                                                        ?this.handleUnFormatTime(values.tePM)
                                                        :this.handleUnFormatTime(values.teDay)
                                                    }
                                                    max={24}
                                                    step={0.5}
                                                    snapped={true}
                                                    values={
                                                        [
                                                            this.handleUnFormatTime(values.tsEvening),
                                                            this.handleUnFormatTime(values.teEvening)
                                                        ]
                                                    }
                                                    onValuesChange={
                                                        (valuesS) => {
                                                            setFieldValue('tsEvening', this.handleFormatTime(valuesS[0].toString()));
                                                            setFieldValue('teEvening', this.handleFormatTime(valuesS[1].toString()));
                                                        }
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.bedAndLunchContainer}>
                                            <View style={styles.inputWithIconContainer}>
                                                <View  style={styles.inputWithIcon_Icon}>
                                                    <Ionicon
                                                        size={35}
                                                        name= {Platform.OS==='android'? "md-restaurant" :"ios-restaurant"}
                                                        color="#52afff" style={styles.drawerItemIcon}
                                                    />
                                                </View>
                                                <View style={styles.inputWithIcon_Input}>
                                                    <Input
                                                        label="Lunch Time (o'clock)"
                                                        value={values.lunch}
                                                        onChange={setFieldValue}
                                                        onBlur={() =>{
                                                            setFieldValue("lunch", this.handleFormatTime(values.lunch));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="lunch"
                                                        error={touched.lunch && errors.lunch}
                                                        keyboardType="numeric"
                                                    />
                                                </View>

                                            </View>
                                            <View style={[styles.inputWithIconContainer]}>
                                                <View  style={styles.inputWithIcon_Icon}>
                                                    <AwesomeIcon
                                                        size={35}
                                                        name= {Platform.OS==='android'? "bed" :"bed"}
                                                        color="#52afff" style={styles.drawerItemIcon}
                                                    />
                                                </View>
                                                <View style={styles.inputWithIcon_Input}>
                                                    <Input
                                                        label="Bed Time (o'clock)"
                                                        value={values.bed}
                                                        onChange={setFieldValue}
                                                        onBlur={() =>{
                                                            setFieldValue("bed", this.handleFormatTime(values.bed));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="bed"
                                                        error={touched.bed && errors.bed}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <Button
                                                buttonStyle={styles.button}
                                                title="Go to weights"
                                                onPress={handleSubmit}
                                                loading={isSubmitting}
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                </KeyboardAwareScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white",
        paddingHorizontal: "5%"
    },

    centerElements:{
        alignItems: "center",
        justifyContent: "center",
    },

    button: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:colors.royalBlue2,
    },

    buttonContainer:{
        width:"100%",
        marginTop: 20,
        marginBottom: 10
    },

    twoPerRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    inputContainerForTwo:{
        width: '50%',
    },
    indicatorContainer:{
        flex:1,flexDirection: "row",
        justifyContent:"space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
    },

    bedAndLunchContainer:{
        paddingHorizontal: "5%",
    },

    inputWithIconContainer: {
        flexDirection: 'row',
    },

    inputWithIcon_Icon:{
        width:"10%",
        paddingTop:"10%"
    },

    inputWithIcon_Input:{
        width:"90%"
    }
});
const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data,position) => dispatch(addData(data,position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenTimeZonage);