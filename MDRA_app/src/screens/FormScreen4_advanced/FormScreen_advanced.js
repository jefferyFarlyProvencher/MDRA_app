//system imports
import React, {PureComponent} from 'react';
import {StyleSheet, View,ScrollView ,Alert, Dimensions, Text} from 'react-native';
import {connect} from 'react-redux';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

//component imports
import Input from "../../components/Input/Input";
import DropDownListV2 from "../../components/dropDownList/DropDownListV2";
import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import LinedLabel from "../../components/LinedLabel/LinedLabel";

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
        return(
            <View style={styles.container}>
                <ScrollView>
                        <View>
                            <TitleComponent text={"Advanced Parameters"}/>
                        </View>
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
                                    <LinedLabel
                                        label={"Number of Simulations"}
                                    />
                                    <View style={styles.inputContainer}>
                                        <Input
                                            autoCapitalize="none"
                                            value={values.numberOfSimulations}
                                            onChange={setFieldValue}
                                            onTouch={setFieldTouched}
                                            name="numberOfSimulations"
                                            error={errors.numberOfSimulations}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View>
                                        <LinedLabel
                                            label={"Half Day (AM)"}
                                        />
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
                                        <LinedLabel
                                            label={"Half Day (PM) or Day"}
                                        />
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
                                        <LinedLabel
                                            label={"Evening"}
                                        />
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
                                        <LinedLabel
                                            label={"Threshold"}
                                        />
                                        <View style={styles.inputContainer}>
                                            <Input
                                                value={values.threshold}
                                                onChange={setFieldValue}
                                                onTouch={setFieldTouched}
                                                name="threshold"
                                                error={errors.threshold}
                                                keyboardType="numeric"
                                            />
                                        </View>
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
        width: "100%",
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


});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data,position) => dispatch(addData(data,position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

export default connect(null,mapDispatchToProps)(FormScreenAdvanced);