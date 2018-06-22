import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';

class Input extends PureComponent{

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

        inputValue: ""
    };

    _handleChange = (value)=> {
      this.props.onChange(this.props.name, value)
    };

    _handleTouch = () => {
        this.props.onTouch(this.props.name)
    };

    render() {
        const {label, error, ...rest } = this.props;
        return(
            <View style={styles.root}>
                <FormLabel>{label}</FormLabel>
                <FormInput
                    placeholder={label}
                    onBlur={this._handleTouch}
                    onChangeText={this._handleChange}
                    {...rest}
                />
                {error && <FormValidationMessage>{error}</FormValidationMessage>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '90%',
        alignSelf: 'center',
    }
});

export default Input;