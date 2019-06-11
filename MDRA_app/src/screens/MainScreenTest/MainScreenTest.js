import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView, Dimensions, Picker} from 'react-native';
import {connect} from 'react-redux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import Input from "../../components/Input/Input";

import CustomTimeModal from '../../components/CustomTimeModal/CustomTimeModal';

class MainScreenTest extends Component{

    render() {
        return(
            <View style={styles.container}>
                <View style={{ flex: 1,alignItems: "center", justifyContent: "center"}}>
                    <CustomTimeModal/>
                </View>
                {/*<View style={{flex:1,position: "absolute",bottom: 0,width: 100, height: 50, backgroundColor: "cyan"}}>*/}
                    {/*<Text>This is at the bottom</Text>*/}
                {/*</View>*/}

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F00',
        height:"100%"
    },

    pickerStyle:{
        height: 100,
        width: "100%"
    }
});

export default MainScreenTest
