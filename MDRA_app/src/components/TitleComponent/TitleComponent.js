import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class TitleComponent extends Component{
    render(){
        return(
            <View style={[styles.titleContainer,this.props.containerStyle]}>
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
        fontSize: 30,
        color:"#636363"
    },

    titleContainer: {
        borderBottomWidth: 0.5,
        width: "100%",
        borderBottomColor: "#a5a5a5"
    }
});

export default TitleComponent;