import React, {PureComponent} from 'react';
import {View, Button, StyleSheet, Dimensions, Text} from 'react-native';
import 'react-native-svg';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

class CustomMultiSlider extends PureComponent{

    state= {
        numberOfDots: 1,
        showScreen: false,
        valuesArray:[this.props.max],
        selectedDot: 1,
        screenOpacity: 0
    };

    render(){
        //console.log(this.generateDataSingle(this.props.data.percentile10));
        return(
            <View style={[this.props.style, styles.containerStyle]}>
                {this.state.showScreen
                    ?this.state.numberOfDots===2
                        ?<View style={styles.rulerPercentContainer}>
                            <Text>{this.state.valuesArray[0]}</Text><Text>{this.state.valuesArray[1]}</Text>
                        </View>
                        :<View style={styles.rulerPercentContainer}>
                            <Text>{this.state.valuesArray[0]}</Text><Text>{this.state.valuesArray[1]}</Text>
                        </View>
                    :<View/>
                }
                <MultiSlider
                    containerStyle={{padding:0, marginBottom:0}}
                    trackStyle={{padding:0, marginBottom:0}}
                    sliderLength={this.props.sliderLength}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    values={this.props.values}
                    onValuesChange={
                        (values) => {
                            this.setState((oldState) => {
                                return (
                                    {
                                        ...oldState,
                                        valuesArray: values,
                                        showScreen: true
                                    }
                                );
                            })
                        }
                    }
                    onValuesChangeFinish={
                        () => {
                            this.setState((oldState) => {
                                return (
                                    {
                                        ...oldState,
                                        showScreen: false
                                    }
                                );
                            });
                            this.props.onValuesChange(this.state.valuesArray)
                        }
                    }
                />
                <View style={styles.rulerStyle}>
                    <Text>{this.props.min}</Text>
                    {
                        <View
                            style={{
                                borderBottomColor: 'transparent',
                                borderBottomWidth: 1,
                                width: this.props.sliderLength,
                            }}
                        />
                    }
                    <Text>{this.props.max}</Text>
                </View>

            </View>
        )
    }


}

const styles = StyleSheet.create({
    rulerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    containerStyle: {
        alignItems: 'center'
    },

    rulerPercentContainer: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5
    }
});

export default (CustomMultiSlider);