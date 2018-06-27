import React,{Component} from 'react';
import {View, Text, TouchableWithoutFeedback, ImageBackground, ActivityIndicator, Animated, StyleSheet} from 'react-native';

import startMainTabs from '../MainTabs/StartMainTabs'

import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337568.jpg'
class MainScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1)
    };

    _handlerOnPress = () => {
        this.setState({
           loading:true,
        });
        setTimeout(()=>{console.log("cool");startMainTabs();},500);
    };

    render(){
        return(
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <View  style={styles.mainContainer}>
                        <TouchableWithoutFeedback onPress={this._handlerOnPress}>
                                {this.state.loading
                                    ?<ActivityIndicator size={100} color="#555" />
                                    :<View style={styles.mainContainer}>
                                        <Text style={styles.textContainer}>Press To Start</Text>
                                    </View> }
                        </TouchableWithoutFeedback>
                </View>
            </ImageBackground>

        )
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:"center",
    },

    textContainer:{
        fontSize: 50,
        color: '#222',
        fontFamily: 'lucida grande'
    },

    backgroundImage: {
        width: "100%",
        flex:1,
    },
});

export default MainScreen;