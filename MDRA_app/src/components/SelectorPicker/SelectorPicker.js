import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity,
    BackHandler,
    Alert, Animated,
    PermissionsAndroid,
    Button,
    Image,
    Picker, Modal, TouchableWithoutFeedback, TouchableHighlight
} from 'react-native';
//import {Button} from 'react-native-elements';
import 'react-native-svg';
class ResultPage extends PureComponent {
    state = {
        modalVisible: false,
        selectedItem: "Name"
    };
    /////// END OF PDF SECTION
/////this is reserved for its own component, but is now here for testing
    handleSelectorToggle = (value) => {
        if(value){
            this.setState(oldState => {
                return {
                    ...oldState,
                    modalVisible: value
                }

            })
        }else {
            this.setState(oldState => {
                return {
                    ...oldState,
                    modalVisible: !oldState.modalVisible
                }

            })
        }
    };

    handleItemSelected = (selectedItem) =>{
        this.setState((oldState)=>{
            return({
                ...oldState,
                selectedItem: selectedItem
            })
        })
        this.handleSelectorToggle(false);
        this.props.itemSelected(selectedItem)
    };

//    Animated.sequence([

    render() {
        return(
            <View style={{flex:1}}>
                <View >
                    <TouchableOpacity onPress={()=>{console.log("toggling selector");this.handleSelectorToggle(true)}}>
                        <View style={[{alignItems:"center", justifyContent:"center", backgroundColor:"#2e2e2e", height: Dimensions.get("window").height*0.05, width: Dimensions.get("window").width*0.17, padding: 10},this.props.style]}>
                            <Text style={{color:'#e4e4e4', textAlign: "center"}}>{this.state.selectedItem}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.handleSelectorToggle(!this.state.modalVisible);
                    }}
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
                            onPress={() => {this.handleSelectorToggle(!this.state.modalVisible);}}
                        >
                            <View
                                style={{
                                    backgroundColor:'#2f2f2f',
                                    opacity: 0.5,
                                    flex:1,
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                }}
                            />
                        </TouchableWithoutFeedback>
                        <View>
                            <View>
                                <TouchableHighlight onPress={()=>{this.handleItemSelected("Name")}}>
                                    <View style={styles.selectorTile}>
                                        <Text style={styles.selectorTileText}>Result Name</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{this.handleItemSelected("Date")}}>
                                    <View style={styles.selectorTile}>
                                        <Text style={styles.selectorTileText}>Creation Date</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight>
                                    <View style={styles.selectorTileDisabled}>
                                        <Text style={styles.selectorTileTextDisabled}>Patient Name (Coming Soon...)</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    selectorTile:{
        backgroundColor:"#FFF",
        width:Dimensions.get("window").width*0.85,
        padding:20
    },

    selectorTileText:{
        fontSize: Dimensions.get("window").width*0.045,
        color: "#000"
    },

    selectorTileDisabled:{
        backgroundColor:"#DDD",
        width:Dimensions.get("window").width*0.85,
        padding:20
    },

    selectorTileTextDisabled:{
        fontSize: Dimensions.get("window").width*0.045,
        color: "#555"
    }
});

export default ResultPage;
