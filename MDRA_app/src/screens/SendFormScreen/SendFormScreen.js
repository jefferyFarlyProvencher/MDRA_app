//system imports
import React,{PureComponent} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, ToastAndroid} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Icon from 'react-native-vector-icons/Ionicons';

//component imports
import {connect} from "react-redux";

//redux imports
import {addToResultList} from "../../store/actions";
import ResultTest from "../ResultTest/ResultTest";

class SendFormScreen extends PureComponent{
    state = {
        dataReceived: false,
        modalActivated: false,
        data: [70, 20, 40, 95, 85]
    };

    setUpSendInput = () => {
        let page0Data = this.props.state.main.Page0Data;
        let page1Data = this.props.state.main.Page1Data;
        let page2Data = this.props.state.main.Page2Data
            ? this.props.state.main.Page2Data //if else continues bellow
            :{
                weight1: "100",
                weight2: "100",
                weight3: "100",
                weight4: "100",
                weight5: "100",
                weight6: "100",
                weight7: "100",
            };
        let page3Data = this.props.state.main.Page3Data //if else continues bellow
                ?this.props.state.main.Page3Data
                :{
                    tsTimeHalfDayAM: '8' ,
                    teTimeHalfDayAM: '12',
                    tsTimeHalfDayPM: '12',
                    teTimeHalfDayPM: '16',
                    cMinTheraputicHalfDayAM: '6',
                    cMaxTheraputicHalfDayAM: '20',
                    cMinTheraputicDayPM: '6',
                    cMaxTheraputicDayPM: '20',
                    cMinTheraputicEvening: '0',
                    cMaxTheraputicEvening: '6',
                    threshold: '80'
                };


        return '/?nInd='+ page0Data.numberOfSimulations  +
            '&Gender='+ page0Data.gender +
            '&weight='+ page0Data.weight+
            '&a='+ page0Data+
            '&b='+ page0Data+
            '&c='+ page0Data+
            '&d='+ page0Data+
            '&e='+ page0Data+
            '&f='+ page0Data+
            '&g='+ page0Data+
            '&h='+ page0Data+
            '&WTI1='+ page2Data.weight1 +
            '&WTI2='+ page2Data.weight2 +
            '&WTI3='+ page2Data.weight3 +
            '&WTI4='+ page2Data.weight4 +
            '&WTI5='+ page2Data.weight5 +
            '&WTI6='+ page2Data.weight6 +
            '&WTI7='+ page2Data.weight7 +
            '&palier='+ page3Data.threshold +
            '&za=6'+ page0Data +
            '&zb='+ page0Data +
            '&zc='+ page0Data +
            '&zd='+ page0Data +
            '&zzc='+ page0Data +
            '&zzd='+ page0Data +
            '&heureducoucher='+ page1Data +
            '&startLunchTime='+ page1Data +
            'Morning='+ page1Data +
            '&formulation1='+ page1Data +
            '&quantitedose1='+ page1Data +
            '&momentdose1='+ page1Data +
            'Food1='+ page3Data
    };

    _handlerOnPress = () => {
        if (this.state.dataReceived) {
            this.setState({
                dataReceived: true,
                modalActivated: true,
            });
            console.log(this.setUpSendInput());
            //Navigation.showModal({
              //  screen: 'MDRA_app.resultTest',
               // title: 'MDRA_app.resultTest',
               // opacity: '100%'
            //});
            this.props.onAddToResultList(data);
            ToastAndroid.showWithGravity("Data added to List", 1,ToastAndroid.BOTTOM)
        }
    };

    countDown = (async ()=>{
        data = this.state.data;
        setTimeout(() => {
            this.setState((oldState) =>({
                ...oldState,
                dataReceived: true,
            }));

        }, 1000);
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