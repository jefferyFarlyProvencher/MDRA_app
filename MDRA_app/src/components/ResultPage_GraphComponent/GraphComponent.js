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
        //identifies the lateral translation required for the graph
        let startXPosition = this.findStartXPosition();

        let returnResult = [];
        for(let i = 0; i < scoreTable.length-1; i+=3){
            returnResult.push({x:(i/10)+startXPosition, y:parseFloat(scoreTable[i])});
        }
        return returnResult;
    };

    //generates the couples used for the tracing of the area graph
    generateDataDouble = (scoreTableY,scoreTableY0) => {
        //identifies the lateral translation required for the graph
        let startXPosition = this.findStartXPosition();

        let returnResult = [];
        for(let i = 0; i < scoreTableY.length-1; i+=3){
            returnResult.push({x:((i/10)+startXPosition), y:parseFloat(scoreTableY[i]),y0:parseFloat(scoreTableY0[i])});
        }
        //console.log("RETURN RESULT: "+ JSON.stringify(returnResult));
        return returnResult;
    };

    //generates the data used to trace the line for the top corner of the rectangles
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
    //generates the data used to trace the line for the bottom corner of the rectangles
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

    //finds the x position at which the graph tracing will start
    findStartXPosition = () =>
    {
        let currentEarliestAdminTime = parseInt(this.props.formData[0].adminTime0);
        let pillQuantity = parseInt(this.props.formData[0].amountOfPills);
        let otherAdminTime = null;
        if(pillQuantity > 1){
             otherAdminTime = parseInt(this.props.formData[0].adminTime1);
            if(currentEarliestAdminTime > otherAdminTime)
            {
                currentEarliestAdminTime = otherAdminTime;
            }
        }
        if(pillQuantity > 2){
            otherAdminTime = parseInt(this.props.formData[0].adminTime2);
            if(currentEarliestAdminTime > otherAdminTime)
            {
                currentEarliestAdminTime = otherAdminTime;
            }
        }
        if(pillQuantity > 3){
            otherAdminTime = parseInt(this.props.formData[0].adminTime3);
            if(currentEarliestAdminTime > otherAdminTime)
            {
                currentEarliestAdminTime = otherAdminTime;
            }
        }

        //console.log("Current earliest time:" + currentEarliestAdminTime);
        return currentEarliestAdminTime;
    };

    render(){
        //console.log(this.generateDataSingle(this.props.data.percentile10));
        //setting advanced page data if null
        let advancedPageData = this.props.formData[3]
            ? this.props.formData[3]
            : {
                numberOfSimulations: '1000',
                tsTimeHalfDayAM: '8',
                teTimeHalfDayAM: '12',
                tsTimeHalfDayPM: '12',
                teTimeHalfDayPM: '16',
                cMinTheraputicHalfDayAM: '6',
                cMaxTheraputicHalfDayAM: '20',
                cMinTheraputicDayPM: '6',
                cMaxTheraputicDayPM: '20',
                cMinTheraputicEvening: '0',
                cMaxTheraputicEvening: '6',
                threshold: '80'
            };
        //PREPERATION
        //Boxes
        //first box
        let firstBoxX = parseFloat(this.props.formData[1].tsDay);
        let firstBoxY = null;
        let firstBoxWidth = parseFloat(this.props.formData[1].teDay)-parseFloat(this.props.formData[1].tsDay);
        let firstBoxHeight = null;
        //secondBox
        let secondBoxX = parseFloat(this.props.formData[1].tsPM);
        let secondBoxY = null;
        let secondBoxWidth = parseFloat(this.props.formData[1].tePM)-parseFloat(this.props.formData[1].tsPM);
        let secondBoxHeight = null;
        //eveningBox
        let eveningBoxX = parseFloat(this.props.formData[1].tsEvening);
        let eveningBoxY = parseFloat(advancedPageData.cMinTheraputicEvening);
        let eveningBoxWidth = parseFloat(this.props.formData[1].teEvening)-parseFloat(this.props.formData[1].tsEvening);
        let eveningBoxHeight = parseFloat(advancedPageData.cMaxTheraputicEvening)-parseFloat(advancedPageData.cMinTheraputicEvening);

        if(this.props.formData[1].nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)") {
            firstBoxY = parseFloat(advancedPageData.cMinTheraputicHalfDayAM);
            firstBoxHeight = parseFloat(advancedPageData.cMaxTheraputicHalfDayAM)-parseFloat(advancedPageData.cMinTheraputicHalfDayAM);
            secondBoxY = parseFloat(advancedPageData.cMinTheraputicDayPM);
            secondBoxHeight = parseFloat(advancedPageData.cMaxTheraputicDayPM)-parseFloat(advancedPageData.cMinTheraputicDayPM);
        }
        else{
            firstBoxY = parseFloat(advancedPageData.cMinTheraputicDayPM);
            firstBoxHeight = parseFloat(advancedPageData.cMaxTheraputicDayPM)-parseFloat(advancedPageData.cMinTheraputicDayPM);
        }

        //percentages
        let firstBoxPercentage = null;
        let secondBoxPercentage = null;
        //substr removes the %
        let eveningBoxPercentage = parseFloat(this.props.data.TIEffE.substr(0,this.props.data.TIEffE.length-1));
        if(this.props.formData[1].nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)")
        {
            firstBoxPercentage = parseFloat(this.props.data.TIEffD1s.substr(0,this.props.data.TIEffD1s.length-1));
            secondBoxPercentage = parseFloat(this.props.data.TIEffD2.substr(0,this.props.data.TIEffD2.length-1));
        }
        else{
            firstBoxPercentage = parseFloat(this.props.data.TIEffD2.substr(0,this.props.data.TIEffD2.length-1));
        }

        ///ACTUAL RENDERING STARTS HERE
        return(
            <View style={[this.props.style]}>
                <VictoryChart
                    //animate={{ duration: this.state.animationTime}}
                    domain={{x:[0,30],y: [0,25]}}
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
                        style={{data:{stroke:this.therapeuticBoxFormatter(firstBoxPercentage)}}}
                        data={this.generateSquareTopLeft(firstBoxX,firstBoxY,firstBoxHeight,firstBoxWidth)}
                    />
                    <VictoryLine
                        style={{data:{stroke:this.therapeuticBoxFormatter(firstBoxPercentage)}}}
                        data={this.generateSquareBottomRight(firstBoxX,firstBoxY,firstBoxHeight,firstBoxWidth)}
                    />

                    <VictoryLine
                        style={{data:{stroke:(secondBoxPercentage !== null)? this. therapeuticBoxFormatter(secondBoxPercentage):"transparent"}}}
                        data={this.generateSquareTopLeft(secondBoxX,secondBoxY,secondBoxHeight,secondBoxWidth)}
                    />
                    <VictoryLine
                        style={{data:{stroke:(secondBoxPercentage !== null)? this. therapeuticBoxFormatter(secondBoxPercentage):"transparent"}}}
                        data={this.generateSquareBottomRight(secondBoxX,secondBoxY,secondBoxHeight,secondBoxWidth)} //(x,y,height,width)
                    />

                    <VictoryLine
                        style={{data:{stroke:this.therapeuticBoxFormatter(eveningBoxPercentage)}}}
                        data={this.generateSquareTopLeft(eveningBoxX,eveningBoxY,eveningBoxHeight,eveningBoxWidth)}
                    />
                    <VictoryLine
                        style={{data:{stroke:this.therapeuticBoxFormatter(eveningBoxPercentage)}}}
                        data={this.generateSquareBottomRight(eveningBoxX,eveningBoxY,eveningBoxHeight,eveningBoxWidth)}
                    />
               </VictoryChart>
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