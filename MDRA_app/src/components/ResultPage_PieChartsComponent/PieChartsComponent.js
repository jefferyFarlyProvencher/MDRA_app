import React, {PureComponent} from 'react';
import {
    View,
    Button,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
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
        let firstPieData = [this.props.data.characNR, this.props.data.characNRR, this.props.data.characR, this.props.data.characRAR, this.props.data.characAR, this.props.data.characNRRAR];
        let secondPieData = [0,0,0,0,0,0];
        let EveningPieData =[this.props.data.characNRNuit, this.props.data.characNRRNuit, this.props.data.characRNuit, this.props.data.characRARNuit, this.props.data.characARNuit, this.props.data.characNRRARNuit];

        //switching because the returned data is f*cked up
        // as in, it switches pie1 and pie2 data for no reason
        if((this.props.formData[1].nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)"))
        {
            secondPieData = firstPieData;
            firstPieData = [this.props.data.characNRAM, this.props.data.characNRRAM, this.props.data.characRAM, this.props.data.characRARAM, this.props.data.characARAM, this.props.data.characNRRARAM]
        }

        return(
            <View>
                    <View style={styles.pieTitleStyle}>
                        <Text style={{color:"#FFF", fontSize:20}}>
                            First Pie Graph
                        </Text>
                    </View>
                    <TouchableHighlight
                        onPress={()=>{
                            console.log("This first pie has been pressed");
                            this.handlePieClick(!this.state.modalVisible,firstPieData);
                        }}>
                        <View style={this.props.style} pointerEvents="none">
                            <VictoryPie
                                radius={100}
                                data={this.generateDataObjects(firstPieData)}
                                colorScale={['#1b3e70', '#62c9e4', '#c2c822', '#f8c82c', '#ed5f6d','#f6922d']}
                                animate={{duration: 500}}
                                innerRadius={50}
                            />
                        </View>
                    </TouchableHighlight>
                {//TODO
                    (this.props.formData[1].nbTheraputicBoxes === "Two therapeutic boxes (AM and PM)")
                    ?
                        <View>
                            <View style={styles.pieTitleStyle}>
                                <Text style={{color:"#FFF", fontSize:20}}>
                                    Second Pie Graph
                                </Text>
                            </View>
                            <TouchableHighlight
                                onPress={()=>{
                                    console.log("This first pie has been pressed");
                                    this.handlePieClick(!this.state.modalVisible,secondPieData);
                                }}>
                                <View style={this.props.style} pointerEvents="none">
                                    <VictoryPie
                                        radius={100}
                                        data={this.generateDataObjects(secondPieData)}
                                        colorScale={['#1b3e70', '#62c9e4', '#c2c822', '#f8c82c', '#ed5f6d','#f6922d']}
                                        animate={{duration: 500}}
                                        innerRadius={50}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                    :<View/>
                }

                    <View style={styles.pieTitleStyle}>
                        <Text style={{color:"#FFF", fontSize:20}}>
                            Evening Pie Graph
                        </Text>
                    </View>
                    <TouchableHighlight
                        onPress={()=>{
                            console.log("This evening pie has been pressed");
                            this.handlePieClick(!this.state.modalVisible,EveningPieData);
                        }}
                    >
                        <View style={[this.props.style]} pointerEvents="none">
                            <VictoryPie
                                radius={100}
                                data={this.generateDataObjects(EveningPieData)}
                                colorScale={['#1b3e70', '#62c9e4', '#c2c822', '#f8c82c', '#ed5f6d','#f6922d']}
                                labels={this.handleLabels(EveningPieData)}
                                animate={{duration: 500}}
                                innerRadius={50}
                            />
                        </View>
                    </TouchableHighlight>
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