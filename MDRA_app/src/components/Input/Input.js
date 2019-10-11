import React, {Component} from 'react';
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

class Input extends Component{

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

        lineColor: "#888",

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

    handleOnBlur = (onBlur) => {
        this.setState( oldState =>{
            return{
                ...oldState,
                lineColor: "#888"
            }
        });
        if(typeof onBlur !== "undefined" && onBlur!==null)
            onBlur();
    };

    handleOnFocus = () => {
        this.setState( oldState =>{
            return{
                ...oldState,
                lineColor: "#2740ff"
            }
        });
        if(this.props.onTouch)
            this.props.onTouch();
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
        console.log("Update of Input");
        const {label, error, backgroundColor, name, center,onBlur, maxLength, inputStyle,displayLabel,...rest } = this.props;
        let labelPosition = this.props.labelPosition;
        return(
            <View style={[styles.root,this.props.style]}>
                {displayLabel !== false && label
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
                        center={center?center:true}
                        placeholder={label? label: name}
                        onChangeText={this._handleChangeText}
                        onFocus={this.handleOnFocus}
                        //onBlur={this._handleTouch}
                        onBlur={() => this.handleOnBlur(onBlur)}
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
                                borderBottomColor: this.state.lineColor,
                            }
                        ]}
                        inputStyle={[
                            {
                                width:"100%",
                            },
                            inputStyle
                        ]}
                        underlineColorAndroid={"#636363"}
                        maxLength={maxLength?maxLength:null}
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