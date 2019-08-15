import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    Dimensions,
    Picker,
    TouchableOpacity,
    Animated
} from 'react-native';
import {connect} from 'react-redux';

import {FormInput} from 'react-native-elements'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import Input from "../../components/Input/Input";

import CustomTimeModal from '../../components/CustomTimeModal/CustomTimeModal';


import Ionicon from 'react-native-vector-icons/Ionicons';

import ScrollDownIndicator from '../../components/ScrollDownIndicator/ScrollDownIndicator';

class MainScreenTest extends Component{
    state={
        selectedGender: false
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
                {/*<View style={{flexDirection:"row"}}>*/}
                    {/*<TouchableOpacity onPress={() => this.handleGenderSelection(true)}>*/}
                        {/*<View style={[styles.genderContainer,{opacity:!this.state.selectedGender?0.5:1}]}>*/}
                            {/*<Ionicon*/}
                                {/*size={40}*/}
                                {/*name= {"md-male"}*/}
                                {/*color={"#52afff"}*/}
                                {/*style={styles.drawerItemIcon}*/}
                            {/*/>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={() => this.handleGenderSelection(false)}>*/}
                        {/*<View style={[styles.genderContainer,{opacity:this.state.selectedGender?0.5:1}]}>*/}
                            {/*<Ionicon*/}
                                {/*size={40}*/}
                                {/*name= {"md-female"}*/}
                                {/*color="#f6aaff"*/}
                                {/*style={styles.drawerItemIcon}*/}
                            {/*/>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
                <ScrollView onScroll={()=>this.handleGenderSelection(true)}>
                    <Text>I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.I went to IT in theaters when it came out and we were waiting for the movie to start, when a guy came in dressed as Pennywise. He made his way to the back of the theater and sat by himself for a few minutes and then 5 minutes into the movie he got up and walked out looking over his shoulder like he was hiding something. I thought he must just be using the restroom or getting snacks, no big deal. Well, the movie keeps playing and he is gone for the entire thing and with 10 minutes left he comes back in still looking over his shoulder occasionally. This time he sits in the front. My palms started sweating and I immediately started imagining scenarios in my head where he had left to load his guns in the restroom and get everything ready to commit a shooting similar to the dark night one. I knew the odds were slim to none, but it really bothered me to the point where I begged my wife and we left the theater before the movie was over. Nothing ended up happening in that theater, but it still gives me chills thinking of it because I was convinced a tragedy was about to go down.</Text>

                    {!this.state.selectedGender ?
                        <View style={{
                            position: "absolute",
                            top: Dimensions.get("window").height * 0.8,
                            alignItems: "center",
                            flex: 1,
                            width: "100%"
                        }}>
                            <ScrollDownIndicator activated={!this.state.selectedGender}/>
                        </View>:
                        <View/>
                    }
                </ScrollView>

            </View>
        )
    }

} /*<CustomTimeModal/>*/
// style={{ flex: 1,alignItems: "center", justifyContent: "center"}}>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1eaff',
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
