import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView, Dimensions, Picker} from 'react-native';
import {connect} from 'react-redux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import Input from "../../components/Input/Input";


class MainScreenTest extends Component{

    render() {
        return(
            <View style={styles.container}>
                    <Screen  style={{flex:1, backgroundColor:"#F00"}}>
                        <Input name={"myMomIsCute"} label={"WAT THE FUCK"} onTouch={()=>console.log("YAY")} onChange={()=>console.log("YAY2")} style={{marginVertical: 200}}/>
                        <Input name={"myDadIsCute"} label={"WAT THE FUCK2"} onTouch={()=>console.log("YAY")} onChange={()=>console.log("YAY2")} style={{marginVertical: 200}}/>
                        <Input name={"mySisIsCute"} label={"WAT THE FUCK3"} onTouch={()=>console.log("YAY")} onChange={()=>console.log("YAY2")} style={{marginVertical: 200}}/>
                    </Screen>
                <View style={{flex:1,position: "absolute",bottom: 0,width: 100, height: 50, backgroundColor: "cyan"}}>
                    <Text>This is at the bottom</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00F',
        height:"100%"
    },

    pickerStyle:{
        height: 100,
        width: "100%"
    }
});

export default MainScreenTest
