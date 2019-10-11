import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView, Dimensions, Picker, TouchableOpacity} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import {FormLabel} from "react-native-elements";

//toggles the selection between the two genders male and female
//takes in a value (true for male and false for female)

class GenderSelector extends Component{
    state= {
        selectedGender:this.props.value
    };

    handleGenderSelection = (targetValue) => {
        this.setState(oldState=>{
            return{
                ...oldState,
                selectedGender: targetValue
            }
        });

        this.props.onPress(targetValue?"Male":"Female")
    };

    render() {
        console.log("Update of GenderSelector");

        return(
            <View style={styles.container}>
                <FormLabel>Gender</FormLabel>
                <View style={{marginTop: 5 ,flexDirection:"row"}}>
                    <TouchableOpacity onPress={() => this.handleGenderSelection(true)}>
                        <View style={[styles.genderContainer,{opacity:!this.state.selectedGender?0.2:1}]}>
                            <Ionicon
                                size={40}
                                name= {"md-male"}
                                color={"#52afff"}
                                style={styles.drawerItemIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleGenderSelection(false)}>
                        <View style={[styles.genderContainer,{opacity:this.state.selectedGender?0.2:1}]}>
                            <Ionicon
                                size={40}
                                name= {"md-female"}
                                color="#ff87f5"
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
        backgroundColor: 'transparent',
    },

    genderContainer:{
        marginHorizontal: 10
    },
});

export default GenderSelector
