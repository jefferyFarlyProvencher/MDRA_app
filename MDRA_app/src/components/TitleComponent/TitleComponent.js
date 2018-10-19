import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class TitleComponent extends Component{
    render(){
        return(
            <View style={[styles.titleContainer,this.props.style]}>
                <Text style={[styles.titleStyle, this.props.textStyle]}>
                    {this.props.text}
                </Text>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    titleStyle: {
        marginVertical: 10,
        textAlign: "center",
        fontSize: 30
    },

    titleContainer: {
        borderBottomWidth: 0.5,
        width: "100%"
    }
});

export default TitleComponent;