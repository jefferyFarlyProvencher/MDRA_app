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

    _handleTextToHour = (value) => {
        let Hours = "00";
        if(value.includes("."))
        {

        }
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
                    onBlur={(value) =>
                        {
                            if(this.props.time) {
                                this._handleTextToHour(value);
                            }
                            this._handleTouch();
                        }
                    }
                    onChangeText={this._handleChangeText}
                    containerStyle={[{justifyContent:'center'}, error?{backgroundColor:"#ffb8c3"}:{backgroundColor:"white"}]}
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
        justifyContent: 'center',
    }
});

export default Input;