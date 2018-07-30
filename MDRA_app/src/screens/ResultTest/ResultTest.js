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


class ResultTest extends PureComponent{
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

        /*const data = [
            {
                month: new Date(2015, 0, 1),
                apples: 3840,
                bananas: 1920,
                cherries: 960,
                dates: 400,
            },
            {
                month: new Date(2015, 1, 1),
                apples: 1600,
                bananas: 1440,
                cherries: 960,
                dates: 400,
            },
            {
                month: new Date(2015, 2, 1),
                apples: 640,
                bananas: 960,
                cherries: 3640,
                dates: 400,
            },
            {
                month: new Date(2015, 3, 1),
                apples: 3320,
                bananas: 480,
                cherries: 640,
                dates: 400,
            },
        ];*/

        const data = [
            {
                hours: 0,
                h11: 5,
                h12: 6,
                h13: 7,
            },
            {
                hours: 1,
                h11: 5,
                h12: 6,
                h13: 7,
            },
            {
                hours: 2,
                h11: 5,
                h12: 6,
                h13: 7,
            }
        ];

        const colors = [ '#8800cc', '#aa00ff', '#cc66ff' ];
        const keys   = [ 'h11', 'h12', 'h13'];
        const svgs = [
            { onPress: () => console.log('apples') },
            { onPress: () => console.log('bananas') },
            { onPress: () => console.log('cherries') },
        ];


        return (
            <View style={{backgroundColor:"white"}}>
                <IndicatorViewPager
                    style={{height:'93%'}}
                    indicator={this._renderDotIndicator()}
                >
                    <View>
                        <View>
                            <View style={ { flexDirection: 'row', height: 200 } }>
                                <StackedAreaChart
                                    style={ { flex: 1 } }
                                    contentInset={ { top: 10, bottom: 10 } }
                                    data={ data }
                                    keys={ keys }
                                    colors={ colors }
                                    curve={ shape.curveNatural }
                                >
                                    <Grid direction={Grid.Direction.BOTH}/>
                                </StackedAreaChart>
                                <YAxis
                                    style={ { position: 'absolute', top: 0, bottom: 0 }}
                                    data={ StackedAreaChart.extractDataPoints(data, keys) }
                                    contentInset={ { top: 10, bottom: 10 } }
                                    svg={ {
                                        fontSize: 8,
                                        fill: 'white',
                                        stroke: 'black',
                                        strokeWidth: 0.1,
                                        alignmentBaseline: 'baseline',
                                        baselineShift: '3',
                                    } }
                                />
                            </View>
                            <XAxis data={StackedAreaChart.extractDataPoints(data,keys)}
                                   svg={ {
                                        fontSize: 8,
                                        fill: 'white',
                                        stroke: 'black',
                                        strokeWidth: 0.1,
                                        alignmentBaseline: 'baseline',
                                        baselineShift: '3',
                                   } }
                            />
                            <View style={{bottom: '200%', left: '0%'}}>
                                <Draggable
                                    reverse={false}
                                    renderColor='red'
                                    renderShape='square'
                                    offsetX={0}
                                    offsetY={0}
                                    renderText=''
                                    borderOnly={true}
                                />
                            </View>
                        </View>
                        <BarChart
                        style={{ flex: 1, marginLeft: 8, height: '50%' }}
                        data={this.props.state.main
                            .resultsList[this.state.currentPosition].data}
                        horizontal={true}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        yMin={0}
                        yMax={100}
                        xMax={6}
                        gridMin={0}
                        animate={true}

                        >
                            <Grid direction={Grid.Direction.BOTH}/>
                        </BarChart>

                        <Draggable
                            renderSize={56}
                            renderColor='black'
                            offsetX={-100}
                            offsetY={-200}
                            pressDrag={()=>alert('touched!!')}
                            borderOnly={true}
                            borderWidth={5}
                        />
                    </View>
                    <View>
                        <PieChart data={pieData} style={{height: 200, margin: 10}} />
                        <PieChart data={pieData} style={{height: 200}} />
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

export default connect(mapStateToProps)(ResultTest);