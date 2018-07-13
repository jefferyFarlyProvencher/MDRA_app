import React,{Component} from 'react';
import {View, Text, TouchableWithoutFeedback, ImageBackground, ActivityIndicator, Animated, StyleSheet} from 'react-native';

import startMainTabs from '../MainTabs/StartMainTabs'

import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337569.jpg'
class MainScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1)
    };

    _handlerOnPress = () => {
        this.setState({
           loading:true,
        });
        setTimeout(()=>{console.log("cool");startMainTabs();},300);
    };

    render(){
        return(
            <ImageBackground source={backgroundImage} resizeMode='cover' style={styles.backgroundImage} blurRadius={0.5}>
                <View  style={this.state.loading?null:styles.mainContainer}>
                        <TouchableWithoutFeedback onPress={this._handlerOnPress}>
                                {this.state.loading
                                    ?<ActivityIndicator size={100} color="#555" />
                                    :<View style={styles.textContainer}>
                                        <Text style={styles.textStyle}>Press To Start</Text>
                                    </View> }
                        </TouchableWithoutFeedback>
                </View>
            </ImageBackground>

        )
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        alignItems:"center",
        justifyContent:"center",
        height:"70%",
        width: "80%",
        backgroundColor: 'rgba(52, 52, 52, 0.7)',
        borderRadius:50,
    },

    textContainer:{
        width: "100%",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        padding: 10

    },

    textStyle:{
        fontSize: 50,
        color: '#eee',
        textAlign:'center',
        fontFamily: 'lucida grande'
    },

    backgroundImage: {
        width: "100%",
        flex:1,
        alignItems:"center",
        justifyContent:"center"

    },
});

export default MainScreen;