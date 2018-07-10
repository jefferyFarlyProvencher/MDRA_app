//Base imports
import React, {Component} from 'react';
import {View,ScrollView, Text, StyleSheet, Modal, Button} from 'react-native';
import {connect} from 'react-redux';
import { Navigation } from 'react-native-navigation';
//Package Imports
import StepIndicator from 'react-native-step-indicator';

//Screen Imports
import FormScreenInitial from '../FormScreen1_initial/FormScreen_initial';
import FormScreenTimeZonage from '../FormScreen2_timeZonage/FormScreen_timeZonage';
import FormScreenWeights from '../FormScreen3_weights/FormScreen_weights';
import FormScreenAdvanced from '../FormScreen4_advanced/FormScreen_advanced';
import SendFormScreen from '../SendFormScreen/SendFormScreen';
import {addData, changePosition} from "../../store/actions/index";



class FormScreen extends Component{
    constructor(props){
        super(props);
    }

    _screenSelector = () =>{
        console.log(this.props.state.main.position);
        switch (this.props.state.main.position){
            case 0:
                return(<FormScreenInitial data={this.props.state.main.Page0Data}/>);
            case 1:
                return(<FormScreenTimeZonage data={this.props.state.main.Page1Data}/>);
            case 2:
                return(<FormScreenWeights data={this.props.state.main.Page2Data} advancedAllowed={this.props.state.main.advanceTabAccessible}/>);
            case 3:
                return(<FormScreenAdvanced data={this.props.state.main.Page3Data}/>);
            case 4:
                return(<SendFormScreen/>)
            default:
              //do nothing
        }
    };

    indicatorPressedHandler = (pageNumber) => {
        console.log(pageNumber);
        //if the page selected is different from current page
        if(pageNumber !== this.props.state.main.position) {
            isDataNotNull = 0;
            if (pageNumber === 0) {
                isDataNotNull = this.props.state.main.Page0Data
            }
            if (pageNumber === 1) {
                isDataNotNull = this.props.state.main.Page1Data;
            }
            if (pageNumber === 2) {
                isDataNotNull = this.props.state.main.Page2Data
            }
            if (isDataNotNull)
                this.props.onChangePosition(pageNumber)
        }
    };

    render(){
        const labels = ["Initial","Time Zonage","Weights"];
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
                <ScrollView contentContainerStyle={{flexGrow:1}}>
                    <View style={styles.formPageContainer}>
                        {this._screenSelector()}
                    </View>
                </ScrollView>
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
        justifyContent:"space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: '#FFF',
        paddingTop: 5,
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