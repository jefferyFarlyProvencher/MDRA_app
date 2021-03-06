//Base imports
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    StyleSheet,
    Modal,
    Button,
    BackHandler,
    Alert,
    StatusBar,
    Platform,
    Animated
} from 'react-native';
import {connect} from 'react-redux';

import {IndicatorViewPager} from 'rn-viewpager'
//Package Imports
import StepIndicator from 'react-native-step-indicator';
import Picker from 'react-native-picker';

//Screen Imports
import FormScreenInitial from '../FormScreen0_initial/FormScreen_initialV2';
import FormScreenTimeZonage from '../FormScreen1_timeZonage/FormScreen_timeZonageV2';
import FormScreenWeights from '../FormScreen2_weights/FormScreen_weights';
import FormScreenAdvanced from '../FormScreen3_advanced/FormScreen_advanced';
import SendFormScreen from '../SendFormScreen/SendFormScreen';
import {addData, changePosition, toggleIndicatorVisibility} from "../../store/actions";
import WelcomeScreen from "../../components/WelcomeScreen/WelcomeScreen";
import PatientsList from "../../components/PatientsList/PatientsList";
//component Imports
import TutorialPage from '../../components/TutorialPage/TutorialPage';

//Tutorial images imports
import tutorial_p0_1 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_1.png'
import tutorial_p0_2 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_2.png'
import tutorial_p0_3 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_3.png'
import tutorial_p0_4 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_4.png'
import tutorial_p0_5 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_5.png'
import tutorial_p0_6 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_6.png'
import tutorial_p0_7 from '../../assets/Tutorial/tutorialForm/Tutorial_form_0_7.png'
import tutorial_p1_0 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_0.png'
import tutorial_p1_1 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_1.png'
import tutorial_p1_2 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_2.png'
import tutorial_p1_3 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_3.png'
import tutorial_p1_4 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_4.png'
import tutorial_p1_5 from '../../assets/Tutorial/tutorialForm/Tutorial_form_1_5.png'

class FormScreen extends Component{

    state={
        welcomeScreenVisible: true,
        showTutorial: false,
        tutorialData: [],
    };

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

    // componentWillMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    //
    //     this.props.navigator.setStyle({
    //         navBarBackgroundColor: '#262626',
    //         navBarTextColor: '#ffffff',
    //         statusBarTextColorSchemeSingleScreen: 'light',
    //         navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
    //         orientation: 'portrait',
    //     });
    //     //
    //     this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    //
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // }

