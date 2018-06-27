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
        setTimeout(()=>{console.log("cool");startMainTabs();},3000);
    };

    render(){
        return(
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <View  style={styles.mainContainer}>

                        <TouchableWithoutFeedback onPress={this._handlerOnPress}  style={styles.mainContainer}>
                                {this.state.loading
                                    ?<ActivityIndicator size="large" color="#555" />
                                    :<View>
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
        justifyContent:"center",
        alignItems:"center",
        height: '100%',
    },

    textContainer:{
        fontSize: 50,
        color: '#222',
        fontFamily: 'Robotic'
    },

    backgroundImage: {
        width: "100%",
        flex:1
    },
});

export default MainScreen;