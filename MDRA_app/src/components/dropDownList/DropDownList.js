import React, {PureComponent} from 'react';
import {StyleSheet,View, Picker} from 'react-native';

import {
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
            <View style={[styles.root, this.props.style]}>
                <FormLabel>{label}</FormLabel>
                <View style={styles.pickerContainer}>
                    <Picker
                        {...this.props}
                        selectedValue={this.props.value}
                        style={styles.pickerStyle}
                        onValueChange={(itemValue, itemIndex) => this._handleChange(itemValue)}
                    >
                        {this._handlePickerItem()}
                    </Picker>
                </View>
                {error && <FormValidationMessage>{error}</FormValidationMessage>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        alignSelf: 'center',
    },
    pickerStyle:{
        height: 50,
        width: "100%",
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

export default DropDownList;