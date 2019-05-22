import React, {PureComponent} from 'react';
import {StyleSheet, View, Platform, TextInput} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';

/**
 *  Input requires:
 *
 *  name: string
 *  onTouch: function
 *  onChange: function
 *
 *  Input optional:
 *
 *  label: string
 *  inputStyle: object,
 *  style: object
 *
 */

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

    handleLabelPosition = (labelPosition) =>{
        switch (labelPosition) {
            case "left":
                return "flex-start";
            case "center":
                return "center";
            case "right":
                return "flex-end";
        }
    };

    render() {
        const {label, error, backgroundColor, name, ...rest } = this.props;
        let labelPosition = this.props.labelPosition;
        return(
            <View style={[styles.root,this.props.style]}>
                {label
                    ?<FormLabel
                        containerStyle={
                            {
                                alignItems: labelPosition?this.handleLabelPosition(labelPosition): "flex-start"
                            }
                        }
                    >
                        {label}
                    </FormLabel>
                    :<View/>
                }
                <View>
                    <FormInput
                        center={true}
                        placeholder={label? label: name}
                        onChangeText={this._handleChangeText}
                        onFocus={this.props.onTouch}
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
                            {

                            }
                        ]}
                        inputStyle={[
                            {
                                width:"100%",
                            },
                            this.props.inputStyle
                        ]}
                        underlineColorAndroid={"#636363"}
                        maxLength={this.props.maxLength?this.props.maxLength:null}
                        {...rest}
                    />

                </View>
                <View style={{
                    alignItems: labelPosition?this.handleLabelPosition(labelPosition): "flex-start"
                }}>
                    {error && <FormValidationMessage>{error}</FormValidationMessage>}
                </View>

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