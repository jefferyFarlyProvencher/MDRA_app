//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View, Alert, Dimensions, Text, ScrollView} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import CustomMultiSlider from "../../components/CustomMultiSlider/CustomMultiSlider";
import LinedLabel from "../../components/LinedLabel/LinedLabel";

//redux imports
import {connect} from "react-redux";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions";

class FormScreenWeights extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        currentPosition: 2,
        targetPosition: 4,
        fullForm: false,
        value1: [0]
    };

    _handleSubmit =(async (values, bag) => {
        let target = this.props.advancedAllowed? 3: 4;
        try {
            bag.setSubmitting(false);
            this.props.onAddData(values, this.state.currentPosition);
            this.props.setPage(target);
            this.props.onChangePosition(target);
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render() {
        return(
            <View style={styles.container}>
                <ScrollView>
                <Formik
                    initialValues={(this.props.data)
                        ?{
                            weight1:this.props.data.weight1,
                            weight2:this.props.data.weight2,
                            weight3:this.props.data.weight3,
                            weight4:this.props.data.weight4,
                            weight5:this.props.data.weight5,
                            weight6:this.props.data.weight6,
                            weight7:this.props.data.weight7
                        }
                        : {
                            weight1:'100',
                            weight2: '100',
                            weight3:'100',
                            weight4:'100',
                            weight5:'100',
                            weight6:'100',
                            weight7:'100'
                        }
                    }
                    onSubmit={this._handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            weight1:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight2:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight3:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight4:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight5:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight6:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
                            weight7:
                                Yup.number()
                                    .positive()
                                    .integer()
                                    .lessThan(201, "Cannot exceed 200")
                                    .required(),
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
                                <View>
                                    <LinedLabel
                                        label={"Weight of Box 1"}
                                    />
                                </View>
                                <View
                                    style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                >
                                    <CustomMultiSlider
                                        sliderLength={Dimensions.get('window').width * 0.80}
                                        min={0}
                                        max={100}
                                        step={1}
                                        values={[parseFloat(values.weight1)]}
                                        onValuesChange={
                                            (values) => {
                                                setFieldValue('weight1', values[0].toString());
                                                setFieldValue('weight3', values[0].toString());
                                            }
                                        }
                                    />
                                </View>
                            </View>
                            {(this.props.state.main.Page1Data)
                                ? (this.props.state.main.Page1Data.nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)")?
                                    <View>
                                        <View>
                                            <LinedLabel
                                                label={"Weight of Box 2"}
                                            />
                                        </View>
                                        <View
                                            style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                        >

                                            <CustomMultiSlider
                                                sliderLength={Dimensions.get('window').width * 0.80}
                                                min={0}
                                                max={100}
                                                step={1}
                                                values={[parseFloat(values.weight6)]}
                                                onValuesChange={
                                                    (someValues) => {
                                                        setFieldValue('weight6', someValues[0].toString());
                                                        setFieldValue('weight7', someValues[0].toString());
                                                    }
                                                }
                                            />
                                        </View>
                                    </View>
                                    :<View/>
                                :<View/> //if state is null
                            }
                            <View>
                                <View>
                                    <LinedLabel
                                        label={"Weight of Evening Box "}
                                    />
                                </View>
                                <View
                                    style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                >

                                    <CustomMultiSlider
                                        sliderLength={Dimensions.get('window').width * 0.80}
                                        min={0}
                                        max={100}
                                        step={1}
                                        values={[parseFloat(values.weight2)]}
                                        onValuesChange={
                                            (someValues) => {
                                                setFieldValue('weight2', someValues[0].toString());
                                                setFieldValue('weight4', someValues[0].toString());
                                            }
                                        }
                                    />
                                </View>
                            </View>
                            <View>
                                <View>
                                    <LinedLabel
                                        label={"Weight of threshold "}
                                    />
                                </View>
                                <View
                                    style={{margin:20, flexDirection:'row', justifyContent:'space-around'}}
                                >
                                        <CustomMultiSlider
                                            sliderLength={Dimensions.get('window').width * 0.80}
                                            min={0}
                                            max={100}
                                            step={1}
                                            values={[parseFloat(values.weight5)]}
                                            onValuesChange={
                                                (values) => {
                                                    setFieldValue('weight5', values[0].toString());
                                                }
                                            }
                                        />
                                </View>
                            </View>
                            {this.state.fullForm
                                ?<View>
                                    <Input
                                        label="Percentage of time TB 2"
                                        autoCapitalize="none"
                                        value={values.weight1}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight1"
                                        error={touched.weight1 && errors.weight1}
                                        keyboardType="numeric"
                                    />
                                    <Input
                                        label="Percentage of responders in TB 2"
                                        autoCapitalize="none"
                                        value={values.weight2}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight2"
                                        error={touched.weight2 && errors.weight2}
                                        keyboardType="numeric"
                                    />
                                    <Input
                                        label="Percentage of time in the TB1"
                                        autoCapitalize="none"
                                        value={values.weight6}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight3"
                                        error={touched.weight6 && errors.weight6}
                                    />
                                    <Input
                                        label="Percentage of responders in the TB1"
                                        autoCapitalize="none"
                                        value={values.weight7}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight4"
                                        error={touched.weight7 && errors.weight7}
                                        keyboardType="numeric"
                                    />

                                    <Input
                                        label="Percentage of time in evening TB"
                                        autoCapitalize="none"
                                        value={values.weight3}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight3"
                                        error={touched.weight3 && errors.weight3}
                                        keyboardType="numeric"
                                    />
                                    <Input
                                        label="Percentage of responders in the evening TB"
                                        autoCapitalize="none"
                                        value={values.weight4}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight4"
                                        error={touched.weight4 && errors.weight4}
                                        keyboardType="numeric"
                                    />
                                    <Input
                                        label="Roller Coaster Effect"
                                        autoCapitalize="none"
                                        value={values.weight5}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="weight5"
                                        error={touched.weight5 && errors.weight5}
                                        keyboardType="numeric"
                                    />
                                </View>
                                :<View/>
                            }
                            {this.props.advancedAllowed
                                ?
                                <Button
                                    buttonStyle={styles.button}
                                    title="Go to the Advanced Parameters section"
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                />
                                : <Button
                                    buttonStyle={styles.button}
                                    title={"Calculate dosages!"}
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                />
                            }
                        </View>
                    )}
                />

                </ScrollView>
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

const mapStateToProps = (state) => {
  return {
      state
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(FormScreenWeights);