import React, {PureComponent} from 'react';
import {View, Button, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';

import {VictoryPie} from 'victory-native';

class ResultTest extends PureComponent{
    state = {

    };

/*    generateDataObjects(dataArray){
        objectsArray = [];
        for(let i = 0; i < dataArray.length; i++)
        {
            objectsArray.push({
                x: i,
                y:dataArray[i],
                label: i
            })
        }
    }
*/
    render() {
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


        return(
            <View>
                <TouchableWithoutFeedback onPress={()=>{console.log("YOU VIOLATED ME")}}>
                    <View>
                        <Text>
                            Pie 1
                        </Text>
                        <View style={this.props.style}>
                            <VictoryPie
                                radius={100}
                                data={[this.props.data.characNR, this.props.data.characNRR, this.props.data.characR, this.props.data.characRAR, this.props.data.characAR, this.props.data.characNRRAR]}
                                //animate={{duration: 500}}
                            />
                        </View>
                        <Text>
                            Pie 2
                        </Text>
                        <View style={[this.props.style]}>
                            <VictoryPie
                                radius={100}
                                data={[this.props.data.characNRNuit, this.props.data.characNRRNuit, this.props.data.characRNuit, this.props.data.characRARNuit, this.props.data.characARNuit, this.props.data.characNRRARNuit]}
                                //animate={{duration: 500}}
                            />
                        </View>
                        <View style={{backgroundColor:'transparent', height:'100%', width:'100%',position:"absolute" ,left:0, top:0}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 300
    }
});

export default ResultTest;