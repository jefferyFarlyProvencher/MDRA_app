//system imports
import React,{PureComponent} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, ToastAndroid} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

//component imports
import PrepareToSend from '../../components/PrepareToSend/PrepareToSend';
import SendForm from '../../components/SendForm/SendForm';
import FormatReceivedData from '../../components/FormatReceivedData/HandleReceivedData';

//redux imports
import {connect} from "react-redux";
import {addToResultList} from "../../store/actions";
import {changePosition} from "../../store/actions";

class SendFormScreen extends PureComponent{
    state = {
        dataReceived: false,
        textToDisplay: 'Data Sending?!',

    };

    componentWillMount(){
        this.sendRequest();
    }

    generateName = () => {
        let d = new Date();
        return (//this.props.state.main.userId
            d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+"///"+(Math.random()*100+1)
        );
    };

    sendRequest = async () => {
        this.setState((oldState) =>({
            ...oldState,
            dataReceived: false,
        }));
        let preparedData = PrepareToSend(this.props.state.main);
        let data = await SendForm(preparedData);
        //console.log(JSON.stringify(data));
        if(data !== -1) {
            //console.log(JSON.stringify(data));
            console.log(this.generateName());
            this.props.onAddToResultList(data, this.generateName());
            //console.log(JSON.stringify(FormatReceivedData(data)));
            //this.props.onAddToResultList(FormatReceivedData(data));
            this.setState((oldState) =>({
                ...oldState,
                dataReceived: true,
                textToDisplay: "DATA RECEIVED!!!"
            }));

            if (this.state.dataReceived) {
                ToastAndroid.showWithGravity("Data added to List", 1, ToastAndroid.BOTTOM);
            }
        }
    };

    _handlerOnPress = async () => {
        let message = (!this.state.dataReceived)? "Not Received Yet": "Received!";
        ToastAndroid.showWithGravity("GOING BACK TO PAGE 1!!!", 1, ToastAndroid.TOP);
        this.props.onChangePosition(0);
    };

    render() {
        return(
            <View style={styles.container}>
                <View><Text>{this.state.textToDisplay}</Text></View>
                <TouchableOpacity onPress={this._handlerOnPress}>
                    <View>
                    {
                        !this.state.dataReceived
                        ?<ActivityIndicator size={100} color="red" />
                        :<Icon
                            size={150}
                            name="md-refresh"
                            color="grey"
                            />
                    }
                    {
                        !this.state.dataReceived
                            ?<Text>Sending Data to server...</Text>
                            :(
                                <Text>{"    Redo Form?"}</Text>
                            )
                    }
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }
});

const mapStateToProps = state => {
    return{
        state
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onAddToResultList: (data,name)=>dispatch(addToResultList(data, name)),
        onChangePosition:   (pos) => dispatch(changePosition(pos))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SendFormScreen);