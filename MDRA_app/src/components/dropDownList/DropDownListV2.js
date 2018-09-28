
/**
 * Bootstrap of PickerTest
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions, StyleSheet, TouchableWithoutFeedback
} from 'react-native';

import {FormLabel, FormValidationMessage} from "react-native-elements";
import Picker from "react-native-picker";

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
        console.log("here!!!!!!!!");
        Picker.init({
            pickerData: data,
            selectedValue: [this.props.value],
            pickerFontColor: [255, 0 ,0, 1],
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
                console.log('date', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
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
};


const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        alignItems: "center"

    },
    pickerStyle:{
        height: 50,
        width: "100%",
        backgroundColor: "red",
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