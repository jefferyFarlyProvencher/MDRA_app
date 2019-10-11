import React from 'react';
import { StyleSheet, Image } from 'react-native';

class CustomMarker extends React.Component {
    render() {
        console.log("Update of CustomMarker");

        return (
            <Image
                style={styles.image}
                source= {require('../../assets/IphoneCircle.png')}
                resizeMode="contain"
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
    },
});

export default CustomMarker;