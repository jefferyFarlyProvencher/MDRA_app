import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, ScrollView, Picker} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';

class DropDownList extends PureComponent{

    state = {
      choice: "",
    };

    _handleChange = (value)=> {
        this.props.onChange(this.props.name, value)
    };

    _handleTouch = () => {
        this.props.onTouch(this.props.name)
    };

    _handlePickerItem = () => {
        let output = [];
        //quantity control
        if (this.props.itemList.length == 0)
            return -1;
        else {
            for (let i = 0; i < this.props.itemList.length; i++) {
                output.push(
                    <Picker.Item
                        label={this.props.itemList[i]}
                        value={this.props.itemList[i]}
                        key={this.props.label+this.props.itemList[i]+Math.random()}/>)
            }
            return output;
        }

    };

    render() {
        const {label, error, ...rest } = this.props;
        return(
            <View style={styles.root}>
                <FormLabel>{label}</FormLabel>
                <Picker
                    {...this.props}
                    selectedValue={this.props.value}
                    style={styles.pickerStyle}
                    onValueChange={(itemValue, itemIndex) => this._handleChange(itemValue)}
                    children={this._handlePickerItem()}
                >
                </Picker>
                {error && <FormValidationMessage>{error}</FormValidationMessage>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '50%',
        alignSelf: 'center',
        padding: 20
    },
    pickerStyle:{
        height: 50, width: "100%"
    }
});

export default DropDownList;