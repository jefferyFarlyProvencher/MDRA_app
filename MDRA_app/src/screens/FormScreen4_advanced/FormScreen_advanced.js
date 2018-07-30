//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView ,Alert, Dimensions, Text} from 'react-native';
import {connect} from 'react-redux';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions";

class FormScreenAdvanced extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        formData: null,
        currentPosition: 3,
    };

    _handleSubmit =(async (values, bag) => {
        try {
            console.log("sending data!\n");
            this.props.onAddData(values,this.state.currentPosition);
            this.props.onChangePosition(4)

        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render() {
        const labels = ["Initial","Time Zonage","Weights"];
        const customStyles = {
            stepIndicatorSize: 19,
            currentStepIndicatorSize:25,
            separatorStrokeWidth: 2,
            currentStepStrokeWidth: 3,
            stepStrokeCurrentColor: '#fe7013',
            stepStrokeWidth: 3,
            stepStrokeFinishedColor: '#fe7013',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#fe7013',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#fe7013',
            stepIndicatorUnFinishedColor: '#ffffff',
            stepIndicatorCurrentColor: '#ffffff',
            stepIndicatorLabelFontSize: 13,
            currentStepIndicatorLabelFontSize: 13,
            stepIndicatorLabelCurrentColor: '#fe7013',
            stepIndicatorLabelFinishedColor: '#ffffff',
            stepIndicatorLabelUnFinishedColor: '#aaaaaa',
            labelColor: '#999999',
            labelSize: 13,
            currentStepLabelColor: '#fe7013'
        };
        return(
            <View style={styles.container}>
                <Text>Advanced Parameters</Text>
                <Formik
                    initialValues={{
                        numberOfSimulations: '1000',
                        tsTimeHalfDayAM: '8' ,
                        teTimeHalfDayAM: '12',
                        tsTimeHalfDayPM: '12',
                        teTimeHalfDayPM: '16',
                        cMinTheraputicHalfDayAM: '6',
                        cMaxTheraputicHalfDayAM: '20',
                        cMinTheraputicDayPM: '6',
                        cMaxTheraputicDayPM: '20',
                        cMinTheraputicEvening: '0',
                        cMaxTheraputicEvening: '6',
                        threshold: '80',
                        }}
                    onSubmit={this._handleSubmit}
                    validationSchema={Yup.object().shape({
                        numberOfSimulations: Yup.number().positive().lessThan(10001).integer("Must be an integer"),
                        tsTimeHalfDayAM: Yup.number().positive().lessThan(Yup.ref('teTimeHalfDayAM', null)).required(),
                        teTimeHalfDayAM: Yup.number().positive().moreThan(Yup.ref('tsTimeHalfDayAM', null)).required(),
                        tsTimeHalfDayPM: Yup.number().positive().lessThan(Yup.ref('teTimeHalfDayPM', null)).required(),
                        teTimeHalfDayPM: Yup.number().positive().moreThan(Yup.ref('tsTimeHalfDayPM', null)).required(),
                        cMinTheraputicHalfDayAM: Yup.number().positive().lessThan(Yup.ref('cMaxTheraputicHalfDayAM', null)).required(),
                        cMaxTheraputicHalfDayAM: Yup.number().positive().moreThan(Yup.ref('cMinTheraputicHalfDayAM', null)).required(),
                        cMinTheraputicDayPM: Yup.number().positive().lessThan(Yup.ref('cMaxTheraputicDayPM', null)).required(),
                        cMaxTheraputicDayPM: Yup.number().positive().moreThan(Yup.ref('cMinTheraputicDayPM', null)).required(),
                        cMinTheraputicEvening: Yup.number().positive().lessThan(Yup.ref('cMaxTheraputicEvening'), null).required(),
                        cMaxTheraputicEvening: Yup.number().positive().moreThan(Yup.ref('cMinTheraputicEvening',null)).required(),
                        threshold: Yup.number().positive().lessThan(100).required()
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
                            <Input
                                label="Number of Simulations"
                                autoCapitalize="none"
                                value={values.numberOfSimulations}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="numberOfSimulations"
                                error={errors.numberOfSimulations}
                                keyboardType="numeric"
                            />
                            <View>
                                <Text> Half Day (AM)</Text>
                                <View>
                                    <Input
                                        label="Ts"
                                        value={values.tsTimeHalfDayAM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="tsTimeHalfDayAM"
                                        error={errors.tsTimeHalfDayAM}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Te"
                                        value={values.teTimeHalfDayAM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="teTimeHalfDayAM"
                                        error={errors.teTimeHalfDayAM}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text> Half Day (PM) </Text>
                                <View>
                                    <Input
                                        label="Ts"
                                        value={values.tsTimeHalfDayPM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="tsEvening"
                                        error={errors.tsTimeHalfDayPM}
                                        keyboardType="numeric"
                                    />
                                    <Input
                                    label="Te"
                                    value={values.teTimeHalfDayPM}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    name="teEvening"
                                    error={errors.teTimeHalfDayPM}
                                    keyboardType="numeric"
                                    />
                                </View>
                                <Text> Half Day (AM) </Text>
                                <View>
                                    <Input
                                        label="Cmin"
                                        value={values.cMinTheraputicHalfDayAM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMinTheraputicHalfDayAM"
                                        error={errors.cMinTheraputicHalfDayAM}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Cmax"
                                        value={values.cMaxTheraputicHalfDayAM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMaxTheraputicHalfDayAM"
                                        error={errors.cMaxTheraputicHalfDayAM}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text> Half Day (PM) or Day </Text>
                                <View>
                                    <Input
                                        label="Cmin"
                                        value={values.cMinTheraputicDayPM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMinTheraputicDayPM"
                                        error={errors.cMinTheraputicDayPM}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Cmax"
                                        value={values.cMaxTheraputicDayPM}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMaxTheraputicDayPM"
                                        error={errors.cMaxTheraputicDayPM}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text> Evening</Text>
                                <View>
                                    <Input
                                        label="Cmin"
                                        value={values.cMinTheraputicEvening}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMinTheraputicEvening"
                                        error={errors.cMinTheraputicEvening}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Cmax"
                                        value={values.cMaxTheraputicEvening}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="cMaxTheraputicEvening"
                                        error={errors.cMaxTheraputicEvening}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text> Threshold </Text>
                                <Input
                                    value={values.threshold}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    name="threshold"
                                    error={errors.threshold}
                                    keyboardType="numeric"
                                />
                                <Button
                                    buttonStyle={styles.button}
                                    title="Send Form"
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                />
                            </View>
                        </View>
                    )}
                />
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
    inputContainer:{
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

export default connect(null,mapDispatchToProps)(FormScreenAdvanced);