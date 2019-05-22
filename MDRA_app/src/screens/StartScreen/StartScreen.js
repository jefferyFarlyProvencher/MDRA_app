import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    Animated,
    StyleSheet,
    Dimensions,
    Platform,
    Alert
} from 'react-native';

//Navigation
import startMainTabs from '../StartMainTabs/StartMainTabs'
//Image
import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337569.jpg'

//functions
import testNetWorkConnection from '../../functions/testNetworkConnection';

//screens
import LogInScreen from '../../screens/LogInScreen/LogInScreen'
import RegisterScreen from '../../screens/RegisterScreen/RegisterScreen'
import {connect} from "react-redux";
import {addAccount} from "../../store/actions";

class StartScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1),
        attempt: -1,
        isItLogIn: true
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

    displayConnectionError = () =>{

        Alert.alert(
            'Warning: The application cannot connect to server',
            'Do you still want to continue?', [
                {
                    text: 'Cancel',
                    onPress: (() => {
                        console.log('Cancel Pressed');
                        this.setState((oldState) => {
                            return {
                                ...oldState,
                                loading: false,
                                attempt: -1
                            }
                        });
                    }),
                    style: 'cancel'
                }, {
                    text: 'Continue',
                    onPress: () => {this.launchNewScreen()}
                }
            ],
            {
                cancelable: true
            }
        );
    };
    handleScreenToggle = (value) => {
        this.setState(oldState => {
            return{
                ...oldState,
                isItLogIn: value? value: !oldState.isItLogIn
            }
        })
    };

    logOut = async () => {
        await this.props.onAddAccount(null, null);
    };

    launchNewScreen = () => {
        console.log("launching new screen");
        setTimeout(()=>{console.log("main tabs starting");startMainTabs();},1500);
    };

    //attempts to load the app, basically does a verification of network status and waits .5 secs before launching
    _startMainApp = async (account) => {
        if(!(typeof this.props.state.main.linkedAccount !== "undefined"&&this.props.state.main.linkedAccount.token&&typeof this.props.state.main.linkedAccount.token !== "undefined"))
            await this.props.onAddAccount(account['name'], account['token']);
        this.setState((oldState)=>{
            return{
                ...oldState,
                loading:true,
                attempt: oldState.attempt+1
            }
        });
        let connectionResult =  await testNetWorkConnection();
        console.log("Connection Result: "+ JSON.stringify(connectionResult));
        if(connectionResult)
            this.launchNewScreen();
        else {
            if (this.state.attempt < 100)
                this._startMainApp(account);
            else {
                this.displayConnectionError()
            }
        }
    };

    render(){
        this.startBreathAnimation();
        return(
            <ImageBackground source={backgroundImage} resizeMode='cover' style={styles.backgroundImage} blurRadius={0.5}>
                {this.state.loading
                    ?<View style={{alignItems:"center", justifyContent:"center"}}>
                        <ActivityIndicator size={Platform.OS==='android'?100:0} color="#111e6c" />
                        {this.state.loading && this.state.attempt > 0?
                            <View>
                                <Text>{"Connection Attempt # " + this.state.attempt}</Text>
                            </View>
                            :<View/>
                        }
                    </View>
                    :<View>
                        {(typeof this.props.state.main.linkedAccount !== "undefined"&&this.props.state.main.linkedAccount.token&&typeof this.props.state.main.linkedAccount.token !== "undefined")
                        ?<View>
                                <View style={styles.surroundTextContainerStyle}>
                                    <Text style={[styles.surroundTextStyle, {fontSize:30}]}>
                                        Welcome back {this.props.state.main.linkedAccount.name} !
                                    </Text>
                                </View>
                                <Animated.View style={[
                                    {transform: [{scale: this.state.startAnim.interpolate({
                                                inputRange: [1,1.1],
                                                outputRange: [1,1.1]
                                            })
                                        }]
                                    },
                                    (this.state.loading)?null:styles.mainContainer
                                    ]}>
                                        <View style={{alignItems:"center", justifyContent:"center"}}>
                                            <TouchableWithoutFeedback onPress={this._startMainApp}>
                                                    <View style={[styles.textContainer,{}]}>
                                                        <Text style={[
                                                            styles.textStyle,
                                                            ]}
                                                        >
                                                            Press to Start
                                                        </Text>
                                                    </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                </Animated.View>
                                <View style={[styles.surroundTextContainerStyle,{backgroundColor:"#b8d6ff", width:Dimensions.get("window").width}]}>
                                    <Text style={styles.surroundTextStyle}>Not {this.props.state.main.linkedAccount.name}? Press </Text>
                                    <TouchableOpacity onPress={this.logOut}>
                                        <Text style={[styles.surroundTextStyle,{fontSize:20, fontWeight: "bold"}]}>
                                            HERE
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.surroundTextStyle}> to switch account</Text>
                                </View>
                            </View>
                        :<View>_
                            <LogInScreen  style={{display:this.state.isItLogIn?"flex":"none"}} handleScreenToggle={() => {console.log("Trying stuff 1"); this.handleScreenToggle(false)}} startMainApp = {this._startMainApp}/>
                            <RegisterScreen style={{display:this.state.isItLogIn?"none":"flex"}} handleScreenToggle={() => {console.log("Trying stuff 2"); this.handleScreenToggle(true)}} startMainApp = {this._startMainApp}/>
                        </View>
                        }
                    </View>
                }
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
        alignItems: 'center',
        justifyContent: 'center',
    },

    textContainer:{
        width: "100%",
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1, height:"100%"
    },

    textStyle:{
        fontSize: 50,
        color: '#FFF',
        textAlign:'center',
        width: "100%"
    },

    backgroundImage: {
        width: "100%",
        flex:1,
        alignItems:"center",
        justifyContent:"center"

    },

    surroundTextContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 50
    },

    surroundTextStyle: {
        fontSize: 15,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddAccount: (name, token) => dispatch(addAccount(name, token)),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(StartScreen);