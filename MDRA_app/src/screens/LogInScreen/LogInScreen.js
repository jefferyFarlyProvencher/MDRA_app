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
import {Formik} from "formik";
import * as Yup from "yup";
//Navigation
import startMainTabs from '../StartMainTabs/StartMainTabs'
//Image
import backgroundImage from '../../assets/pills-glasses-stethoscope-text-diagnosis-adhd-pills-glasses-stethoscope-text-diagnosis-adhd-paper-103337569.jpg'

//components
import Input from "../../components/Input/Input";
import NewYupString from "../../components/NewYupString/NewYupString";
import Spinner from "react-native-loading-spinner-overlay";

//functions
import testNetWorkConnection from '../../functions/testNetworkConnection';
import {logIn} from '../../functions/AccountFunctions';
import Ionicon from 'react-native-vector-icons/Ionicons';




class LogInScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1),
        attempt: -1,
        logInError: false,
        errorText: "",
        passwordNotVisible: true

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

    handleToggleLogIn = () => {
        this.setState(oldState => {
            return{
                ...oldState,

            }
        })
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

    toggleLoading = async (value) => {
        this.setState((oldState)=>{
            return{
                ...oldState,
                loading:(value?value:!oldState.loading),
                attempt: oldState.attempt+1
            }
        });
        let connectionResult =  await testNetWorkConnection();
        console.log("Connection Result: "+ JSON.stringify(connectionResult));
        if(!connectionResult){
            if (this.state.attempt < 100)
                this.toggleLoading(true);
            else {
                this.props.displayConnectionError()
            }
        }
    };

    _handlerLogIn = async (values, bag) => {
        await this.toggleLoading();
        console.log("the log in is starting");
        let logInResult = await logIn(values.email, values.password);
        console.log("the log in ended");
        if(typeof logInResult === "object")
        {
            this.props.startMainApp(logInResult);
        }
        else{
            await this.toggleLoading();
            this.setState((oldState)=>{
                return{
                    ...oldState,
                    logInError: true,
                    errorText: logInResult
                }
            });
        }
    };

    handlePasswordVisibility = () => {
        this.setState(oldState =>{
            return{
                ...oldState,
                passwordNotVisible: !oldState.passwordNotVisible
            };

        })
    };

    render(){
        //this.startBreathAnimation();
        return(
            <View style={[{alignItems:"center", justifyContent:"center"}, this.props.style]}>
                <View>
                    {this.state.logInError?
                        <View style={{alignItems:"center"}}>
                            <Text style={{color:'red'}}>
                                {this.state.errorText}
                            </Text>
                        </View>
                        :<View/>
                    }
                    {/*<View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80,}]}>*/}
                        {/*<Text style={[*/}
                            {/*styles.textStyle,*/}
                        {/*]}>Username</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{width:"50%", marginRight:0}}>*/}
                        {/*<Input*/}
                            {/*label={"Name of result"}*/}
                            {/*labelPosition={"center"}*/}
                            {/*value={values.resultName}*/}
                            {/*style={{marginRight:0}}*/}
                            {/*onChange={(name,value) =>{*/}
                                {/*setFieldValue(name,value)*/}
                            {/*}}*/}
                            {/*onTouch={setFieldTouched}*/}
                            {/*name="resultName"*/}
                            {/*error={touched.resultName && errors.resultName}*/}
                            {/*onBlur={() =>{*/}
                                {/*//console.log(this.props.state.main.indicatorVisibility)*/}
                            {/*}}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    <Formik
                        initialValues={{ newName: null}}
                        onSubmit={(values, bag) => {console.log("the log in is starting"); this._handlerLogIn(values, bag)}}
                        validationSchema={Yup.object().shape({
                            email: NewYupString().required(),
                            password: NewYupString().required(),
                        })}
                        render={({
                                     values,
                                     handleSubmit,
                                     setFieldValue,
                                     errors,
                                     touched,
                                     setFieldTouched,
                                     isValid,
                                     isSubmitting
                                 }) => (
                            <View style={{alignItems:"center", justifyContent:"center"}}>
                                <View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80}]}>
                                    <Input
                                        value={values.email}
                                        style={{marginRight:0,}}
                                        inputStyle={[styles.textStyle,{color:"#FFF"}]}
                                        autoCapitalize = 'none'
                                        onChange={(name,value) =>{
                                            if(typeof value != "undefined") {
                                                //console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                //console.log("input of " + name + " is: " + value)
                                            }
                                        }}
                                        onTouch={() => {}}
                                        name="email"
                                        error={touched.email && errors.email}
                                        onBlur={() =>{
                                            //console.log(this.props.state.main.indicatorVisibility)
                                            setFieldTouched('email', true)
                                        }}
                                        labelPosition={"center"}
                                        placeholderTextColor={'white'}
                                        maxLength={320}
                                        keyboardType={"email-address"}
                                    />
                                </View>
                                <View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80, flexDirection:"row"}]}>
                                    <Input
                                        value={values.password}
                                        style={{marginRight:0,paddingRight: 0,}}
                                        inputStyle={[styles.textStyle,{color:"#FFF", marginRight:0}]}
                                        secureTextEntry={this.state.passwordNotVisible}
                                        onChange={(name,value) =>{
                                            if(typeof value != "undefined") {
                                                //console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                //console.log("input of " + name + " is: " + value)
                                            }
                                        }}
                                        onTouch={setFieldTouched}
                                        name="password"
                                        error={touched.password && errors.password}
                                        onBlur={() =>{
                                            setFieldTouched('password', true)
                                        }}
                                        placeholderTextColor={'white'}
                                        maxLength={20}
                                    />
                                    <View  style={[styles.drawerItem,{margin:0, position: "absolute", right: "1%", top:"25%"}]}>
                                        <TouchableOpacity onPress={this.handlePasswordVisibility}>
                                            <View>
                                            {this.state.passwordNotVisible
                                                ?<Ionicon
                                                    size={40}
                                                    name= {Platform.OS==='android'? "md-eye" :"ios-eye"}
                                                    color="#FFF"
                                                    style={styles.drawerItemIcon}
                                                />
                                                :<Ionicon
                                                    size={40}
                                                    name= {Platform.OS==='android'? "md-eye-off" :"ios-eye-off"}
                                                    color="#FFF"
                                                    style={styles.drawerItemIcon}
                                                />
                                            }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.ForgotPasswordContainer}>
                                    <Text style={[
                                        styles.textStyle,{color: "#FFF", fontSize: 15}
                                    ]}>Forgot Password</Text>
                                </View>
                                <View>
                                    <View pointerEvents={(isValid?"auto":"none")}>
                                        <TouchableOpacity onPress={handleSubmit}>
                                            <View style={[styles.textContainer,(isValid?styles.mainContainerValid: styles.mainContainerInvalid)]}>
                                                <Text style={[
                                                    styles.textStyle,
                                                ]}
                                                >
                                                    Log In
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                    {/*{this.state.loading*/}
                        {/*?<View style={styles.loadingStyle}>*/}
                            {/*<ActivityIndicator size={Platform.OS==='android'?100:0} color="#111e6c" />*/}
                            {/*{this.state.loading && this.state.attempt > 0?*/}
                                {/*<View>*/}
                                    {/*<Text>{"Connection Attempt # " + this.state.attempt}</Text>*/}
                                {/*</View>*/}
                                {/*:<View/>*/}
                            {/*}*/}
                        {/*</View>*/}
                        {/*:<View style={{display:"none"}}/>*/}
                    {/*}*/}
                    <Spinner visible={this.state.loading} textContent={"Attempting to Log In..."} textStyle={{color: '#FFF'}}/>
                </View>
                <TouchableOpacity onPress={()=>{this.props.handleScreenToggle()}}>
                    <View>
                        <Text
                            style={[
                                styles.textStyle,{color: "#000", fontSize: 17, fontWeight: 'bold'}
                            ]}
                        >Register here</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    mainContainerValid:{
        height: 50,
        opacity: 1,
        backgroundColor: '#111e6c',
        borderRadius:80,
        padding: 5,
        width: Dimensions.get("window").width*0.7,
        margin: 10
    },

    mainContainerInvalid:{
        height: 50,
        opacity: 1,
        backgroundColor: '#dddddd',
        borderRadius:80,
        padding: 5,
        width: Dimensions.get("window").width*0.7,
        margin: 10
    },

    textContainer:{
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,

    },

    textStyle:{
        fontSize: 20,
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

    inputStyle: {
        backgroundColor: '#b7b7b7',
        opacity: 0.95,
        padding: 10,
        margin: 10,
        borderRadius:10,
        width: Dimensions.get("window").width*0.66,

    },
    ForgotPasswordContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*0.05,
        margin: 10,
        backgroundColor: '#111e6c',
        opacity: 0.8,
        alignItems: "center",
        justifyContent: "center"
    },

    loadingStyle: {
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        zIndex: 2,
        backgroundColor:"#DDD",
        opacity: 0.5,
        position:"absolute",
        left: Dimensions.get("window").width*0.01,
        top:0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    }


});

export default LogInScreen;