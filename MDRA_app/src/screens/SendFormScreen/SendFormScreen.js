//system imports
import React,{PureComponent} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

//component imports
import {connect} from "react-redux";

import {addData} from "../../store/actions/addData";
import {changePosition} from "../../store/actions";
import ResultTest from "../ResultTest/ResultTest";

class SendFormScreen extends PureComponent{
    state = {
        dataReceived: false,
        modalActivated: false,
    };

    _handlerOnPress = () => {

        if (this.state.dataReceived) {
            this.setState({
                dataReceived: true,
                modalActivated: true,
            });
            Navigation.showModal({
                screen: 'MDRA_app.resultTest',
                title: 'MDRA_app.resultTest',
                opacity: '100%'
            });
        }
    };

    countDown = (async ()=>{
        setTimeout(() => {
            this.setState((oldState) =>({
                ...oldState,
                dataReceived: true,

            }))
        }, 5000)
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

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data,position) => dispatch(addData(data,position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

export default connect(null,mapDispatchToProps)(SendFormScreen);