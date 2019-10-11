import React, {PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//colors
import * as colors from '../../assets/colors';
/**
 *  InputDisplay requires:
 *
 *  rowTitle: string
 *  rowValue: function
 *
 *  Input optional:
 *
 *  style: object
 *
 */

class lifeBar extends PureComponent{

    state = {

    };

    constructor(props){
        super(props);
    }

    render() {
        console.log("Update of LifeBar");
        return(
            <View style={[styles.root,this.props.style]}>
                <View style={{width:"30%", justifyContent: "center"}}>
                    <Text style={{fontWeight:"bold"}}>{this.props.title + ": "}</Text>
                </View>
                <View style={[{backgroundColor:"#DDD", width:"70%", height: "100%"},this.props.barStyle]}>
                    <View style={{backgroundColor:colors.royalBlue1, width: this.props.value + "%", height:"100%", justifyContent: "center"}}>
                        <Text>{parseFloat(this.props.value).toFixed(1) + "%"}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width:"100%",
        height: 30,
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 5
    }
});

export default lifeBar;