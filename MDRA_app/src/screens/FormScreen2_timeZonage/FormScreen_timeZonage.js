//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView, Alert, Dimensions, Text, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";
import CustomMultiSlider from "../../components/CustomMultiSlider/CustomMultiSlider";

//redux imports
import {connect} from "react-redux";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";

//Look, we all know time zonage is a weird name, but I didn't know what the
//page was going to look like so leave it as it is, CUZ IT'S FUNNY!
class FormScreenTimeZonage extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        currentPosition: 1,
        nbOfBoxes: this.props.data
            ?this.props.data.nbTheraputicBoxes==="One therapeutic box (from AM to PM)"
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
            bag.setSubmitting(false);
            this.props.onChangePosition(this.state.currentPosition+1);
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
        switch (this.state.nbOfBoxes) {
            case 1:
                return (
                    Yup.object().shape({
                        tsDay: Yup.number().positive().lessThan(Yup.ref('teDay', null)).required(requiredMessage),
                        teDay: Yup.number().positive().moreThan(Yup.ref('tsDay', null)).required(requiredMessage),
                        tsEvening: Yup.number().positive().moreThan(Yup.ref('teDay'), null).required(requiredMessage),
                        teEvening: Yup.number().positive().lessThan((Yup.ref('bed', null))).moreThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        lunch: Yup.number().positive().lessThan(Yup.ref('tsEvening', null)).moreThan(10).required(requiredMessage),
                        bed: Yup.number().positive().lessThan(24.00001).moreThan(19).required(requiredMessage)
                    })
                );
            case 2:
                return (
                    Yup.object().shape({
                        tsDay: Yup.number().positive().lessThan(Yup.ref('teDay', null)).required(requiredMessage),
                        teDay: Yup.number().positive().moreThan(Yup.ref('tsDay', null)).required(requiredMessage),
                        tsPM: Yup.number().positive().moreThan(11.999999).required(requiredMessage),
                        tePM: Yup.number().positive().moreThan(Yup.ref('tsPM', null)).required(requiredMessage),
                        tsEvening: Yup.number().positive().moreThan(Yup.ref('teDay'), null).required(requiredMessage),
                        teEvening: Yup.number().positive().lessThan(Yup.ref('bed', null)).moreThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        lunch: Yup.number().positive().lessThan(Yup.ref('tsEvening', null)).required(requiredMessage),
                        bed: Yup.number().positive().lessThan((24.00001)).moreThan(Yup.ref('teEvening', null)).required(requiredMessage)
                    })
                );
        }
    };
    render() {
        return(
            <View style={styles.container}>
                <KeyboardAvoidingView>
                <ScrollView>
                <Text>Page 2 AKA: THERAPEUTIC BOXES</Text>
                <Formik
                    initialValues={(this.props.data)
                        ?{
                            nbTheraputicBoxes:this.props.data.nbTheraputicBoxes,
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
                            nbTheraputicBoxes:"One therapeutic box (from AM to PM)",
                            tsDay: '8',
                            teDay:'10',
                            tsPM:'13',
                            tePM:'15',
                            tsEvening:'17',
                            teEvening:'19',
                            lunch:'12',
                            bed:'24',
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
                                 isSubmitting
                             }) => (
                        <View>
                            <View>
                                <DropDownList
                                    onChange={(name,value) => {
                                        let onlyOneBox= value==="One therapeutic box (from AM to PM)";
                                        if(!onlyOneBox) { //if two boxes
                                            if(parseFloat(values.teDay) > 12) {
                                                setFieldValue('teDay', '12');
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
                                    name="nbTheraputicBoxes"
                                    value={values.nbTheraputicBoxes}
                                    itemList={["One therapeutic box (from AM to PM)","Two therapeutic boxes (AM and PM)"]}/>
                            </View>
                            <View>
                                <Text>{(this.state.nbOfBoxes===1)?"Day Time": "AM time" }</Text>
                                <View>
                                    <Input
                                        label="Ts"
                                        value={values.tsDay}
                                        onChange={(name,value) => {
                                            setFieldValue(name,value)
                                        }}
                                        onTouch={setFieldTouched}
                                        name="tsDay"
                                        error={touched.tsDay && errors.tsDay}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Te"
                                        value={values.teDay}
                                        onChange={(name,value) => {
                                            setFieldValue(name,value)
                                        }}
                                        onTouch={setFieldTouched}
                                        name="teDay"
                                        error={touched.teDay && errors.teDay}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View
                                    style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                >
                                    <CustomMultiSlider
                                        sliderLength={300}
                                        min={0}
                                        max={this.state.nbOfBoxes === 1?16: 12}
                                        step={0.5}
                                        values={[parseInt(values.tsDay),(values.teDay>12&&this.state.nbOfBoxes===2)?12:parseInt(values.teDay)]}
                                        onValuesChange={
                                            (values) => {
                                                setFieldValue('tsDay', values[0].toString());
                                                setFieldValue('teDay', values[1].toString());
                                            }
                                        }
                                    />
                                </View>
                            </View>
                            {(this.state.nbOfBoxes === 2)
                                ?
                                <View>
                                    <Text> PM time </Text>
                                    <View>
                                        < Input
                                        label = "Ts"
                                        value={values.tsPM}
                                        onChange={(name,value) => {
                                            this.setState((oldState) => {
                                                let newArray = (oldState.pmTimeArray).slice();
                                                newArray[0] = value;
                                                return (
                                                    {
                                                        ...oldState,
                                                        pmTimeArray: newArray
                                                    }
                                                )
                                            });
                                            setFieldValue(name,value)
                                        }}
                                        onTouch={setFieldTouched}
                                        name="tsDay"
                                        error={touched.tsPM && errors.tsPM}
                                        keyboardType="numeric"
                                        />

                                        <Input
                                        label="Te"
                                        value={values.tePM}
                                        onChange={(name,value) => {
                                            setFieldValue(name,value)
                                        }}
                                        onTouch={setFieldTouched}
                                        name="teDay"
                                        error={touched.tePM && errors.tePM}
                                        keyboardType="numeric"
                                        />
                                    </View>
                                    <View
                                        style={{
                                            margin:20,
                                            flexDirection:'row',
                                            justifyContent:'space-around'
                                        }}
                                    >
                                        <CustomMultiSlider
                                            sliderLength={300}
                                            min={12}
                                            max={16}
                                            step={0.5}
                                            values={[parseInt(values.tsPM),parseInt(values.tePM)]}
                                            onValuesChange={
                                                (values) => {
                                                    setFieldValue('tsPM', values[0].toString());
                                                    setFieldValue('tePM', values[1].toString());
                                                }
                                            }
                                        />
                                </View>
                                </View>
                                :<View/>
                            }
                            <View>
                                <Text> Evening Time </Text>
                                <View style={styles.twoPerRowContainer}>
                                    <View style={styles.inputContainerForTwo}>
                                        <Input
                                            label="Ts"
                                            value={values.tsEvening}
                                            onChange={setFieldValue}
                                            onTouch={setFieldTouched}
                                            name="tsEvening"
                                            error={touched.tsEvening && errors.tsEvening}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={styles.inputContainerForTwo}>
                                        <Input
                                            label="Te"
                                            value={values.teEvening}
                                            onChange={setFieldValue}
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
                                        sliderLength={300}
                                        min={16}
                                        max={24}
                                        step={0.5}
                                        snapped={true}
                                        values={[parseInt(values.tsEvening),parseInt(values.teEvening)]}
                                        onValuesChange={
                                            (valuesS) => {
                                                setFieldValue('tsEvening', valuesS[0].toString());
                                                setFieldValue('teEvening', valuesS[1].toString());
                                            }
                                        }
                                    />
                                </View>
                            </View>
                            <Input
                                label="Lunch Time (o'clock)"
                                value={values.lunch}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="lunch"
                                error={touched.lunch && errors.lunch}
                                keyboardType="numeric"
                            />

                            <Input
                                label="Bed Time (o'clock)"
                                value={values.bed}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="bed"
                                error={touched.bed && errors.bed}
                                keyboardType="numeric"
                            />
                            <Button
                                buttonStyle={styles.button}
                                title="Go to weights"
                                onPress={handleSubmit}
                                loading={isSubmitting}
                            />
                        </View>
                    )}
                />
                </ScrollView>
                </KeyboardAvoidingView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",

    },
    button: {
        marginTop: 20,
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
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
    }

});
const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data,position) => dispatch(addData(data,position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenTimeZonage);