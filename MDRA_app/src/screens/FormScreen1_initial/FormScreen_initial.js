//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View, Alert, Dimensions, ScrollView, Text} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {connect}  from "react-redux";

//component imports
import Input from "../../components/Input/Input";
import DropDownList from "../../components/dropDownList/DropDownList";

//actions imports
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions/changePosition";


class FormScreenInitial extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        //current position is the current step of the form
        currentPosition: 0,
        //formulation values are there to set the dosage
        formulaValues: ["Ritalin IR","Ritalin IR","Ritalin IR","Ritalin IR"]
    };

    _handleSubmit =(async (values, bag) => {
        try {
            bag.setSubmitting(false);
            this.props.onChangePosition(this.state.currentPosition+1);
            this.props.onAddData(values, this.state.currentPosition);
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

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

    setDoses = (index)=>{
        switch (this.state.formulaValues[index]) {
            case "Ritalin IR":
                return ["data1","1"];
            case "Pms-Methylphenidate IR":
                return ["data2","2"];
            case "Pms-Methylphenidate ER":
                return ["data4","4"];
            case "Concerta":
                return ["data3","3"];
            case "Biphentin":
                return ["data4","5"];
            default:
        }
    };
    render() {
        return(
            <View style={styles.container}>
                    <Text>Page 1</Text>
                    <Formik
                        initialValues={
                            (this.props.data)
                                ?{
                                    numberOfSimulations: this.props.data.numberOfSimulations,
                                    gender: this.props.data.gender,
                                    weight: this.props.data.weight,
                                    dose1: this.props.data.dose1,
                                    adminTime1: this.props.data.adminTime1,
                                    formulation1: this.props.data.formulation1,
                                    food1: this.props.data.food1,
                                }
                                :{
                                    numberOfSimulations: '1000',
                                    gender: 'Male',
                                    weight: '',
                                    dose1: '',
                                    adminTime1: '',
                                    formula1: 'Ritalin IR',
                                    food1: '',
                                }
                        }
                        onSubmit={this._handleSubmit}
                        validationSchema={Yup.object().shape({
                            numberOfSimulations: Yup.number().positive().lessThan(10001).integer("Must be an integer"),
                            weight: Yup.number().positive().lessThan(80).integer("Must be an integer"),
                            adminTime: Yup.number().positive().lessThan(24).integer("Must be an integer"),
                        })}
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
                                <View style={styles.twoPerRowContainer}>
                                    <DropDownList
                                        style={styles.inputContainer}
                                        value={values.gender}
                                        label={"Gender"}
                                        name="gender"
                                        onChange={setFieldValue}
                                        itemList={["Male","Female"]}/>
                                    <View style={[styles.inputContainer, {width:"55%"}]}>
                                        <Input
                                            label={"Weight (kg)"}
                                            value={values.weight}
                                            onChange={setFieldValue}
                                            onTouch={setFieldTouched}
                                            name="weight"
                                            error={touched.weight && errors.weight}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={{borderColor:"#555", borderWidth: 0.5, width: "95%", marginLeft: 10}}>
                                    <View style={styles.twoPerRowContainer}>
                                        <DropDownList
                                            style={[styles.inputContainer, {width:"55%"}]}
                                            label={ "Drug Formulation" }
                                            value={values.formula1}
                                            name="formula1" onChange={(name, value) =>{this.setCurrentFormulation(1,value);  setFieldValue(name, value)}}
                                            itemList={["Ritalin IR","Pms-Methylphenidate IR", "Concerta", "Pms-Methylphenidate ER", "Biphentin"]}/>
                                        <DropDownList
                                            style={[styles.inputContainer, {width:"35%"}]}
                                            label={"Food Intake"}
                                            value={values.food1}
                                            name="food1" onChange={setFieldValue}
                                            itemList={["No","Yes"]}/>
                                    </View>
                                    <View style={styles.twoPerRowContainer}>
                                        <DropDownList
                                            style={styles.inputContainer}
                                            value={values.dose1}
                                            label={"Dosage"}
                                            name="dose1"
                                            onChange={setFieldValue}
                                            itemList={this.setDoses(1)}/>
                                        <View style={[styles.inputContainer, {width:"55%"}]}>
                                            <Input
                                                label="Administration Time"
                                                value={values.adminTime1}
                                                onChange={setFieldValue}
                                                onTouch={setFieldTouched}
                                                name="adminTime1"
                                                error={touched.adminTime1 && errors.adminTime1}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
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
        width: '45%',
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
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (pos) => dispatch(changePosition(pos))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenInitial);