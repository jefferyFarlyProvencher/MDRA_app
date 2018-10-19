import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    ImageBackground,
    ActivityIndicator,
    Animated,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import startMainTabs from '../StartMainTabs/StartMainTabs'

import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337569.jpg'
class MainScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1)
    };

    _handleWaitingOnStart_grow = () => {
        Animated.timing(this.state.startAnim,{
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true
        }).start()
    };

    _handleWaitingOnStart_small = () => {
        Animated.timing(this.state.startAnim,{
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    };

    startBreathAnimation = () => {
        if(!this.state.loading)
        {
            this._handleWaitingOnStart_grow();
            setTimeout(
                ()=>
                {
                    this._handleWaitingOnStart_small();
                    setTimeout(
                        ()=> {
                            this.startBreathAnimation();
                        },
                        550)
                    }
                ,230
            )
        }
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarHidden: true
        });
    }

    componentDidMount() {
        this.props.navigator.setStyle({
            navBarHidden: true
        });
    }

    _handlerOnPress = () => {
        this.setState({
           loading:true,
        });
        setTimeout(()=>{console.log("cool");startMainTabs();},1000);
    };

    render(){
        this.startBreathAnimation();
        return(
            <ImageBackground source={backgroundImage} resizeMode='cover' style={styles.backgroundImage} blurRadius={0.5}>
                <Animated.View style={[
                    {transform: [{scale: this.state.startAnim.interpolate({
                                inputRange: [1,1.1],
                                outputRange: [1,1.1]
                            })
                        }]
                    },
                    (this.state.loading)?null:styles.mainContainer
                ]}
                ><View style={{alignItems:"center", justifyContent:"center"}}>

                        <TouchableWithoutFeedback onPress={this._handlerOnPress}>
                                {this.state.loading
                                    ?<ActivityIndicator size={Platform.OS==='android'?100:0} color="#111e6c" />
                                    :<View style={[styles.textContainer,]}>
                                        <Text style={[
                                            styles.textStyle,
                                            ]}
                                        >
                                            Press To Start
                                        </Text>
                                    </View>
                                }
                        </TouchableWithoutFeedback>

                </View>
                </Animated.View>
            </ImageBackground>

        )
    }
}

const styles= StyleSheet.create({
    mainContainer:{

        height: 200,
        opacity: 0.9,
        backgroundColor: '#111e6c',
        borderRadius:80,
        padding: 5,
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
        color: '#FFF',
        textAlign:'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "75%"
    },

    backgroundImage: {
        width: "100%",
        flex:1,
        alignItems:"center",
        justifyContent:"center"

    },
});

export default MainScreen;