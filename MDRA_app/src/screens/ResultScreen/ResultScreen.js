import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';

class ResultScreen extends Component{

    itemSelectedHandler = key => {
        const selPlace = this.props.places.find(place => {
            return place.key ===key;
        });
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.name,
            passProps: {
                selectedPlace: selPlace
            }
        });
    };

    render(){
        return(
            <View>
                <Text>This doesn't have any results yet</Text>
            </View>
        )
    }
}

export default ResultScreen