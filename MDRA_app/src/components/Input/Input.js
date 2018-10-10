import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';

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

    render() {
        const {label, error, ...rest } = this.props;
        return(
            <View style={[styles.root,this.props.style]}>
                <FormLabel>{label}</FormLabel>
                <FormInput
                    center
                    placeholder={label}
                    onChangeText={this._handleChangeText}
                    onBlur={this._handleTouch}
                    containerStyle={[{justifyContent:'flex-start'}, error?{backgroundColor:"#ffb8c3"}:{backgroundColor:"white"}]}
                    {...rest}
                />
                {error && <FormValidationMessage>{error}</FormValidationMessage>}

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

export default Input;