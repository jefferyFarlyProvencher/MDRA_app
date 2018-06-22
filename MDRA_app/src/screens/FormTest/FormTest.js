import React, {PureComponent} from 'react';
import {StyleSheet, TextInput, View, Alert} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Input from "../../components/Input/Input"

const api = (user) => new Promise((resolve, reject) =>{
    setTimeout(() => {
        if(user.email=== 'hello@gmail.com') {
            reject({email:"Email already used"})
        }
        else {
            resolve();
        }
    }, 3000)
});

class FormTest extends PureComponent{
    _handleSubmit =(async (values, bag) => {
        try {
            await api(values);
            console.log(values.email);
            console.log(values.password);
            Alert.alert("Welcome!");
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render() {
        return(
            <View style={styles.container}>
                <Formik
                    initialValues={{ email:'', password: '', confirmPassword:''}}
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
                            <Button
                                buttonStyle={styles.button}
                                title="Submit"
                                onPress={handleSubmit}
                                disabled={!isValid || isSubmitting}
                                loading={isSubmitting}
                            />
                        </View>
                    )}
                />
            </View>

        );
    }
}

/*
*                   validateOnChange={}
                    validateOnBlur={}
                    isInitialValid={}
                    onReset={}
                    onSubmit={}
                    validationSchema={}
                    validate={}
                    component={}
                    enableReinitialize={}
*/
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
    },
    inputContainer:{
        width: '50%',
    }

});

export default FormTest;