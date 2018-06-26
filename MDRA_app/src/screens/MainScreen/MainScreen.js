import React from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';

import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337568.jpg'

export default class MainScreen{

    _handlerOnPress = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        };
        this.props.onLogin(authData);
        startMainTabs();
    };

    render(){
        return(
            <View>
                <TouchableWithoutFeedback onPress={this._handlerOnPress}>
                    <Image source={backgroundImage}/>
                </TouchableWithoutFeedback>
            </View>
        )
    }
};