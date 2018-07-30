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

    render() {

        const randomColor = () =>
            ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

        /*
        if (isNaN(characNRAM)) {
          pieDataset.D1 = [0, 0, 0, 0, 0, 0];
         } else {
          pieDataset.D1 = [characNRAM, characNRRAM, characRAM, characRARAM, characARAM, characNRRARAM];
         }

         if (isNaN(characNR)) {
           pieDataset.D2 = [0, 0, 0, 0, 0, 0];
         } else {
           if (drawPieD2) {
              pieDataset.D2 = [characNR, characNRR, characR, characRAR, characAR, characNRRAR];
           } else {
              pieDataset.D1 = [characNR, characNRR, characR, characRAR, characAR, characNRRAR];
              pieDataset.D2 = [0, 0, 0, 0, 0, 0];
           }
         }

         if (isNaN(characNRNuit)) {
          pieDataset.E = [0, 0, 0, 0, 0, 0];
         } else {
          pieDataset.E  = [characNRNuit, characNRRNuit, characRNuit, characRARNuit, characARNuit, characNRRARNuit];
         }
         */


        const pieData1 = this.props.state.main
            .resultsList[this.state.currentPosition].data.
            .filter(value => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie1-${index}`,
            }));

        const pieData2 = this.props.state.main
            .resultsList[this.state.currentPosition].data.
            .filter(value => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie1-${index}`,
            }));

        return(
            <View>
                <PieChart data={pieData1} style={{height: 200, margin: 10}} />
                <PieChart data={pieData2} style={{height: 200}} />
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