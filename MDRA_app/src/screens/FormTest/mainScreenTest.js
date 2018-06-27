import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView, Dimensions} from 'react-native';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

import FormTest from './FormTest';


class mainScreen extends Component{

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles);
    }

    updateStyles = (dims) => {
        this.setState( {
            ViewMode: dims.window.height > 500 ? "portrait" : "landscape"
        });
    };


    render() {
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.container}>
                        <Text>Open up App.js to start working on your app!</Text>
                    <Icon
                        size={40}
                        name= {Platform.OS==='android'? "md-log-out" :"ios-log-out-outline"}
                        color="#52afff"
                    />
                    </View>
                    <FormTest/>
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default mainScreen
