
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
import AwesomeIcon from "react-native-vector-icons/FontAwesome";

/**
 * DropDownListV2 uses react-native-picker
 * instead of react-native's own picker (because it is broken on IOS)
 *
 * **NOTE**
 * A weird glitch makes it so that everything below this dropDownV2 is erase from existence
 * to be used with a flexDirection: row in the style of the view surrounding it
 *
 * **IMPORTANT**
 *
 * this toggles a black translucent background, and thus requires a received function (to toggle it)
 *  and for it to be set up
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
            pickerFontSize: Platform.OS === "ios"?17:15,
            pickerBg:[255,255,255,1],
            pickerCancelBtnText: "Cancel",
            pickerConfirmBtnText: "Confirm",
            pickerCancelBtnColor:[65,105,225,1],
            pickerConfirmBtnColor:[65,105,225,1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [38,38,38,1],
            pickerTitleText: "Please select item",
            onPickerConfirm: (pickedValue, pickedIndex) => {
                //console.log('date', pickedValue, pickedIndex);
                this.setState(oldState => {
                    return {
                        ...oldState,
                        selectedIndex: pickedIndex,
                        selectedValue: pickedValue
                    }
                });
                this._handleChange(pickedValue);
                if(this.props.setDarkVisibility) {
                    this.props.setDarkVisibility(false)
                }
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                if(this.props.setDarkVisibility) {
                    this.props.setDarkVisibility(false)
                }
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                //do nothing
                //console.log('date', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    };

    render() {
        console.log("Update of DropDownV2");
        const {label, error, ...rest } = this.props;
        let newItemList = [];
        return (
            <View style={[styles.root, this.props.style]}>
                {label?<FormLabel>{label}</FormLabel>:<View/>}
                <TouchableOpacity
                    style={[{alignItems: 'center', width: "100%"}, ]}
                    onPress={() => {
                        if(this.props.setDarkVisibility)
                         {
                             this.props.setDarkVisibility(true);
                         }
                        this._showPicker(this.props.itemList, this.props.Picker)
                    }}
                >
                    <View style={styles.twoPerRowContainer}>
                        <View style={[
                                styles.pickerStyle,
                                {backgroundColor:this.props.pickerBackgroundColor?this.props.pickerBackgroundColor:"#c8e5f9"}
                            ]}>
                            {<Text numberOfLines={1} style={{color:this.props.textColor}}>{this.props.value}</Text>}
                        </View>
                        <View style={
                                [
                                    styles.angleDownContainer,
                                    {
                                        backgroundColor:this.props.pickerBackgroundColor
                                            ? this.props.pickerBackgroundColor
                                            :"#c8e5f9"
                                    }

                                ]
                            }
                        >
                            <AwesomeIcon
                                size={20}
                                name= {"angle-down"}
                                color={this.props.textColor?this.props.textColor:"#000"}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                {error && <FormValidationMessage>{error}</FormValidationMessage>}

            </View>
        );
    }
}

let borderRadius = 20;

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        alignItems: "center"

    },
    pickerStyle:{
        height: 50,
        width: "85%",
        backgroundColor: "#c8e5f9",
        alignItems: "center",
        justifyContent:"center",
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        paddingLeft: "10%"
    },

    angleDownContainer:{
        height: 50,
        width: "15%",
        backgroundColor: "#c8e5f9",
        justifyContent:"center",
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        alignItems:"flex-end",
        paddingRight: 10
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
    },

    twoPerRowContainer: {
        flexDirection:"row"
    }
});

export default DropDownListV2;