import React, {PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';

/**
 *  InputDisplay requires:
 *
 *  rowTitle: string
 *  rowValue: function
 *
 *  Input optional:
 *
 *  style: object
 *
 */

class InputDisplay extends PureComponent{

    state = {

    };

    constructor(props){
        super(props);
    }

    render() {
        return(
            <View style={[styles.root,this.props.style]}>
                <Text style={{fontWeight:"bold"}}>{this.props.rowTitle + ": "}</Text>
                <Text>{this.props.rowValue}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 5
    }
});

export default InputDisplay;