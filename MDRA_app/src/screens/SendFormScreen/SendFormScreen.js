//system imports
import React,{PureComponent} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, ToastAndroid} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

//component imports
import SendForm from '../../components/SendForm/SendForm';
import FormatReceivedData from '../../components/FormatReceivedData/FormatReceivedData';

//redux imports
import {connect} from "react-redux";
import {addToResultList} from "../../store/actions";
import ResultTest from "../ResultTest/ResultTest";




class SendFormScreen extends PureComponent{
    state = {
        dataReceived: false,
        modalActivated: false,
    };


    _handlerOnPress = async () => {
        let data = await SendForm();
        console.log(data);
        //console.log(JSON.stringify(FormatReceivedData(data)));
        //this.props.onAddToResultList(FormatReceivedData(data));
        if (this.state.dataReceived) {
            this.setState({
                dataReceived: true,
                modalActivated: true,
            });

            ToastAndroid.showWithGravity("Data added to List", 1,ToastAndroid.BOTTOM);
        }
    };

    countDown = (async ()=>{
        setTimeout(() => {
            this.setState((oldState) =>({
                ...oldState,
                dataReceived: true,
            }));
        }, 2000);
    });
    render() {
        this.countDown();
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this._handlerOnPress}>
                    <View>
                    {
                        !this.state.dataReceived
                        ?<ActivityIndicator size={100} color="red" />
                        :<Icon
                            size={200}
                            name="ios-checkmark"
                            color="green"
                            />
                    }
                    {
                        !this.state.modalActivated
                        ?(!this.state.dataReceived)
                            ?<Text>Sending Data to server...</Text>
                            :<Text>Data Received!</Text>
                        :null
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
        onAddToResultList: (data)=>dispatch(addToResultList(data))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SendFormScreen);