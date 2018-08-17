import React, {PureComponent} from 'react';
import {View, Button, StyleSheet, Text, ScrollView, Dimensions, Platform} from 'react-native';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'

//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie_small.png';

//redux imports
import {connect} from 'react-redux';

//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import PieChartComponent from '../../components/ResultPage_PieChartsComponent/PieChartsComponent';

class ResultPage extends PureComponent {
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
        orientation: true, //portrait true, landscape false
    };

    _renderTabIndicator = () => {
        return (
            <PagerTabIndicator
                tabs={
                    [
                        {
                            text: 'Area',
                            iconSource: areaImage,
                            selectedIconSource: areaImage
                        },
                        {
                            text: 'Pie',
                            iconSource: pieImage,
                            selectedIconSource: pieImage
                        }
                    ]
                }
                iconStyle={{height:30, width:30}}
                selectedIconStyle={{height:40, width:40}}
            />
        )
    };

    
    _renderTitleIndicator = () => {
        return <PagerTabIndicator titles={['Area', 'Pie']}/>
    };
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
            <View style={{backgroundColor:"#AAA", flex: 1}}>
                <IndicatorViewPager
                    style={{height:'93%', width:"100%"}}
                    indicator={this._renderTabIndicator()}
                    indicatorOnTop={true}
                >
                    <View>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}
                        >
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

export default connect(mapStateToProps,null)(ResultPage);