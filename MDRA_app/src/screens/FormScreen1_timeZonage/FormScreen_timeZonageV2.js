//system imports
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Alert,
    Dimensions,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Keyboard
} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Ionicon from 'react-native-vector-icons/Ionicons'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

//functions imports
import {convertTimeToHourFormat, convertTimeToDecimal} from '../../functions/FormatTime';

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/DropDownList/DropDownList";
import CustomMultiSlider from "../../components/CustomMultiSlider/CustomMultiSlider";
import LinedLabel from "../../components/LinedLabel/LinedLabel";
import NewYupString from "../../components/NewYupString/NewYupString";
import FormBackButton from "../../components/FormBackButton/FormBackButton";
import DropDownListV2 from "../../components/DropDownList/DropDownListV2";
import TitleComponent from "../../components/TitleComponent/TitleComponent";

//redux imports
import {connect} from "react-redux";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";



//assets imports
import * as colors from "../../assets/colors"
import {toggleIndicatorVisibility} from "../../store/actions";

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
            ?this.props.data.nbTherapeuticBoxes==="One therapeutic box (AM to PM)"
                ?1:2
            :1,
        darkVisible: false,
        paddingHeight:0
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
                        teDay: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsDay', null)).isEarlierThan('17:00', thisTimeShouldBe + "earlier than 17:00").required(requiredMessage),
                        tsEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('teDay', null)).required(requiredMessage),
                        teEvening: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        lunch: NewYupString().containsOnlyNumbers().isEarlierThan(Yup.ref('bed', null)).required(requiredMessage),//Yup.number().positive().lessThan(Yup.ref('tsTest', null)).moreThan(10).required(requiredMessage),
                        bed: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('lunch', null)).required(requiredMessage),//Yup.number().positive().lessThan(24.00001,"Cannot exceed 24").moreThan(18.99999,"Cannot be less than 19").required(requiredMessage)
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
                        lunch: NewYupString().containsOnlyNumbers().isEarlierThan(Yup.ref('bed', null)).required(requiredMessage),//Yup.number().positive().lessThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        bed: NewYupString().containsOnlyNumbers().isLaterThan(Yup.ref('lunch', null)).required(requiredMessage),//Yup.number().positive().lessThan((24.00001)).moreThan(Yup.ref('teEvening', null)).required(requiredMessage)
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

    /**
        takes HH:MM value
        returns float

     **/
    handleUnFormatTime = (value) => {
        return parseFloat(convertTimeToDecimal(""+value))
    };

    /**
     *
     * @param initialValue, is this value bigger
     * @param valueToCompare, than this value
     * @param initialName, needed to set it setValueFunction
     * @param comparedName, needed to set it setValueFunction
     * @param setValueFunction, refers to the setFieldValue function, but it is passed here in order to use it
     * @param sameSliderFlag, refers to it whether or not where comparing two items of the same slider
     */
    handleSliderTimeChanges(initialValue, valueToCompare, initialName, comparedName, setValueFunction, sameSliderFlag){
        if(this.handleUnFormatTime(initialValue) > this.handleUnFormatTime(valueToCompare)) {
            setValueFunction(comparedName, this.handleFormatTime((initialValue+(sameSliderFlag?0.5:0))).toString());
        }
        if(!sameSliderFlag) {
            setValueFunction(initialName, this.handleFormatTime(initialValue).toString());
        }
    }

    handleSetDarkVisibility = (flag) => {
        this.setState(oldState =>{
            return({
                ...oldState,
                darkVisible: flag
            })
        })
    };

    render() {
        return(
            <View>
                <KeyboardAwareScrollView>
                    <View>
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
                                        tsDay: this.handleFormatTime(this.props.data.tsDay),
                                        teDay:this.handleFormatTime(this.props.data.teDay),
                                        tsPM:this.handleFormatTime(this.props.data.tsPM),
                                        tePM:this.handleFormatTime(this.props.data.tePM),
                                        tsEvening:this.handleFormatTime(this.props.data.tsEvening),
                                        teEvening:this.handleFormatTime(this.props.data.teEvening),
                                        lunch:this.handleFormatTime(this.props.data.lunch),
                                        bed:this.handleFormatTime(this.props.data.bed),
                                    }
                                    :{
                                        nbTherapeuticBoxes:"One therapeutic box (AM to PM)",
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
                                                    let onlyOneBox= value==="One therapeutic box (AM to PM)";
                                                    if(!onlyOneBox) { //if two boxes
                                                        console.log("normal value: "+ values.teDay+"and the parsedFloat version: "+parseFloat(values.teDay));
                                                        if(parseFloat(values.teDay) > 12) {
                                                            setFieldValue('teDay', '12:00');
                                                        }
                                                        //I don't know why, but this generates a red error
                                                        this.handleSliderTimeChanges(
                                                            this.handleUnFormatTime(values.tePM),
                                                            this.handleUnFormatTime(values.tsEvening),
                                                            'tePM',
                                                            'tsEvening',
                                                            setFieldValue,
                                                            false
                                                        );
                                                        this.handleSliderTimeChanges(
                                                            this.handleUnFormatTime(values.tePM),
                                                            this.handleUnFormatTime(values.teEvening),
                                                            'tsEvening',
                                                            'teEvening',
                                                            setFieldValue,
                                                            true
                                                        );

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
                                                itemList={["One therapeutic box (AM to PM)","Two therapeutic boxes (AM and PM)"]}
                                                Picker={this.props.Picker}
                                                setDarkVisibility = {this.handleSetDarkVisibility}
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
                                                        (sliderValues) => {
                                                            // true ==> Evening, false ==> PM
                                                            let PMorEvening = this.state.nbOfBoxes ===1;
                                                            setFieldValue('tsDay', this.handleFormatTime(sliderValues[0].toString()));
                                                            this.handleSliderTimeChanges(sliderValues[1],values.tsPM, 'teDay', (this.state.nbOfBoxes ===1? 'tsEvening' :'tsPM'), setFieldValue,false);
                                                            //special case for this item
                                                            //also needs to verify if same slider items have been modified
                                                            this.handleSliderTimeChanges(
                                                                sliderValues[1],
                                                                (PMorEvening? values.teEvening:values.tePM),
                                                                (PMorEvening? 'tsEvening' :'tsPM'),
                                                                (PMorEvening? 'teEvening' :'tePM'),
                                                                setFieldValue,
                                                                true
                                                            )
                                                            ;

                                                            //setFieldValue('teDay', this.handleFormatTime(sliderValues[1].toString()));
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
                                                        <Input
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
                                                        max={20}
                                                        step={0.5}
                                                        values={[this.handleUnFormatTime(values.tsPM),this.handleUnFormatTime(values.tePM)]}
                                                        onValuesChange={
                                                            (sliderValues) => {
                                                                setFieldValue('tsPM', this.handleFormatTime(sliderValues[0].toString()));
                                                                console.log("evaluating if tePM value is bigger than tsEvening, result: "+ (sliderValues[1] > this.handleUnFormatTime(values.tsEvening)));
                                                                console.log("tsEvening value: "+ values.tsEvening);
                                                                console.log("sliderValues[1] value: "+ sliderValues[1]);
                                                                this.handleSliderTimeChanges(sliderValues[1],values.tsEvening, 'tePM', 'tsEvening', setFieldValue, false);
                                                                //technically speaking, if first one must change, in order to change the second part.
                                                                //thus comparing with sliderValues[1] again should work
                                                                this.handleSliderTimeChanges(sliderValues[1],values.teEvening, 'tsEvening', 'teEvening', setFieldValue, true);
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
                                                        label = "Start Time"
                                                        value={values.tsEvening}
                                                        onChange={(name,value) => {
                                                            setFieldValue(name,value)
                                                        }}
                                                        onBlur={() =>{

                                                            setFieldValue("tsEvening", this.handleFormatTime(values.tsEvening));
                                                        }}
                                                        onTouch={setFieldTouched}
                                                        name="tsEvening"
                                                        error={touched.tsEvening && errors.tsEvening}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                <View style={styles.inputContainerForTwo}>
                                                    <Input
                                                        label="End Time"
                                                        value={values.teEvening}
                                                        onChange={(name,value) => {
                                                            setFieldValue(name,value)
                                                        }}
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
                                                            console.log("this is valuesS: "+ valuesS);
                                                            console.log("handleFormaTime 1 : "+this.handleFormatTime(valuesS[0].toString()));
                                                            console.log("handleFormaTime 2 : "+this.handleFormatTime(valuesS[1].toString()));
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
                                        <View style={[styles.buttonContainer]}>
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
                    </View>
                </KeyboardAwareScrollView>
                <View style={{ height:this.state.paddingHeight }} />
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
        onChangePosition: (position) => dispatch(changePosition(position)),
        onToggleIndicator: () => dispatch(toggleIndicatorVisibility())
    };
};

export default connect(null,mapDispatchToProps)(FormScreenTimeZonage);

// if(sliderValues[1] > this.handleUnFormatTime(values.tsEvening)) {
//     setFieldValue('tsEvening', this.handleFormatTime(sliderValues[1].toString()));
//     setFieldValue('tePM', this.handleFormatTime(sliderValues[1].toString()));
// }
// else{
//     setFieldValue('tePM', this.handleFormatTime(sliderValues[1].toString()));
// }


/*
    state = {
        height: 0,
    };

    componentDidMount() {
        this.handler = Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardWillChangeFrame);
    }

    componentWillUnmount() {
        this.handler.remove();
    }

    onKeyboardWillChangeFrame = e => {
        const { startCoordinates, endCoordinates } = e;
        const height = startCoordinates.screenY - endCoordinates.screenY;
        LayoutAnimation.configureNext();
        this.setState({ height });
    }

    render() {
        const { height } = this.state;
        return (
            <ScrollView>
                {this.props.children}
                <View style={{ height }} />
            </ScrollView>
        );
    }
}
 */