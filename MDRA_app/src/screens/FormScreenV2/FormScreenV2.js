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
    Alert} from 'react-native';
import {connect} from 'react-redux';

import {PagerDotIndicator, IndicatorViewPager} from 'rn-viewpager'
//Package Imports
import StepIndicator from 'react-native-step-indicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

//Screen Imports
import FormScreenInitial from '../FormScreen1_initial/FormScreen_initialV2';
import FormScreenTimeZonage from '../FormScreen2_timeZonage/FormScreen_timeZonage';
import FormScreenWeights from '../FormScreen3_weights/FormScreen_weights';
import FormScreenAdvanced from '../FormScreen4_advanced/FormScreen_advanced';
import SendFormScreen from '../SendFormScreen/SendFormScreen';
import {addData, changePosition} from "../../store/actions/index";


class FormScreen extends Component{

    handleBackButton = () => {
        if(this.props.state.main.position === 0)Alert.alert(
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    };

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "right"
                });
            }
        }
    };

    handleSetPage = (pageNumber) => {
        console.log("should be changing page");
        this.viewPager.setPage(pageNumber);
    };


    indicatorPressedHandler = (pageNumber) => {
        //if the page selected is different from current page
        if(pageNumber !== this.props.state.main.position) {
            let isDataNotNull = 0;
            if (pageNumber === 0) {
                isDataNotNull = this.props.state.main.Page0Data
            }
            if (pageNumber === 1) {
                isDataNotNull = this.props.state.main.Page1Data;
            }
            if (pageNumber === 2) {
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
            stepStrokeCurrentColor: '#fe7013',
            stepStrokeWidth: 3,
            stepStrokeFinishedColor: '#fe7013',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#fe7013',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#fe7013',
            stepIndicatorUnFinishedColor: '#ffffff',
            stepIndicatorCurrentColor: '#ffffff',
            stepIndicatorLabelFontSize: 13,
            currentStepIndicatorLabelFontSize: 13,
            stepIndicatorLabelCurrentColor: '#fe7013',
            stepIndicatorLabelFinishedColor: '#ffffff',
            stepIndicatorLabelUnFinishedColor: '#aaaaaa',
            labelColor: '#999999',
            labelSize: 13,
            currentStepLabelColor: '#fe7013'
        };

        const customStylesAdvancedOnly = {
            stepIndicatorSize: 15,
            currentStepIndicatorSize:25,
            separatorStrokeWidth: 2,
            currentStepStrokeWidth: 3,
            stepStrokeCurrentColor: '#fe7013',
            stepStrokeWidth: 3,
            stepStrokeFinishedColor: '#fe7013',
            stepStrokeUnFinishedColor: '#aaaaaa',
            separatorFinishedColor: '#fe7013',
            separatorUnFinishedColor: '#aaaaaa',
            stepIndicatorFinishedColor: '#fe7013',
            stepIndicatorUnFinishedColor: '#ffffff',
            stepIndicatorCurrentColor: '#ffffff',
            stepIndicatorLabelFontSize: 0,
            currentStepIndicatorLabelFontSize: 0,
            stepIndicatorLabelCurrentColor: '#fe7013',
            stepIndicatorLabelFinishedColor: '#ffffff',
            stepIndicatorLabelUnFinishedColor: '#aaaaaa',
            labelColor: '#999999',
            labelSize: 13,
            currentStepLabelColor: '#fe7013'
        };

        return(
            <View style={styles.overTheIndicatorContainer}>
                {this.props.state.main.position < 4 || undefined?
                    <View style={{flex:1}}>
                        <IndicatorViewPager
                            style={{height:'90%', width:"100%"}}
                            indicatorOnTop={true}
                            horizontalScroll={false}
                            scrollEnabled={false}
                            ref={viewPager => { this.viewPager = viewPager; }}
                        >
                            <View>
                                <ScrollView>
                                    <KeyboardAwareScrollView>
                                        <FormScreenInitial data={this.props.state.main.Page0Data} setPage={this.handleSetPage}/>
                                    </KeyboardAwareScrollView>
                                </ScrollView>
                            </View>
                            <View>
                                <FormScreenTimeZonage data={this.props.state.main.Page1Data} setPage={this.handleSetPage}/>
                            </View>
                            <View>
                                <FormScreenWeights data={this.props.state.main.Page2Data} advancedAllowed={this.props.state.main.advanceTabAccessible} setPage={this.handleSetPage}/>
                            </View>
                            {this.props.state.main.advanceTabAccessible ?
                                <View style={{flex:1}}>
                                    <FormScreenAdvanced data={this.props.state.main.Page3Data} setPage={this.handleSetPage}/>
                                </View>
                                :null
                            }
                        </IndicatorViewPager>
                        <View style={styles.indicatorContainer}>
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
                                            onPress={()=>{console.log("Dang")}}
                                        />
                                    </View>
                                    :null

                            }
                        </View>
                    </View>
                    :<View style={{flex:1}}>
                            <SendFormScreen/>
                     </View>
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
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(FormScreen)