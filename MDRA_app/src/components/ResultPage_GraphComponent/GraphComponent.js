import React, {PureComponent} from 'react';
import {View, Button, StyleSheet, Dimensions} from 'react-native';
import 'react-native-svg';

import {VictoryArea, VictoryChart, VictoryLine} from "victory-native";
import Draggable from 'react-native-draggable';



class GraphComponent extends PureComponent{
    state = {
        animationTime:1000
    };

    therapeuticBoxFormatter = (score) => {
        if (parseFloat(score) >= 80) {
            return('#C2C822');
        } else if (parseFloat(score) >= 65){
            return('#F6922D');
        } else {
            return('#ED5F6D');
        }
    };

    generateDataSingle = (scoreTable) => {
        let returnResult = [];
        for(let i = 0; i < scoreTable.length-1; i+=3){
            returnResult.push({x:i/10, y:parseFloat(scoreTable[i])});
        }
        return returnResult;
    };

    generateDataDouble = (scoreTableY,scoreTableY0) => {
        let returnResult = [];
        for(let i = 0; i < scoreTableY.length-1; i+=3){
            returnResult.push({x:i/10, y:parseFloat(scoreTableY[i]),y0:parseFloat(scoreTableY0[i])});
        }
        //console.log("RETURN RESULT: "+ JSON.stringify(returnResult));
        return returnResult;
    };

    generateSquareTopLeft = (x,y,height,width) => {
        let square = [{x:x,y:y}];
        //left side
        for(let i = 1; i < height+1; i++)
        {
            square.push({x:x,y:y+i})
        }
        //top
        for(let i = 1; i < width+1; i++)
        {
            square.push({x:x+i,y:y+height})
        }
        return square;
    };
    generateSquareBottomRight = (x,y,height,width) =>{
        let square = [{x:x,y:y}];
        //top
        for(let i = 1; i < width+1; i++)
        {
            square.push({x:x+i,y:y})
        }
        for(let i = 0; i < height+1; i++)
        {
            square.push({x:x+width,y:y+i});
        }
        return square;//right

    };
    render(){
        //console.log(this.generateDataSingle(this.props.data.percentile10));
        return(
            <View style={[this.props.style]}>
                <VictoryChart
                    //animate={{ duration: this.state.animationTime}}
                    domain={{x:[0,30], y: [0,25]}}
                >
                    <VictoryArea
                        style={{data: {fill: '#cbe3f3'}}}
                        data={this.generateDataDouble(this.props.data.percentile10, this.props.data.percentile90)}
                    />
                    <VictoryArea
                        style={{data: {fill: '#a7cfeb'}}}
                        data={this.generateDataDouble(this.props.data.percentile20, this.props.data.percentile80)}
                    />
                    <VictoryArea
                        style={{data: {fill: '#8dc1e5'}}}
                        data={this.generateDataDouble(this.props.data.percentile30, this.props.data.percentile70)}
                    />
                    <VictoryArea
                        style={{data: {fill: '#7bb7e1'}}}
                        data={this.generateDataDouble(this.props.data.percentile40, this.props.data.percentile60)}
                    />
                    <VictoryLine
                        style={{data: {stroke: '#4c92cd'}}}
                        data={this.generateDataSingle(this.props.data.percentileY)}
                    />

                    <VictoryLine
                        style={{data:{stroke:this. therapeuticBoxFormatter(80)}}}
                        data={this.generateSquareTopLeft(1,3,14,10)}
                    />
                    <VictoryLine
                        style={{data:{stroke:this. therapeuticBoxFormatter(80)}}}
                        data={this.generateSquareBottomRight(1,3,14,10)}
                    />
                    <VictoryLine
                        style={{data:{stroke:this. therapeuticBoxFormatter(80)}}}
                        data={this.generateSquareTopLeft(20,0,6,2)}
                    />
                    <VictoryLine
                        style={{data:{stroke:this. therapeuticBoxFormatter(80)}}}
                        data={this.generateSquareBottomRight(20,0,6,2)}
                    />
               </VictoryChart>
                <View style={{backgroundColor:'transparent', height:'100%', width:'100%',position:"absolute" ,left:0, top:0}}/>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 300
    }
});

export default (GraphComponent);