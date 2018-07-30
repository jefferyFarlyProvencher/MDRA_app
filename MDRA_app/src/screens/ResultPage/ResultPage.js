import React, {PureComponent} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager'

import * as shape from 'd3-shape'
import * as scale from 'd3-scale'

import {G,Svg,Path,Rect,Text,Line} from 'react-native-svg'

import Draggable from 'react-native-draggable';

import {connect} from 'react-redux';

import {BarChart, Grid, PieChart, StackedAreaChart,XAxis, YAxis} from 'react-native-svg-charts';

import Slider from '../../components/CustomMultiSlider/CustomMultiSlider'


class ResultPage extends PureComponent{
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
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

        const randomColor = () =>
            ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

        const pieData = this.props.state.main
            .resultsList[this.state.currentPosition].data
            .filter(value => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }));



        return (
            <View style={{backgroundColor:"white"}}>
                <IndicatorViewPager
                    style={{height:'93%'}}
                    indicator={this._renderDotIndicator()}
                >
                    <View>
                        <Text>Area Charts</Text>
                    </View>
                    <View>
                        <Text>Pie Charts</Text>
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
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps)(ResultPage);