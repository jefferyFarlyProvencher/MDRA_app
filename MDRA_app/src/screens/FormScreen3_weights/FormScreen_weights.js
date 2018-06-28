//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View, Alert, Dimensions, Text} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";
import {connect} from "react-redux";
import {addData} from "../../store/actions/addData";

class FormScreenWeights extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        currentPosition: 2,
    };

    _handleSubmit =(async (values, bag) => {
        try {
            this.props.onAddData(values,this.state.currentPosition);
            Alert.alert("Moving to step 2!\n"+ values.email);
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
                <Formik
                    initialValues={{ email:'', password: '', confirmPassword:'', gender:'male', animal:'Cat'}}
                    onSubmit={this._handleSubmit}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email().required(),
                        password: Yup.string().min(6).required(),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password', null)], 'Doesn\'t match Password')
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
                                label="Email"
                                autoCapitalize="none"
                                value={values.email}
                                onChange={setFieldValue}
                                onTouch={setFieldTouched}
                                name="email"
                                error={touched.email && errors.email}
                            />
                            <View style={styles.twoPerRowContainer}>
                                <View style={styles.inputContainer}>
                                    <Input
                                        label="Password"
                                        secureTextEntry
                                        value={values.password}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="password"
                                        error={touched.password && errors.password}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Input
                                        label="Confirm Password"
                                        secureTextEntry
                                        value={values.confirmPassword}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="confirmPassword"
                                        error={touched.confirmPassword && errors.confirmPassword}
                                    />
                                </View>
                            </View>
                            <View style={styles.twoPerRowContainer}>
                                <DropDownList style={styles.inputContainer} value={values.gender} name="gender" onChange={setFieldValue} itemList={["Male","Female"]}/>
                                <DropDownList style={styles.inputContainer} value={values.animal} name="animal" onChange={setFieldValue} itemList={["Cat","Dog"]}/>
                            </View>
                            <Button
                                buttonStyle={styles.button}
                                title="Submit"
                                onPress={handleSubmit}
                                disabled={(!isValid || isSubmitting)}
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
        onAddData: (data,position) => dispatch(addData(data,position))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenWeights);