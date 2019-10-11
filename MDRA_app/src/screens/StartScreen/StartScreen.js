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
    Alert, BackHandler,
    ScrollView
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
//Redux
import {connect} from "react-redux";
import {addAccount, emptyResultList, emptyPatientsList, setStayConnected} from "../../store/actions";
// import CheckBox from "../../components/CheckBox/CheckBox";
import {CheckBox} from "react-native-elements";

class StartScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1),
        attempt: -1,
        isItLogIn: true,
        stayConnected: this.props.state.main.stayConnected, //!== null && typeof this.props.state.main.stayConnected !== 'undefined'
            // ? this.props.state.main.stayConnected
            // : false
        storedGlobalStayConnected: this.props.state.main.stayConnected,
        stayConnectedErrorCorrected: false,
    };

    componentWillMount() {
        this.startBreathAnimation();
        this.delayDisplay()
    }

    componentWillUpdate() {

    }

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

    // componentWillMount() {
    //     this.props.navigator.setStyle({
    //         navBarHidden: true
    //     });
    // }

    handleBackButton = () => {
        // if(this.props.state.main.position === 0 || this.props.state.main.position === 4)
        Alert.alert(
            'Exit App',
            'Exiting the application?', [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => BackHandler.exitApp(),
                }
            ],
            {
                cancelable: false
            }
        );
        return true;
    };

    componentDidMount() {
        this.props.navigator.setStyle({
            navBarHidden: true
        });

        BackHandler.removeEventListener('hardwareBackPress',  ()=>{BackHandler.exitApp()});
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress',  this.handleBackButton)
    }

    /**
     * delayDisplay() and toggleDisplay
     *  this is to fix the glitched display at start (log in is showed when button should instead)
     *  and to fix the Stay Logged In
     */

    delayDisplay = () => {
        // setTimeout(
        //     ()=>{
        //         this.toggleDisplay();
        //     },
        //     50
        // )
    };

    toggleDisplay = () => {

        if(this.props.state.main.stayConnected  !== this.state.storedGlobalStayConnected)
        {
            this.handleStayConnected();
            this.setState(oldState => {
            return{
                stayConnectedErrorCorrected:true,
            }
        })
        }

    };



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
        //toggleScreen
        this.setState(oldState => {
            return{
                ...oldState,
                isItLogIn: value? value: !oldState.isItLogIn
            }
        })
    };

    /**
     * handleStayConnected
     *
     * sets the LOCAL value of stay Connected
     *
     * the GLOBAL value is set on log in
     */
    handleStayConnected = () => {
        console.log("Switching local stay connected");
        this.setState(oldState => {
          return{
              ...oldState,
              stayConnected:!oldState.stayConnected,
          }
        })
    };

    logOut = async () => {
        Alert.alert(
            'Certain you want to Sign Out?',
            '(NOTE: All Patients and Results will be erased)', [
                {
                    text: 'Cancel',
                    onPress: (() => {
                        console.log('Cancel Pressed');
                    }),
                    style: 'cancel'
                }, {
                    text: 'Sign Out',
                    onPress:async () => {
                        await this.props.onAddAccount(null, null);
                        await this.props.onEmptyResultList();
                        await this.props.onEmptyPatientsList();
                    }
                }
            ],
            {
                cancelable: true
            }
        );

    };

    launchNewScreen = () => {
        //setStayConnected
        this.props.onSetStayConnected(this.state.stayConnected);
        //launch screen
        console.log("launching new screen");
        setTimeout(()=>{console.log("main tabs starting");startMainTabs();},500);
    };

    //attempts to load the app, basically does a verification of network status and waits .5 secs before launching
    _startMainApp = async (account, email) => {
        if(!(typeof this.props.state.main.linkedAccount !== "undefined"&&this.props.state.main.linkedAccount.token&&typeof this.props.state.main.linkedAccount.token !== "undefined"))
            await this.props.onAddAccount(email, account['name'], account['token']);
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
        console.log("value of stay logged in (local): "+ this.state.stayConnected);
        console.log("value of stay logged in (global): "+ this.props.state.main.stayConnected);
        console.log("Update of StartScreen");
//this.startBreathAnimation();
        let displayLogRegScreens = !(typeof this.props.state.main.linkedAccount !== "undefined"&&this.props.state.main.linkedAccount.token&&typeof this.props.state.main.linkedAccount.token !== "undefined");
        // console.log("displayLogRegScreens: "+ displayLogRegScreens);
        // console.log("this.props.state.main.linkedAccount === null: "+(this.props.state.main.linkedAccount === null));
        // console.log("typeof this.props.state.main.linkedAccount === \"undefined\": "+ (typeof this.props.state.main.linkedAccount === "undefined"));
        let globalStayConnected = this.props.state.main.stayConnected;

        if(!this.state.stayConnectedErrorCorrected && !this.state.loading)
            this.toggleDisplay();
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
                        {!displayLogRegScreens
                        ?
                            <View style={{alignItems:"center"}}>
                                <View style={styles.surroundTextContainerStyle}>
                                    <Text
                                        style={[
                                            styles.surroundTextStyle,
                                            {
                                                fontSize:Dimensions.get('window').width*0.08,
                                                color:"black"
                                            }
                                        ]}
                                    >
                                        Welcome back Dr.{this.props.state.main.linkedAccount.name} !
                                    </Text>
                                </View>
                                {globalStayConnected
                                ?<View>
                                    <View style={{alignItems: "center", justifyContent:"center"}}>
                                        <Animated.View
                                            style={[

                                                {transform: [{scale: this.state.startAnim.interpolate({
                                                            inputRange: [1,1.1],
                                                            outputRange: [1,1.1]
                                                        })
                                                    }]
                                                },
                                                (this.state.loading)?null:styles.mainContainer
                                            ]}
                                        >
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
                                    </View>
                                    <View style={styles.checkContainer}>
                                        <CheckBox
                                            center
                                            title={'Stay logged In'}
                                            checked={this.state.stayConnected}
                                            checkedColor={'#112ab0'}
                                            onPress={()=>this.handleStayConnected()}
                                            containerStyle={{backgroundColor:'rgba(256,256,256,0.50)'}}

                                        />
                                    </View>
                                </View>
                                :<LogInScreen
                                    style={{display:"flex"}}
                                    handleStayConnected={() => {this.handleStayConnected()}}
                                    stayConnected = {this.state.stayConnected}
                                    frozenEmail={this.props.state.main.linkedAccount.email}
                                    startMainApp = {this._startMainApp}
                                    displayConnectionError={this.displayConnectionError}
                                />
                                }
                                <View
                                    style={
                                        [
                                            styles.surroundTextContainerStyle,
                                            {   width:Dimensions.get("window").width,
                                                backgroundColor: 'rgba(17,42,176,0.5)',
                                            },

                                        ]
                                    }
                                >
                                    <Text style={styles.surroundTextStyle}>Not {this.props.state.main.linkedAccount.name?this.props.state.main.linkedAccount.name:"Error Man"}? Press </Text>
                                    <TouchableOpacity onPress={this.logOut}>
                                        <Text style={[styles.surroundTextStyle,{fontSize:20, fontWeight: "bold", color:"#FFF"}]}>
                                            HERE
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.surroundTextStyle}> to Sign Out</Text>
                                </View>
                            </View>
                        :<View
                            style={
                                {
                                    display: !displayLogRegScreens?"none":"flex",
                                    alignItems:"center", justifyContent:"center",
                                    height:"100%"
                                }
                            }
                        >
                                <LogInScreen
                                    style={{display:this.state.isItLogIn?"flex":"none"}}
                                    handleStayConnected={() => {this.handleStayConnected()}}
                                    stayConnected = {this.state.stayConnected}
                                    startMainApp = {this._startMainApp} displayConnectionError={this.displayConnectionError}
                                />
                                <RegisterScreen
                                    style={{display:this.state.isItLogIn?"none":"flex"}}
                                    handleStayConnected={() => {this.handleStayConnected()}}
                                    stayConnected = {this.state.stayConnected}
                                    startMainApp = {this._startMainApp}
                                />
                                <TouchableOpacity onPress={()=>{this.handleScreenToggle()}}>
                                    <View>
                                        <Text
                                            style={[
                                                styles.textStyle,{color: "#000", fontSize: 17, fontWeight: 'bold'}
                                            ]}
                                        >
                                            {this.state.isItLogIn?"Register here":"Log In Here"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
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
        height: Dimensions.get('window').height*0.3,
        width: Dimensions.get('window').width*0.9,
        opacity: 0.9,
        backgroundColor: '#111e6c',
        borderRadius:Platform.isPad?120:80,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textContainer:{
        width: "100%",
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1, height:"100%",
    },

    textStyle:{
        fontSize: 50,
        color: '#FFF',
        textAlign:'center',
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
        marginVertical: 10,
        paddingVertical: 5,
    },

    surroundTextStyle: {
        fontSize: 15,
        textAlign: "center",
        color:"white"
    },
    checkContainer: {
        marginTop:20
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddAccount: (email,name, token) => dispatch(addAccount(email,name, token)),
        onEmptyResultList: () => dispatch(emptyResultList()),
        onEmptyPatientsList: () => dispatch(emptyPatientsList()),
        onSetStayConnected: (value) => dispatch(setStayConnected(value))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(StartScreen);