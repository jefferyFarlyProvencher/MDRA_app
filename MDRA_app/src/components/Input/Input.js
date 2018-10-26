import React, {PureComponent} from 'react';
import {StyleSheet, View, Platform} from 'react-native';

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
        const {label, error, backgroundColor, ...rest } = this.props;
        return(
            <View style={[styles.root,this.props.style]}>
                <FormLabel>{label}</FormLabel>
                <FormInput
                    center={true}
                    placeholder={label}
                    onChangeText={this._handleChangeText}
                    onBlur={this._handleTouch}
                    containerStyle={[
                        {
                            justifyContent:'flex-start',
                        },
                        error
                            ?{backgroundColor:"#ffb8c3"}
                            :backgroundColor
                                ?{backgroundColor:backgroundColor}
                                :{backgroundColor:"transparent"},
                    ]}
                    underlineColorAndroid={"#636363"}
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