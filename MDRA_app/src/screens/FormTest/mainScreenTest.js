import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform , ScrollView, Dimensions, Picker} from 'react-native';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

import FormTest from './FormTest';
import Input from "../../components/Input/Input";


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

    _handleChange = (value)=> {
        this.props.onChange(this.props.name, value)
    };

    _handlePickerItem = () => {
        let itemList = ["1","2","3"]
        let output = [];
        //quantity control
        if (itemList.length == 0)
            return -1;
        else {
            for (let i = 0; i < itemList.length; i++) {
                output.push(
                    <Picker.Item
                        label={itemList[i]}
                        value={itemList[i]}
                        key={itemList[i]+Math.random()}/>)
            }
            return output;
        }

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
                    <Picker
                        selectedValue={"1"}
                        style={styles.pickerStyle}
                        onValueChange={(itemValue, itemIndex) => this._handleChange(itemValue)}
                        children={this._handlePickerItem()}
                    >
                    </Picker>
                    <Input
                        label={"Weight"}
                        labelPosition={"left"}
                        value={""}
                        onChange={(name,value) =>{
                            //do nothing
                        }}
                        name="weight"
                        keyboardType="numeric"
                        onBlur={() =>{
                            //this.props.onToggleIndicator();
                            //console.log(this.props.state.main.indicatorVisibility)
                        }}
                        maxLength={5}
                    />
                    <Input
                        label={"Weight"}
                        labelPosition={"left"}
                        value={""}
                        onChange={(name,value) =>{
                            //do nothing
                        }}
                        name="weight"
                        keyboardType="numeric"
                        onBlur={() =>{
                            //this.props.onToggleIndicator();
                            //console.log(this.props.state.main.indicatorVisibility)
                        }}
                        maxLength={5}
                    />
                    <Input
                        label={"Weight"}
                        labelPosition={"left"}
                        value={""}
                        onChange={(name,value) =>{
                            //do nothing
                        }}
                        name="weight"
                        keyboardType="numeric"
                        onBlur={() =>{
                            //this.props.onToggleIndicator();
                            //console.log(this.props.state.main.indicatorVisibility)
                        }}
                        maxLength={5}
                    />
                    <Input
                        label={"Weight"}
                        labelPosition={"left"}
                        value={""}
                        onChange={(name,value) =>{
                            //do nothing
                        }}
                        name="weight"
                        keyboardType="numeric"
                        onBlur={() =>{
                            //this.props.onToggleIndicator();
                            //console.log(this.props.state.main.indicatorVisibility)
                        }}
                        maxLength={5}
                    />
                    <Input
                        label={"Weight"}
                        labelPosition={"left"}
                        value={""}
                        onChange={(name,value) =>{
                            //do nothing
                        }}
                        name="weight"
                        keyboardType="numeric"
                        onBlur={() =>{
                            //this.props.onToggleIndicator();
                            //console.log(this.props.state.main.indicatorVisibility)
                        }}
                        maxLength={5}
                    />
                </ScrollView>
            </View>
        )
    }

}
//<FormTest/>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },

    pickerStyle:{
        height: 100,
        width: "100%"
    }
});

export default mainScreen
