import React, { Component } from 'react';
import {View, Text, Animated} from 'react-native';

class WelcomeScreen extends Component {
    state={
        welcomeScreenX: new Animated.Value(0),
        welcomeScreenOpacity: new Animated.Value(0.7)
    };

    componentWillMount() {
        if(this.props.showWelcomeScreen)
            this.handleWelComeScreenDisplay();
    }

    hideWelcomeScreen = () => {
        setTimeout(
            this.props.removeWelcomeScreen,
            500
        )
        Animated.spring(this.state.welcomeScreenX, {
            toValue: -500,
            duration: 5000
        }).start();
        // this.setState({
        //     welcomeScreenVisible: true,
        // });

    };

    showWelcomeScreen = () => {
        Animated.spring(this.state.welcomeScreenOpacity, {
            toValue: 1,
            duration: 200
        }).start();
        this.setState({
            welcomeScreenVisible: false,
        });
    };

    handleWelComeScreenDisplay = () => {
        // this.showWelcomeScreen();
        setTimeout(
            this.hideWelcomeScreen,
            1000
        )
    };


    render() {

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        zIndex:1,
                        opacity: 1,//this.state.welcomeScreenOpacity,
                        transform: [
                            {
                                translateX: this.state.welcomeScreenX,
                            }
                        ],
                        backgroundColor:'white'
                    }
                ]}
            >
                <View style={styles.container}>
                    <Text style={{fontSize:25}}>Welcome</Text>
                    <Text style={{fontSize:30}}>{(this.props.title?this.props.title:"")+this.props.name}</Text>
                </View>
            </Animated.View>
        )
    }

}

styles = {
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
};

export default WelcomeScreen;