    componentDidMount() {
        //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigator.setStyle({
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
            orientation: 'portrait',
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        BackHandler.removeEventListener('hardwareBackPress',  ()=>{BackHandler.exitApp()});
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress')
    }

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        console.log("event: " + JSON.stringify(event));
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
            else if(event.id === "informationButton"){
                this.showInformationTutorial()
            }
        }
        else if(event.type === "DeepLink"){
            if(event.link === "retrieveOldResults")
            {
                this.props.navigator.popToRoot({
                    animated: false,
                    //animationType: 'fade',
                });

                this.props.navigator.showModal({
                    screen: "MDRA_app.retrieveOldResults",
                    title: "Retrieve Old Results",
                });
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
        else if(event.type === "hardwareBackPress")
        {
            //do nothing
        }
    };
    //Credits to guyca ad M-Jas for the buttons push fix
    // _keyboardDidShow = () => {
    //     // alert('Keyboard Shown');
    //     console.log("this.props.state.main.indicatorVisibility: "+ this.props.state.main.indicatorVisibility)
    //     if(Platform.OS === 'android' && this.props.state.main.indicatorVisibility === 1) {
    //         this.props.onToggleIndicator(false);
    //         this.props.navigator.toggleTabs({
    //             to: 'hidden',
    //             animated: false
    //         });
    //     }
    //
    // };
    //
    // _keyboardDidHide = () => {
    //     // alert('Keyboard Hidden');
    //     if(Platform.OS === 'android' && this.props.state.main.indicatorVisibility === 0) {
    //         this.props.onToggleIndicator(true);
    //         this.props.navigator.toggleTabs({
    //             to: 'shown',
    //             animated: false
    //         });
    //     }
    // };
    ///

    showInformationTutorial = () => {
        let images = [
            {
                title:"Tutorial Form",
                path: tutorial_p0_1,
                position: 1
            },
            {
                title:"Test2",
                path: tutorial_p0_2,
                position: 2
            },
            {
                title:"Test3",
                path: tutorial_p0_3,
                position: 3
            },
            {
                title:"Test3",
                path: tutorial_p0_4,
                position: 4
            },
            {
                title:"Test2",
                path: tutorial_p0_5,
                position: 5
            },
            {
                title:"Test3",
                path: tutorial_p0_6,
                position: 6
            },
            {
                title:"Test3",
                path: tutorial_p0_7,
                position: 7
            }
        ];

        switch (this.props.state.main.position) {
            case 0:
                images = [
                    {
                        title:"form_0_1",
                        path: tutorial_p0_1,
                        position: 1
                    },
                    {
                        title:"form_0_2",
                        path: tutorial_p0_2,
                        position: 2
                    },
                    {
                        title:"form_0_3",
                        path: tutorial_p0_3,
                        position: 3
                    },
                    {
                        title:"form_0_4",
                        path: tutorial_p0_4,
                        position: 4
                    },
                    {
                        title:"form_0_5",
                        path: tutorial_p0_5,
                        position: 5
                    },
                    {
                        title:"form_0_6",
                        path: tutorial_p0_6,
                        position: 6
                    },
                    {
                        title:"form_0_7",
                        path: tutorial_p0_7,
                        position: 7
                    }
                ];
                console.log("case 0");
                break;
            case 1:
                images = [
                    {
                        title:"form_1_0",
                        path: tutorial_p1_0,
                        position: 1
                    },
                    {
                        title:"form_1_1",
                        path: tutorial_p1_1,
                        position: 1
                    },
                    {
                        title:"form_1_2",
                        path: tutorial_p1_2,
                        position: 2
                    },
                    {
                        title:"form_1_3",
                        path: tutorial_p1_3,
                        position: 3
                    },
                    {
                        title:"form_1_4",
                        path: tutorial_p1_4,
                        position: 4
                    },
                    {
                        title:"form_1_5",
                        path: tutorial_p1_5,
                        position: 5
                    },
                ];
                break;
            case 2:
                images = images = [
                    {
                        title:"form_1_0",
                        path: tutorial_p1_0,
                        position: 1
                    },
                ];
                break;
            case 3:
                images = "Something 3";
                break;
            default:
                console.log("main.position is null")
        }
        //Alert.alert("Information", message)
        this.setState(oldState => {
            return{
                ...oldState,
                tutorialData: images,
                showTutorial: true,
            }
        });
        // console.log("images test: " + JSON.stringify(images));
        // console.log("tutorialData: " + this.state.tutorialData)
    };

    handleShowTutorialToggler = (value) => {
      if(value){
          this.setState(oldState => {
              return{
                  ...oldState,
                  showTutorial:value
              }
          })
      }else{
          this.setState(oldState => {
              return{
                  ...oldState,
                  showTutorial: !oldState.showTutorial
              }
          })
      }
    };

    handleRemoveWelcomeScreen = (value) =>{
        if(value)
        {
            this.setState(oldState => {
                return{
                    ...oldState,
                    welcomeScreenVisible: value
                }
            })
        }else{
            this.setState(oldState => {
                return{
                    ...oldState,
                    welcomeScreenVisible: !oldState.welcomeScreenVisible
                }
            })
        }
    };

    handleSetPage = (pageNumber) => {
        console.log("should be changing page to: "+ pageNumber);
        this.viewPager.setPage(pageNumber);
    };

    indicatorPressedHandler = (pageNumber) => {
        console.log("HEY HEY HEY!");
        //if the page selected is different from current page
        if(pageNumber !== this.props.state.main.position) {
            //verifies if previous step has been completed
            let isDataNotNull = 0;
            if (pageNumber === 0) {
                isDataNotNull = this.props.state.main.Page0Data
            }
            if (pageNumber === 1) {
                isDataNotNull = this.props.state.main.Page0Data;
            }
            if (pageNumber === 2) {
                isDataNotNull = this.props.state.main.Page1Data
            }
            if (pageNumber === 3) {
                isDataNotNull = this.props.state.main.Page2Data
            }
            if (isDataNotNull) {
                this.viewPager.setPage(pageNumber);
                this.props.onChangePosition(pageNumber);
            }
        }
    };

    render(){
        const labels = ["Initial","T. Boxes","Weights"];
        const customStyles = {
            stepIndicatorSize: 19,
            currentStepIndicatorSize:25,
            separatorStrokeWidth: 2,
            currentStepStrokeWidth: 3,
            stepStrokeCurrentColor: '#4169e1',
            stepStrokeWidth: 3,
            stepStrokeFinishedColor: '#4169e1',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#4169e1',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#4169e1',
            stepIndicatorUnFinishedColor: '#ffffff',
            stepIndicatorCurrentColor: '#ffffff',
            stepIndicatorLabelFontSize: 13,
            currentStepIndicatorLabelFontSize: 13,
            stepIndicatorLabelCurrentColor: '#4169e1',
            stepIndicatorLabelFinishedColor: '#ffffff',
            stepIndicatorLabelUnFinishedColor: '#aaaaaa',
            labelColor: '#999999',
            labelSize: 13,
            currentStepLabelColor: '#4169e1'
        };

        const customStylesAdvancedOnly = {
            stepIndicatorSize: 15,
            currentStepIndicatorSize:25,
            separatorStrokeWidth: 2,
            currentStepStrokeWidth: 3,
            stepStrokeCurrentColor: '#4169e1',
            stepStrokeWidth: 3,
            stepStrokeFinishedColor: '#4169e1',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#4169e1',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#4169e1',
            stepIndicatorUnFinishedColor: '#ffffff',
            stepIndicatorCurrentColor: '#ffffff',
            stepIndicatorLabelFontSize: 0,
            currentStepIndicatorLabelFontSize: 0,
            stepIndicatorLabelCurrentColor: 'transparent',
            stepIndicatorLabelFinishedColor: 'transparent',
            stepIndicatorLabelUnFinishedColor: 'transparent',
            labelColor: 'transparent',
            labelSize: 13,
            currentStepLabelColor: 'transparent'
        };

        //SOURCE OF ERROR ON PAGE 3 IS HERE//
        if( typeof this.props.state.main.advanceTabAccessible !== "undefined" && this.props.state.main.position === 2 && !this.props.state.main.advanceTabAccessible){
            this.handleSetPage(2)
        }
        ////////////////////////////////////

        //console.log("this.props.state.main.indicatorVisibility: "+ this.props.state.main.indicatorVisibility);

        let indicatorHeight = (this.props.state.main.indicatorVisibility===1 || this.props.state.main.indicatorVisibility === undefined)?'90%':'100%';

        //console.log("indicator Height: "+ indicatorHeight);

        //console.log("formscreen patientsList: "+ JSON.stringify(this.props.state.main.patientsList));
        console.log("Update of FormScreenV2");

        return(
            <View style={styles.overTheIndicatorContainer}>
                <StatusBar
                    backgroundColor="#262626"
                    barStyle="light-content"
                />
                {this.props.state.main.position < 4 || this.props.state.main.position === undefined || this.props.state.main.position === null?
                    <View style={{flex:1}}>
                        <IndicatorViewPager
                            style={{height:indicatorHeight, width:"100%", bottom:0, left:0}}
                            indicatorOnTop={true}
                            horizontalScroll={false}
                            scrollEnabled={false}
                            ref={viewPager => { this.viewPager = viewPager; }}
                        >
                            <View>
                                <FormScreenInitial data={this.props.state.main.Page0Data} patientsList={this.props.state.main.patientsList} setPage={this.handleSetPage} Picker={Picker}/>
                            </View>
                            <View>
                                <FormScreenTimeZonage data={this.props.state.main.Page1Data} setPage={this.handleSetPage} Picker={Picker}/>
                            </View>
                            <View>
                                <FormScreenWeights data={this.props.state.main.Page2Data} advancedAllowed={this.props.state.main.advanceTabAccessible} setPage={this.handleSetPage} Picker={Picker}/>
                            </View>
                            {this.props.state.main.advanceTabAccessible ?
                                <View>
                                    <FormScreenAdvanced data={this.props.state.main.Page3Data} setPage={this.handleSetPage}/>
                                </View>
                                :<View style={{flex:1, alignItems:"center", justifyContent: "center"}}>
                                    <Text style={{fontSize: 40}}>
                                        Loading...
                                    </Text>
                                </View>
                            }
                        </IndicatorViewPager>
                        <View
                            style={[styles.indicatorContainer,{opacity: this.props.state.main.indicatorVisibility}]}
                            pointerEvents={this.props.state.main.indicatorVisibility===0?"none":"auto"}
                        >
                            <View style={this.props.state.main.advanceTabAccessible ?{ width:'80%'}: {width:'100%'}}>
                                <StepIndicator
                                    customStyles={customStyles}
                                    stepCount={3}
                                    currentPosition={this.props.state.main.position}
                                    labels={labels}
                                    onPress={this.indicatorPressedHandler}
                                />
                            </View>
                            {
                                this.props.state.main.advanceTabAccessible
                                    ?
                                    <View style={{ width:'20%'}}>
                                        <StepIndicator
                                            customStyles={customStylesAdvancedOnly}
                                            stepCount={1}
                                            currentPosition={this.props.state.main.position-3}
                                            labels={["Advanced"]}
                                            hidden={true}
                                            onPress={()=>{
                                                console.log("Dang");
                                                this.indicatorPressedHandler(3)
                                            }}
                                        />
                                    </View>
                                    :null

                            }
                        </View>
                    </View>
                    :<View style={{flex:1}}>
                        {this.props.state.main.position === 4?
                            <SendFormScreen
                                navigator = {this.props.navigator}
                            />
                            :
                            <View style={{flex:1, alignItems:"center", justifyContent: "center"}}>
                                <Text style={{fontSize: 40}}>
                                    Loading...
                                </Text>
                            </View>
                        }

                     </View>
                }
                {this.state.welcomeScreenVisible?
                    <View style={{position: "absolute", flex: 1, width: "100%", height: "100%"}}>
                        <WelcomeScreen
                            title={"Dr."}
                            name={this.props.state.main.linkedAccount.name}
                            showWelcomeScreen={this.state.welcomeScreenVisible}
                            removeWelcomeScreen = {this.handleRemoveWelcomeScreen}
                        />
                    </View>
                    :<View/>
                }
                {this.state.showTutorial
                    ?<View>
                        <TutorialPage
                            tutorialData={this.state.tutorialData}

                            handleShowTutorialToggler={this.handleShowTutorialToggler}
                        />
                    </View>
                    : <View/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formPageContainer:{
        flex:1,
        marginBottom: 80,
    },

    overTheIndicatorContainer:{
        flex:1,
        height: '100%'
    },
    indicatorContainer:{
        flex:1,
        flexDirection: "row",
        justifyContent:"center",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: '#FFF',
        paddingTop: 10,
        margin:0,

    },

});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (position) => dispatch(changePosition(position)),
        onToggleIndicator: (value) => dispatch(toggleIndicatorVisibility(value))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(FormScreen)