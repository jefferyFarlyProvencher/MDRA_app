import React, {PureComponent} from 'react';
import {
    View,
    Button,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';

import {VictoryPie} from 'victory-native';
import TitleComponent from "../TitleComponent/TitleComponent";

class ResultTest extends PureComponent{
    state = {
        modalVisible: false,
        opacityEnabled: false,
        modalPieData: null
    };

    generateDataObjects(dataArray){
        let objectsArray = [];
        for(let i = 0; i < dataArray.length; i++)
        {
            let parsedData = (parseFloat(dataArray[i])*100);
            objectsArray.push({
                x: i,
                y:parsedData,
                label: (parsedData.toFixed(2)>5)?parsedData.toFixed(2)+"%": " "
            })
        }
        return objectsArray
    }


    handleLabels= (data) => {
        let labels = [""];
        for(let i = 0; i < data.length; i++)
        {
            let percentage = parseFloat(data[i])*100;
            if(percentage > 0)
            {
              labels.push(percentage+"%");
            }
            else{
              labels.push("");
            }
        }
        //console.log(JSON.stringify(labels));
        return labels
    };

    handlePieClick= (visible, pieData)=>{
        let correctedPieData = pieData.slice();
        for(let i=0; i < correctedPieData.length; i++)
        {
            correctedPieData[i] = (parseFloat(correctedPieData[i])*100).toFixed(2)+"%";
        }
        this.setState((oldState) => {
                return({
                    ...oldState,
                    modalVisible: visible,
                    modalPieData:correctedPieData
                })
            }
        );
    };

    setModalVisible(visible) {
        this.setState((oldState) => {
                return({
                    ...oldState,
                    modalVisible: visible,
                })
            }
        );
    }

    render() {
        //determines wether or not they have animation
        let willBeAnimated = this.props.Animated
        return(
            <View>
                <TouchableOpacity
                onPress={()=>{
                    console.log("This first pie has been pressed");
                    this.handlePieClick(!this.state.modalVisible,this.props.data);
                }}>
                    <View>
                        <View style={styles.pieTitleStyle}>
                            <Text style={{color:"#FFF", fontSize:20}}>
                                {this.props.title}
                            </Text>
                        </View>
                        <View style={this.props.style} pointerEvents="none">
                            <VictoryPie
                                radius={100}
                                data={this.generateDataObjects(this.props.data)}
                                colorScale={['#1b3e70', '#62c9e4', '#c2c822', '#f8c82c', '#ed5f6d','#f6922d']}
                                animate={willBeAnimated?{duration: 500}: null}
                                innerRadius={50}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{height: "80%", width:"80%"}}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >

                            <TouchableWithoutFeedback
                                onPress={() => {this.setModalVisible(!this.state.modalVisible);}}
                            >
                                <View
                                    style={{
                                        backgroundColor:'#000',
                                        opacity: 0.5,
                                        flex:1,
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                    }}
                                />
                            </TouchableWithoutFeedback>
                            <View style={{marginTop: 22, height: "80%", width:"80%", backgroundColor: '#FFF'}}>
                                <View>
                                    <View style={styles.modalColors}>
                                        <TitleComponent
                                            text={"Percentages"}
                                            containerStyle={{borderBottomWidth:0}}
                                        />
                                    </View>
                                    <View>
                                        <View style={[{backgroundColor:'#1b3e70'},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:15, paddingBottom:0}]}
                                                text={'Non Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[0]:"0"}
                                            </Text>
                                        </View>
                                        <View style={[{backgroundColor:'#62c9e4'},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:15, paddingBottom:0}]}
                                                text={'Non Responder / Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[1]:"1"}
                                                </Text>
                                        </View>
                                        <View style={[{backgroundColor:'#c2c822'},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:15, paddingBottom:0}]}
                                                text={'Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[2]:"2"}
                                                </Text>
                                        </View>
                                        <View style={[{backgroundColor: '#f8c82c',},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:15, paddingBottom:0}]}
                                                text={'Responder / Adverse Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[3]:"3"}
                                                </Text>
                                        </View>
                                        <View style={[{backgroundColor:'#ed5f6d'},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:15, paddingBottom:0}]}
                                                text={'Adverse Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[4]:"4"}
                                                </Text>
                                        </View>
                                        <View style={[{backgroundColor:'#f6922d'},styles.modalColors]}>
                                            <TitleComponent
                                                containerStyle={{marginBottom: 10, paddingBottom:0}}
                                                textStyle={[styles.ColorTextStyle,{fontSize:13, paddingBottom:0}]}
                                                text={'Non Responder / Responder / Adverse Responder :'}
                                            />
                                            <Text style={styles.ColorTextStyle}>
                                                {this.state.modalPieData?this.state.modalPieData[5]:"5"}
                                                </Text>
                                        </View>
                                        <View style={{height:"13%", width:"100%"}}>
                                            <TouchableOpacity
                                                onPress={() => {this.setModalVisible(!this.state.modalVisible);}}

                                            >
                                                <View style={{width:'100%', height:"100%",justifyContent: "center", alignItems: "center",backgroundColor:"#aaa"}}>
                                                    <TitleComponent
                                                        text={"Close"}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 300
    },

    modalColors: {
        height: "13.1%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    pieTitleStyle:{
        alignItems:'center',
        backgroundColor:"#4169e1",
        height:(Dimensions.get('window').height)*0.05,
        justifyContent: "center"
    },
    ColorTextStyle: {
        color: "#FFF",
        paddingBottom: 10,
    }
});

export default ResultTest;