import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView, Dimensions, Picker, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import {FormInput} from 'react-native-elements'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import Input from "../../components/Input/Input";

import CustomTimeModal from '../../components/CustomTimeModal/CustomTimeModal';
import Ionicon from 'react-native-vector-icons/Ionicons';


class MainScreenTest extends Component{
    state={
        selectedGender: true
    };

    handleGenderSelection = (targetValue) => {
        this.setState(oldState=>{
            return{
                ...oldState,
                selectedGender: targetValue
            }
        })
    };

    render() {
        return(
            <View style={styles.container}>
                {/*<View style={{flex:1,position: "absolute",bottom: 0,width: 100, height: 50, backgroundColor: "cyan"}}>*/}
                    {/*<Text>This is at the bottom</Text>*/}
                {/*</View>*/}
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={() => this.handleGenderSelection(true)}>
                        <View style={[styles.genderContainer,{opacity:!this.state.selectedGender?0.5:1}]}>
                            <Ionicon
                                size={40}
                                name= {"md-male"}
                                color={"#52afff"}
                                style={styles.drawerItemIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleGenderSelection(false)}>
                        <View style={[styles.genderContainer,{opacity:this.state.selectedGender?0.5:1}]}>
                            <Ionicon
                                size={40}
                                name= {"md-female"}
                                color="#f6aaff"
                                style={styles.drawerItemIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

} /*<CustomTimeModal/>*/
// style={{ flex: 1,alignItems: "center", justifyContent: "center"}}>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a0bdff',
        height:"100%"
    },

    pickerStyle:{
        height: 100,
        width: "100%"
    },

    genderContainer:{
        marginHorizontal: 10
    }
});

export default MainScreenTest
