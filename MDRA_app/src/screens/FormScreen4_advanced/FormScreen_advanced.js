//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView ,Alert, Dimensions, Text, KeyboardAvoidingView} from 'react-native';
import {connect} from 'react-redux';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import DropDownListV2 from "../../components/dropDownList/DropDownListV2";
import {changePosition, addData} from "../../store/actions";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import LinedLabel from "../../components/LinedLabel/LinedLabel";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import FormBackButton from "../../components/FormBackButton/FormBackButton";

class FormScreenAdvanced extends PureComponent{
    state = {
        ViewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
        formData: null,
        currentPosition: 3,
    };

    _handleGoToPreviousStep = () => {
        this.props.onChangePosition(this.state.currentPosition-1);
        this.props.setPage(this.state.currentPosition-1);
    };

    _handleSubmit =(async (values, bag) => {
        try {
            console.log("sending data!\n and values is: "+ JSON.stringify(values));
            this.props.onAddData(values,this.state.currentPosition);
            bag.setSubmitting(false);
            this.props.onChangePosition(4);

        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render() {
        console.log("Fuck this shit");
        return(
                <KeyboardAwareScrollView>
                    <View style={styles.container}>
                        <View>
                            <TitleComponent text={"Advanced Parameters"}/>
                        </View>
                        <FormBackButton
                            onPress={this._handleGoToPreviousStep}
                        />
                        <Formik
                            initialValues={(this.props.data)
                                ?{
                                    numberOfSimulations: this.props.data.numberOfSimulations,
                                    tsTimeHalfDayAM: this.props.data.tsTimeHalfDayAM ,
                                    teTimeHalfDayAM: this.props.data.teTimeHalfDayAM,
                                    tsTimeHalfDayPM: this.props.data.tsTimeHalfDayPM,
                                    teTimeHalfDayPM: this.props.data.teTimeHalfDayPM,
                                    cMinTherapeuticHalfDayAM: this.props.data.cMinTherapeuticHalfDayAM,
                                    cMaxTherapeuticHalfDayAM: this.props.data.cMaxTherapeuticHalfDayAM,
                                    cMinTherapeuticDayPM: this.props.data.cMinTherapeuticDayPM,
                                    cMaxTherapeuticDayPM: this.props.data.cMaxTherapeuticDayPM,
                                    cMinTherapeuticEvening: this.props.data.cMinTherapeuticEvening,
                                    cMaxTherapeuticEvening: this.props.data.cMaxTherapeuticEvening,
                                    threshold: this.props.data.threshold,
                                }
                                :{
                                    numberOfSimulations: '1000',
                                    tsTimeHalfDayAM: '8' ,
                                    teTimeHalfDayAM: '12',
                                    tsTimeHalfDayPM: '12',
                                    teTimeHalfDayPM: '16',
                                    cMinTherapeuticHalfDayAM: '6',
                                    cMaxTherapeuticHalfDayAM: '20',
                                    cMinTherapeuticDayPM: '6',
                                    cMaxTherapeuticDayPM: '20',
                                    cMinTherapeuticEvening: '0',
                                    cMaxTherapeuticEvening: '6',
                                    threshold: '80',
                                }
                            }
                            onSubmit={this._handleSubmit}
                            validationSchema={Yup.object().shape({
                                numberOfSimulations: Yup.number().positive().lessThan(10001).integer("Must be an integer"),
                                tsTimeHalfDayAM: Yup.number().positive().lessThan(Yup.ref('teTimeHalfDayAM', null)).required(),
                                teTimeHalfDayAM: Yup.number().positive().moreThan(Yup.ref('tsTimeHalfDayAM', null)).required(),
                                tsTimeHalfDayPM: Yup.number().positive().lessThan(Yup.ref('teTimeHalfDayPM', null)).required(),
                                teTimeHalfDayPM: Yup.number().positive().moreThan(Yup.ref('tsTimeHalfDayPM', null)).required(),
                                cMinTherapeuticHalfDayAM: Yup.number().positive().lessThan(Yup.ref('cMaxTherapeuticHalfDayAM', null)).required(),
                                cMaxTherapeuticHalfDayAM: Yup.number().positive().moreThan(Yup.ref('cMinTherapeuticHalfDayAM', null)).required(),
                                cMinTherapeuticDayPM: Yup.number().positive().lessThan(Yup.ref('cMaxTherapeuticDayPM', null)).required(),
                                cMaxTherapeuticDayPM: Yup.number().positive().moreThan(Yup.ref('cMinTherapeuticDayPM', null)).required(),
                                cMinTherapeuticEvening: Yup.number().positive().lessThan(Yup.ref('cMaxTherapeuticEvening'), null).required(),
                                cMaxTherapeuticEvening: Yup.number().positive().moreThan(Yup.ref('cMinTherapeuticEvening',null)).required(),
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
                                    <View>
                                        <View>
                                            <LinedLabel
                                                label={"Number of Simulations"}
                                            />
                                        </View>
                                        <View style={[styles.inputContainer, {width:"100%"}]}>
                                            <Input
                                                autoCapitalize="none"
                                                value={values.numberOfSimulations}
                                                onChange={setFieldValue}
                                                onTouch={setFieldTouched}
                                                name="numberOfSimulations"
                                                error={errors.numberOfSimulations}
                                                keyboardType="numeric"
                                                style={{width:"80%"}}
                                            />
                                        </View>
                                    </View>
                                    {this.props.state.main.Page1Data?
                                        (this.props.state.main.Page1Data.nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)")
                                            ?<View>
                                                <View>
                                                    <LinedLabel
                                                        label={"Half Day (AM)"}
                                                    />
                                                </View>
                                                <View style={styles.twoPerRowContainer}>
                                                    <View style={styles.inputContainer}>
                                                        <Input
                                                            label="Cmin"
                                                            value={values.cMinTherapeuticHalfDayAM}
                                                            onChange={setFieldValue}
                                                            onTouch={setFieldTouched}
                                                            name="cMinTherapeuticHalfDayAM"
                                                            error={errors.cMinTherapeuticHalfDayAM}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                    <View style={styles.inputContainer}>
                                                        <Input
                                                            label="Cmax"
                                                            value={values.cMaxTherapeuticHalfDayAM}
                                                            onChange={setFieldValue}
                                                            onTouch={setFieldTouched}
                                                            name="cMaxTherapeuticHalfDayAM"
                                                            error={errors.cMaxTherapeuticHalfDayAM}
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>
                                             </View>
                                            :<View/>
                                        :<View/>
                                    }
                                    <View>
                                        <View>
                                            <LinedLabel
                                                label={

                                                        this.props.state.main.Page1Data?
                                                        this.props.state.main.Page1Data.nbTherapeuticBoxes === "Two therapeutic boxes (AM and PM)"
                                                        ?"Half Day (PM)": "Day": "Day"
                                                }
                                            />
                                        </View>
                                        <View style={styles.twoPerRowContainer}>
                                            <View style={styles.inputContainer}>
                                                <Input
                                                    label="Cmin"
                                                    value={values.cMinTherapeuticDayPM}
                                                    onChange={setFieldValue}
                                                    onTouch={setFieldTouched}
                                                    name="cMinTherapeuticDayPM"
                                                    error={errors.cMinTherapeuticDayPM}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Input
                                                    label="Cmax"
                                                    value={values.cMaxTherapeuticDayPM}
                                                    onChange={setFieldValue}
                                                    onTouch={setFieldTouched}
                                                    name="cMaxTherapeuticDayPM"
                                                    error={errors.cMaxTherapeuticDayPM}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                         </View>
                                    </View>
                                    <View>
                                        <View>
                                            <LinedLabel
                                                label={"Evening"}
                                            />
                                        </View>
                                        <View style={styles.twoPerRowContainer}>
                                            <View style={styles.inputContainer}>
                                                <Input
                                                    label="Cmin"
                                                    value={values.cMinTherapeuticEvening}
                                                    onChange={setFieldValue}
                                                    onTouch={setFieldTouched}
                                                    name="cMinTherapeuticEvening"
                                                    error={errors.cMinTherapeuticEvening}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Input
                                                    label="Cmax"
                                                    value={values.cMaxTherapeuticEvening}
                                                    onChange={setFieldValue}
                                                    onTouch={setFieldTouched}
                                                    name="cMaxTherapeuticEvening"
                                                    error={errors.cMaxTherapeuticEvening}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <View>
                                            <LinedLabel
                                                label={"Threshold"}
                                            />
                                        </View>
                                        <View style={[styles.inputContainer, {width:"100%"}]}>
                                            <Input
                                                value={values.threshold}
                                                onChange={setFieldValue}
                                                onTouch={setFieldTouched}
                                                name="threshold"
                                                error={errors.threshold}
                                                keyboardType="numeric"
                                                style={{width:"80%"}}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.buttonsContainer}>
                                        <Button
                                            buttonStyle={styles.button}
                                            title="Calculate dosages"
                                            onPress={handleSubmit}
                                            loading={isSubmitting}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    button: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#27408b"
    },

    buttonsContainer: {
        backgroundColor:"#27408b",
        marginTop: 20,
    },

    twoPerRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    inputContainer:{
        width: '50%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        marginVertical: 20
    },


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

export default connect(mapStateToProps,mapDispatchToProps)(FormScreenAdvanced);