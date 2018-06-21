import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import FormTest from './FormTest';


export default class mainScreen extends Component{

    render() {
        return(
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>Changes you make will automatically reload.</Text>
                <Text>Shake your phone to open the developer menu.</Text>
                <Icon
                    size={40}
                    name= {Platform.OS==='android'? "md-log-out" :"ios-log-out-outline"}
                    color="#52afff"
                />
                <FormTest/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
