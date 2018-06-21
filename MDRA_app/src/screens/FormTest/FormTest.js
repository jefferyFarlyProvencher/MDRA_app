import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Input from "../../components/Input/Input"

class FormTest extends PureComponent{
    state = {};
    render() {
        return(
            <View>
                <Input/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export default FormTest;