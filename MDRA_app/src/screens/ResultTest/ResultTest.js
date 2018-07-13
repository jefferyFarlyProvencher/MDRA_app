import React, {PureComponent} from 'react';
import {View, Button} from 'react-native';
import 'react-native-svg';

import Draggable from 'react-native-draggable';

import {BarChart, Grid} from 'react-native-svg-charts';

class ResultTest extends PureComponent{
    state = {
        formData: [ 50, 10, 40, 95, 85 ],
        currentSta: 1
    };

    _handleOnPress = () => {
        if(this.state.currentSta == 1) {
            this.setState({
                formData: [100, 90, 40, 95, 85],
                currentSta: 2
            })
        }else{
            this.setState({
                formData: [ 50, 10, 40, 95, 85 ],
                currentSta: 1
            })
        }
    };

    render() {
        return (
            <View style={{backgroundColor:"white"}}>
                <View style={{borderWidth:10, borderColor:"red", height:100}}/>
                <View style={{ flexDirection: 'row', height: 300, paddingVertical: 16 }}>
                    <BarChart
                        style={{ flex: 1, marginLeft: 8 }}
                        data={this.state.formData}
                        horizontal={true}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        gridMin={0}
                        >
                        <Grid direction={Grid.Direction.VERTICAL}/>
                    </BarChart>
                    <Draggable reverse={false} renderColor='red' renderShape='circle' offsetX={0} offsetY={-300} renderText='B' borderOnly={true}/>
                    <Draggable renderSize={56} renderColor='black' offsetX={-100} offsetY={-200} renderText='A' pressDrag={()=>alert('touched!!')}/>
                    <Draggable renderSize={56} renderColor='black' offsetX={-100} offsetY={-200} renderText='A' pressDrag={()=>alert('touched!!')} borderOnly={true} borderSize={101}/>
                </View>
                <Button title="Press me" onPress={this._handleOnPress}/>
            </View>
        )
    }
}

export default ResultTest