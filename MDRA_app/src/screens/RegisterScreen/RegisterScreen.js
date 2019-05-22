//system imports
import React,{Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    ImageBackground,
    Platform, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import {Formik} from "formik";
import * as Yup from "yup";

//component and other imports
import NewYupString from "../../components/NewYupString/NewYupString";
import Input from "../../components/Input/Input";
import startMainTabs from "../StartMainTabs/StartMainTabs";
import testNetWorkConnection from "../../functions/testNetworkConnection";
import Ionicon from 'react-native-vector-icons/Ionicons';
import {register} from '../../functions/AccountFunctions';

class RegisterScreen extends Component{

    state={
        loading:false,
        startAnim: new Animated.Value(1),
        attempt: -1,
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

    handlePasswordVisibility = () => {
        this.setState(oldState =>{
            return{
                ...oldState,
                passwordNotVisible: !oldState.passwordNotVisible
            };

        })
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


    _handleRegister = async (values, bag) => {
        console.log("the register in is starting");
        console.log("received values : " + JSON.stringify(values));
        let registerResult = await register(values.email,values.firstName,values.lastName,values.password);
        console.log("the register has ended");
        this.props.addAccount
        // if(registerResult === "Registration/LogIn Successful!")
        // {
        //     this.props.toggleLoading();
        // }
        // else
        alert(JSON.stringify(registerResult));
    }

    render(){
        //this.startBreathAnimation();
        return(
            <View style={[{alignItems:"center", justifyContent:"center"},this.props.style]}>
                <View>
                    <View style={styles.instructionsContainer}>
                        <Text style={[
                            styles.textStyle,{color: "#FFF", fontSize: 15}
                        ]}>Please fill all the fields</Text>
                    </View>
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
                        style={this.props.style}
                        initialValues={{
                        }}
                        onSubmit={(values, bag) => {console.log("the register is starting"); this._handleRegister(values,bag)}}//this.launchNewScreen()}}
                        validationSchema={Yup.object().shape({
                            firstName: NewYupString().required(),
                            lastName: NewYupString().required(),
                            password: NewYupString().required(),
                            email: NewYupString().email().required(),
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
                            <View style={[{alignItems:"center", justifyContent:"center"},this.props.style]}>
                                <View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80}]}>
                                    <Input
                                        value={values.email}
                                        style={{marginRight:0,}}
                                        inputStyle={[styles.textStyle,{color:"#FFF"}]}
                                        autoCapitalize = 'none'
                                        onChange={(name,value) =>{
                                            if(typeof value != "undefined") {
                                                console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                console.log("input of " + name + " is: " + value)
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
                                    />
                                </View>
                                <View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80}]}>
                                    <Input
                                        value={values.firstName}
                                        style={{marginRight:0,}}
                                        inputStyle={[styles.textStyle,{color:"#FFF"}]}
                                        onChange={(name,value) =>{
                                            if(typeof value != "undefined") {
                                                console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                console.log("input of " + name + " is: " + value)
                                            }
                                        }}
                                        onTouch={() => {}}
                                        name="firstName"
                                        error={touched.firstName && errors.firstName}
                                        onBlur={() =>{
                                            //console.log(this.props.state.main.indicatorVisibility)
                                            setFieldTouched('firstName', true)
                                        }}
                                        labelPosition={"center"}
                                        placeholderTextColor={'white'}
                                        maxLength={20}
                                    />
                                </View>
                                <View style={[styles.inputStyle,{width: Dimensions.get("window").width*0.80}]}>
                                    <Input
                                        value={values.lastName}
                                        style={{marginRight:0,}}
                                        inputStyle={[styles.textStyle,{color:"#FFF"}]}
                                        onChange={(name,value) =>{
                                            if(typeof value != "undefined") {
                                                console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                console.log("input of " + name + " is: " + value)
                                            }
                                        }}
                                        onTouch={() => {}}
                                        name="lastName"
                                        error={touched.lastName && errors.lastName}
                                        onBlur={() =>{
                                            //console.log(this.props.state.main.indicatorVisibility)
                                            setFieldTouched('lastName', true)
                                        }}
                                        labelPosition={"center"}
                                        placeholderTextColor={'white'}
                                        maxLength={20}
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
                                                console.log("value of name: " + name);
                                                setFieldValue(name, value);
                                                console.log("input of " + name + " is: " + value)
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
                                            {this.state.passwordNotVisible
                                                ?<Ionicon
                                                    size={40}
                                                    name= {Platform.OS==='android'? "md-eye" :"ios-eye"}
                                                    color="#FFF"
                                                    style={styles.drawerItemIcon}
                                                />:<Ionicon
                                                    size={40}
                                                    name= {Platform.OS==='android'? "md-eye-off" :"ios-eye-off"}
                                                    color="#FFF"
                                                    style={styles.drawerItemIcon}
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View>
                                    <View pointerEvents={(isValid?"auto":"none")}>
                                        <TouchableOpacity onPress={handleSubmit}>//this._handlerOnPress}>
                                            <View style={[styles.textContainer,(isValid?styles.mainContainerValid: styles.mainContainerInvalid)]}>
                                                <Text style={[
                                                    styles.textStyle,
                                                ]}
                                                >
                                                    Register
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <TouchableOpacity onPress={()=>{this.props.handleScreenToggle()}}>
                    <View>
                        <Text style={[
                            styles.textStyle,{color: "#000", fontSize: 17, fontWeight: 'bold'}
                        ]}>Log In</Text>
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
        opacity: 0.9,
        padding: 10,
        margin: 10,
        borderRadius:10,
        width: Dimensions.get("window").width*0.66,

    },
    instructionsContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*0.05,
        backgroundColor: '#111e6c',
        opacity: 0.7,
        alignItems: "center",
        justifyContent: "center"
    },


    drawerItemIcon: {
        margin: 0,
        padding: 0
    }
});

export default RegisterScreen;