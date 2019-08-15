//system imports
import React, {Component} from 'react';
import {View, Button, StyleSheet, Dimensions, Text, Animated, TouchableWithoutFeedback, Platform} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
//components
import CustomMarker from '../../components/CustomMarker/CustomMarker';

//functions
import timeToAmPmFormat from '../../functions/timeToAmPmFormat'
import {convertTimeToHourFormat} from '../../functions/FormatTime';

class CustomTimeMultiSlider extends Component{

    state= {
        numberOfDots: 1,
        showScreen: false,
        selectedDot: 1,
        screenOpacityAnimation: new Animated.Value(0.3),
        secondScreenVisible: !!this.props.values[1],
        valuesArray: this.props.values,
        enableAmPm: true
    };

    componentWillReceiveProps(nextProps) {
        this.setState(
            (oldState) =>{
                return {
                    ...oldState,
                    valuesArray: nextProps.values,
                    enableAmPm: this.props.enableAmPm === null || typeof this.props.enableAmPm === "undefined"?oldState.enableAmPm:this.props.enableAmPm
                }
            }
        );
    }


    shouldComponentUpdate(nextProps) {
        return (
            JSON.stringify(this.props.values) !== JSON.stringify(nextProps.values) || //if values aren't the same or
            this.props.max !== nextProps.max || //if next max is different than current max
            this.props.min !== nextProps.min || //if next min is different
            JSON.stringify(this.state.valuesArray) !== JSON.stringify(this.props.values) //if local values is different than current props values
        );
    }


    _handlesOnValueChangeStart = () => {
        Animated.timing(this.state.screenOpacityAnimation,{
            toValue: 1,
            duration: 150,
            useNativeDriver: true
        }).start()
    };

    _handlesOnValueChangeFinish = () => {
        Animated.timing(this.state.screenOpacityAnimation,{
            toValue: 0.3,
            duration:400,
            useNativeDriver: true
        }).start()
    };

    render(){
        //console.log(this.generateDataSingle(this.props.data.percentile10));
        console.log("test for render")
        let isAndroid = Platform.OS === 'android';

        let enableAmPm = this.state.enableAmPm;

        return(
            <View style={[this.props.style, styles.containerStyle]}>
                <MultiSlider
                    containerStyle={{padding:0, height:40,marginBottom:0}}
                    trackStyle={{padding:0,marginBottom:0}}
                    selectedStyle={{backgroundColor:"blue"}}
                    sliderLength={this.props.sliderLength}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    values={this.props.values}
                    onValuesChangeStart={this._handlesOnValueChangeStart}
                    onValuesChange={
                        (values) => {
                            this.setState(
                                (oldState)=>{
                                    return {
                                        ...oldState,
                                        valuesArray: values,
                                    }

                                }
                            )
                        }
                    }
                    onValuesChangeFinish={
                        (values) => {
                            console.log("CustomMultiSlider changing value: "+ values);
                            this._handlesOnValueChangeFinish();
                            this.props.onValuesChange(this.state.valuesArray);

                        }
                    }
                    allowOverlap={false}
                    snapped={true}
                    touchDimensions={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        slipDisplacement: 40,
                    }}

                    isMarkersSeparated={isAndroid}

                    customMarkerLeft={(e) => {
                        if(isAndroid)
                            return (<CustomMarker
                                currentValue={e.currentValue}/>);
                        else
                            return null;
                    }}

                    customMarkerRight={(e) => {
                        if(isAndroid)
                            return (<CustomMarker
                                currentValue={e.currentValue}/>);
                        else
                            return null;

                    }}
                />
                <View style={styles.rulerStyle}>
                    <Text>
                        {timeToAmPmFormat(
                            convertTimeToHourFormat(this.props.min+"")
                        )}
                    </Text>
                    <View
                        style={[styles.spacingStyle,{width: (enableAmPm?this.props.sliderLength/8:this.props.sliderLength/3)}]}
                    />
                    <TouchableWithoutFeedback
                        onTouch={() => alert("This does not change the values. " +
                            "Please modify the values at the corresponding Start Time and End Time " +
                            "of each corresponding section.")}>
                        <View>

                                <Animated.View style={[
                                    styles.animatedContainerStyle,
                                    {
                                        opacity: this.state.screenOpacityAnimation,
                                        width: enableAmPm?this.props.sliderLength/2:this.props.sliderLength/3,
                                        borderRadius:20,
                                        borderWidth: 1,
                                        backgroundColor:"#EEE"

                                    },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.rulerPercentContainer,
                                            this.state.valuesArray[1]
                                                ?{width:"50%",borderRightWidth:1, alignItems:"center", justifyContent:"center"}
                                                :{width:"100%", alignItems:"center", justifyContent: "center"},
                                        ]}
                                    >
                                        <Text numberOfLines={1} style={{flexWrap: 'wrap', textAlign: "center"}}>
                                            {
                                                enableAmPm
                                                    ?timeToAmPmFormat(
                                                        convertTimeToHourFormat((this.state.valuesArray[0]?parseFloat(this.state.valuesArray[0]).toFixed(1):0)+"")

                                                    )
                                                    :(this.state.valuesArray[1]?parseFloat(this.state.valuesArray[1]).toFixed(1):0)
                                            }
                                        </Text>
                                    </View>
                                    {this.state.secondScreenVisible
                                        ? <View style={[styles.rulerPercentContainer,{width:"50%", alignItems:"center"}]}>
                                            <Text numberOfLines={1} style={{flexWrap: 'wrap', textAlign:"center"}}>
                                                {
                                                    enableAmPm
                                                        ?timeToAmPmFormat(
                                                            convertTimeToHourFormat((this.state.valuesArray[1]?parseFloat(this.state.valuesArray[1]).toFixed(1):0)+"")
                                                         )
                                                        :(this.state.valuesArray[1]?parseFloat(this.state.valuesArray[1]).toFixed(1):0)
                                                }
                                            </Text>
                                        </View>
                                        : <View/>
                                    }
                                </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View
                        style={[styles.spacingStyle, {width: (enableAmPm?this.props.sliderLength/8:this.props.sliderLength/3)}]}
                    />
                    <Text>
                        {timeToAmPmFormat(
                                convertTimeToHourFormat(this.props.max+"")
                        )}
                    </Text>
                </View>

            </View>
        )
    }


}

const styles = StyleSheet.create({
    rulerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    containerStyle: {
        alignItems: 'center'
    },

    rulerPercentContainer: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderColor: 'black',
        flexDirection: "row",
        alignItems:"center"
    },

    animatedContainerStyle: {
        flexDirection:"row",
        alignItems: 'center'
    },

    spacingStyle: {
        borderBottomColor: 'transparent',
        borderBottomWidth: 1,
        backgroundColor: "transparent"
    },

});

export default (CustomTimeMultiSlider);