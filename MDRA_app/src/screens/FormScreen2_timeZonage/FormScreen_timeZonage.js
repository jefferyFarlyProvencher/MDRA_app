//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView, Alert, Dimensions, Text} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";
import {connect} from "react-redux";

import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";


class FormScreenTimeZonage extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        currentPosition: 1,
    };

    _handleSubmit =(async (values, bag) => {
        try {
            bag.setSubmitting(false);
            this.props.onAddData(values, this.state.currentPosition);
            this.props.onChangePosition(this.state.currentPosition+1);
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render() {
        return(
            <View style={styles.container}>
                <Text>Page 2</Text>
                <Formik
                    initialValues={{
                        nbTheraputicBoxes:"Two day therapeutic boxes (AM and PM)",
                        tsDay: '8',
                        teDay:'10',
                        tsEvening:'13',
                        teEvening:'15',
                        lunch:'12',
                        bed:'20'}}
                    onSubmit={this._handleSubmit}
                    validationSchema={Yup.object().shape({
                        tsDay: Yup.number().positive().lessThan(Yup.ref('teDay', null)).required(),
                        teDay: Yup.number().positive().moreThan(Yup.ref('tsDay', null)).required(),
                        tsEvening: Yup.number().positive().moreThan(Yup.ref('teDay'), null).required(),
                        teEvening: Yup.number().positive().lessThan(Yup.ref('bed',null)).moreThan(Yup.ref('tsEvening', null)).required(),
                        lunch: Yup.number().positive().lessThan(Yup.ref('tsEvening',null)).moreThan(Yup.ref('teDay',null)).required(),
                        bed: Yup.number().positive().lessThan(24).moreThan(Yup.ref('teEvening',null)).required()
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
                            <View>
                                <DropDownList onChange={setFieldValue} name="nbTheraputicBoxes" value={values.nbTheraputicBoxes} itemList={["Two day therapeutic boxes (AM and PM)","Others...."]}/>
                            </View>
                            <Text> Day Time </Text>
                            <Input
                                label="Ts"
                                value={values.tsDay}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="tsDay"
                                error={touched.tsDay && errors.tsDay}
                                keyboardType="numeric"
                            />

                            <Input
                                label="Te"
                                value={values.teDay}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="teDay"
                                error={touched.teDay && errors.teDay}
                                keyboardType="numeric"
                            />
                            <Text> Evening Time </Text>
                            <Input
                                label="Ts"
                                value={values.tsEvening}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="tsEvening"
                                error={touched.tsEvening && errors.tsEvening}
                                keyboardType="numeric"
                            />

                            <Input
                                label="Te"
                                value={values.teEvening}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="teEvening"
                                error={touched.teEvening && errors.teEvening}
                                keyboardType="numeric"
                            />

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

export default connect(null,mapDispatchToProps)(FormScreenTimeZonage);