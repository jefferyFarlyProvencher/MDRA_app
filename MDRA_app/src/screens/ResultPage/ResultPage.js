import React, {PureComponent} from 'react';
import {View, Button, StyleSheet, Text, ScrollView, Dimensions, Platform} from 'react-native';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager'

import Draggable from 'react-native-draggable';

import {connect} from 'react-redux';

import Slider from '../../components/CustomMultiSlider/CustomMultiSlider';

import {VictoryContainer} from "victory-native";

import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import PieChartComponent from '../../components/ResultPage_PieChartsComponent/PieChartsComponent';

class ResultPage extends PureComponent{
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
        orientation:true, //portrait true, landscape false
    };

    _renderDotIndicator() {
        return <PagerDotIndicator
            pageCount={2}
            selectedDotStyle={{backgroundColor:"black"}}
        />;
    }
    _handleOnPress2 = () => {
        if(this.state.currentPosition!==0) {
            console.log("changing pos back");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition - 1,
                })
            })

        }else{
            console.log("next should be disabled")
        }
    };

    _handleOnPress = () => {
        if(this.state.currentPosition<this.state.listLength-1) {
            console.log("changing pos");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition + 1,
                })
            })

        }else{
            console.log("next should be disabled")
        }
    };



    render() {

        return (
            <View style={{backgroundColor:"#AAA"}}>
                <IndicatorViewPager
                    style={{height:'93%'}}
                    indicator={this._renderDotIndicator()}
                >
                    <View>
                        <ScrollView>
                            <View style={{alignItems:'center',justifyContent:"center"}}>
                                <Text>Area Charts</Text>
                                <GraphComponent
                                    data={this.props.state.main.resultsList[this.state.currentPosition].data}
                                    style={{backgroundColor:"white"}}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={this.state.orientation?styles.pieChartStylesPortrait:styles.pieChartStylesLandscape}>
                                <Text>Pie Charts</Text>
                                <PieChartComponent
                                    data={this.props.state.main.resultsList[this.state.currentPosition].data}
                                    style={{backgroundColor:"white"}}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </IndicatorViewPager>
                <View style={{flexDirection:"row", justifyContent:'center'}}>
                    <Button
                        title="Go back"
                        onPress={this._handleOnPress2}
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        large
                    />
                    <Button
                        title="Go next"
                        onPress={this._handleOnPress}
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                        large
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 300
    },

    pieChartStylesPortrait: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    pieChartStylesLandscape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps)(ResultPage);