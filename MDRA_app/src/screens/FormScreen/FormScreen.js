//Base imports
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Button} from 'react-native';
import {connect} from 'react-redux'
//Package Imports
import StepIndicator from 'react-native-step-indicator'

//Screen Imports
import FormScreenInitial from '../FormScreen1_initial/FormScreen_initial';
import FormScreenTimeZonage from '../FormScreen2_timeZonage/FormScreen_timeZonage';
import FormScreenWeights from '../FormScreen3_weights/FormScreen_weights';
import FormScreenAdvanced from '../FormScreen4_advanced/FormScreen_advanced';
import {addData} from "../../store/actions/addData";



class FormScreen extends Component{
    state = {

    };

    constructor(props){
        super(props);
    }

    _screenSelector = () =>{
        console.log('fuck' + Dimensions.get('window').height);
        console.log(this.props.state.main.position);
        switch (this.props.state.main.position){
          case 0:
              return(<FormScreenInitial/>);
          case 1:
              return(<FormScreenTimeZonage/>);
          case 2:
              return(<FormScreenWeights/>);
          case 3:
              return(<FormScreenAdvanced/>);
          default:
              //do nothing
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
                {this._screenSelector()}
                <View style={styles.indicatorContainer}>
                    <View style={this.props.state.main.position >=3 ?{ width:'80%'}: {width:'100%'}}>
                    <StepIndicator
                        customStyles={customStyles}
                        stepCount={3}
                        currentPosition={this.props.state.main.position}
                        labels={labels}

                    />
                    </View>
                    {
                        this.props.state.main.position >= 3
                        ?
                            <View style={{ width:'20%'}}>
                                <StepIndicator
                                    customStyles={customStylesAdvancedOnly}
                                    stepCount={1}
                                    currentPosition={this.props.state.main.position-3}
                                    labels={["Advanced"]}
                                    hidden={true}
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
    overTheIndicatorContainer:{
        flex:1,
        height: '100%'
    },
    indicatorContainer:{
        flex:1,flexDirection: "row",
        justifyContent:"space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(FormScreen)