import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import FormTest from './FormTest';


export default class mainScreen extends Component{

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
