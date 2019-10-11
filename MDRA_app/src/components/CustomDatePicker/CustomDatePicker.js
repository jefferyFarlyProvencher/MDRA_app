import React, {PureComponent} from 'react';
import {StyleSheet, View, Platform} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';
import * as colors from "../../assets/colors";
import DatePicker from "react-native-datepicker"

class CustomDatePicker extends PureComponent{

    state = {

        allValidationStatuses: {
            valid: {
                value: "Valid",
                color: "green",
            },
            error: {
                value: "Error",
                color: "red",
            },

            huh: {
                value: "huh?",
                color: "orange",
            }

        },

        inputValue: "",

        switchValue: true,
    };

    constructor(props){
        super(props);
    }

    _handleChangeText = (value)=> {

        this.props.onChange(this.props.name, value)
    };


    _handleTouch = () => {
        this.props.onTouch(this.props.name)
    };

    handleLabelPosition = (labelPosition) =>{
        switch (labelPosition) {
            case "left":
                return "flex-start";
                break;
            case "center":
                return "center";
                break;
            case "right":
                return "flex-end";
                break;
        }
    };

    render() {
        console.log("Update of CustomDatePicker");

        const {label, error, backgroundColor, name, ...rest } = this.props;
        let labelPosition = this.props.labelPosition;
        return(
            <View style={[styles.root,this.props.style]}>
                <FormLabel
                    containerStyle={
                        {
                           alignItems: labelPosition?this.handleLabelPosition(labelPosition): "flex-start"
                        }
                    }
                >
                    {label}
                </FormLabel>
                <DatePicker
                    style={this.props.style}
                    date={this.props.date} //initial date from state
                    mode={this.props.mode?this.props.mode:"date"} //The enum of date, datetime and time
                    androidMode={this.props.androidMode?this.props.androidMode:"default"}
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={this.props.customStyles}
                    onDateChange={this.props.onDateChange}
                />
                {error && <FormValidationMessage containerStyle={{alignItems:'center'}}>{error}</FormValidationMessage>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    }
});

export default CustomDatePicker;