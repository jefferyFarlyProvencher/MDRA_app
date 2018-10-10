
/**
 * Bootstrap of PickerTest
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions, StyleSheet,
    Platform
} from 'react-native';

import {FormLabel, FormValidationMessage} from "react-native-elements";

/**
 * DropDownListV2 uses react-native-picker
 * instead of react-native's own picker (because it is broken on IOS)
 *
 * **NOTE**
 * A weird glitch makes it so that everything below this dropDownV2 is erase from existence
 * to be used with a flexDirection: row in the style of the view surrounding it
 */
class DropDownListV2 extends Component {

    state= {
        selectedIndex: 0,
        selectedValue: "",
        Picker: this.props.Picker,
    };


    constructor(props, context) {
        super(props, context);
    }

    _handleChange = (value)=> {
        this.props.onChange(this.props.name, value[0])
    };


    _showPicker = (data, Picker) => {
        Picker.init({
            pickerData: data,
            selectedValue: [this.props.value],
            pickerFontColor: [0, 0 ,0, 1],
            pickerFontSize: 17,
            pickerBg:[255,255,255,1],
            pickerCancelBtnText: "CANCEL",
            pickerConfirmBtnText: "CONFIRM",
            pickerTitleText: "Please select item",
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
                this.setState(oldState => {
                    return {
                        ...oldState,
                        selectedIndex: pickedIndex,
                        selectedValue: pickedValue
                    }
                });
                this._handleChange(pickedValue);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                //do nothing
                //console.log('date', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                //do nothing
                //console.log('date', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    };

    render() {
        const {label, error, ...rest } = this.props;
        return (
            <View style={[styles.root, this.props.style]}>
                <FormLabel>{label}</FormLabel>
                <TouchableOpacity style={[{alignItems: 'center', width: "100%"}, ]} onPress={() => this._showPicker(this.props.itemList, this.props.Picker)}>
                    <View style={styles.pickerStyle}>
                    {<Text>{this.props.value}</Text>}
                    </View>
                </TouchableOpacity>
                {error && <FormValidationMessage>{error}</FormValidationMessage>}

            </View>
        );
    }
}


const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        alignItems: "center"

    },
    pickerStyle:{
        height: 50,
        width: "100%",
        backgroundColor: "#c8e5f9",
        alignItems: "center",
        justifyContent:"center",
        borderRadius: 20
    },
    pickerContainer:{
        borderRadius: 90,
        backgroundColor: '#e7daff',
        alignItems: 'center',
        justifyContent:'center',
    },
    itemStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems:'center'
    }
});

export default DropDownListV2;