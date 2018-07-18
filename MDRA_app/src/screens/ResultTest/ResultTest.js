import React, {PureComponent} from 'react';
import {View, Button} from 'react-native';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager'

import * as shape from 'd3-shape'

import Draggable from 'react-native-draggable';

import {connect} from 'react-redux';

import {BarChart, Grid, PieChart, StackedAreaChart} from 'react-native-svg-charts';

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

        const data = [
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
        ];

        const colors = [ '#8800cc', '#aa00ff', '#cc66ff', '#eeccff' ]
        const keys   = [ 'apples', 'bananas', 'cherries', 'dates' ]
        const svgs = [
            { onPress: () => console.log('apples') },
            { onPress: () => console.log('bananas') },
            { onPress: () => console.log('cherries') },
            { onPress: () => console.log('dates') },
        ];


        return (
            <View style={{backgroundColor:"white"}}>
                <IndicatorViewPager
                    style={{height:'93%'}}
                    indicator={this._renderDotIndicator()}
                >
                    <View style={{
                        flexDirection: 'column',
                        height: '10%',
                        paddingVertical: 16 }}
                    >

                        <StackedAreaChart
                            style={ { height: 200, paddingVertical: 16 } }
                            data={ data }
                            keys={ keys }
                            colors={ colors }
                            curve={ shape.curveNatural }
                            showGrid={ false }
                            svgs={ svgs }
                            animate={true}
                        >
                            <Grid direction={Grid.Direction.VERTICAL}/>
                        </StackedAreaChart>
                        <BarChart
                        style={{ flex: 1, marginLeft: 8, height: '50%' }}
                        data={this.props.state.main
                            .resultsList[this.state.currentPosition].data}
                        horizontal={true}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        gridMin={0}
                        animate={true}
                    >
                        <Grid direction={Grid.Direction.VERTICAL}/>
                    </BarChart>
                        <Draggable
                            reverse={false}
                            renderColor='red'
                            renderShape='circle'
                            offsetX={0}
                            offsetY={-300}
                            renderText='B'
                            borderOnly={true}
                        />
                        <Draggable
                            renderSize={56}
                            renderColor='black'
                            offsetX={-100}
                            offsetY={-200}
                            renderText='A'
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
                <Button
                    title="Go next"
                    onPress={this._handleOnPress}
                    disabled={
                        this.state.listLength<1 ||
                        this.state.currentPosition > this.state.listLength-2
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps)(ResultTest);