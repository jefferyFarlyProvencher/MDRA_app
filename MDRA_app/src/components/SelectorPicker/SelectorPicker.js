import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    TouchableHighlight,
    FlatList, Image
} from 'react-native';
//import {Button} from 'react-native-elements';
import 'react-native-svg';
import {ListItem} from "react-native-elements";
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
        let differentDisplay = selectedItem.displayName !== null && typeof selectedItem.displayName !== "undefined";
        this.setState((oldState)=>{
            return({
                ...oldState,
                selectedItem: selectedItem
            })
        });
        this.handleSelectorToggle(false);
        this.props.itemSelected(selectedItem)
    };

//    Animated.sequence([

    render() {

        const pickerElements = this.props.choices.map(item => {
            return(
                <View  key={item.key}>
                    <TouchableHighlight onPress={()=>{this.handleItemSelected(item.displayName)}}>
                        <View style={styles.selectorTile}>
                            <Text style={styles.selectorTileText}>{item.name}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            )
        });

        return(
            <View style={{flex:1}}>
                <View >
                    <TouchableOpacity onPress={()=>{console.log("toggling selector");this.handleSelectorToggle(true)}}>
                        <View
                            style={
                                [
                                    {
                                        alignItems:"center",
                                        justifyContent:"center",
                                        backgroundColor:"#2e2e2e",
                                        height: Dimensions.get("window").height*0.05,
                                        // width: Dimensions.get("window").width*0.17,
                                        padding: 10,
                                        marginHorizontal: 5
                                    },
                                    this.props.style
                                ]}
                        >
                            <Text style={
                                [
                                    {
                                        color:'#e4e4e4',
                                        textAlign: "center"
                                    },
                                    this.props.textStyle
                                ]
                            }>{this.state.selectedItem}</Text>
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
                            {pickerElements}
                            {/*<View>*/}
                                {/*<TouchableHighlight onPress={()=>{this.handleItemSelected("Name")}}>*/}
                                    {/*<View style={styles.selectorTile}>*/}
                                        {/*<Text style={styles.selectorTileText}>Result Name</Text>*/}
                                    {/*</View>*/}
                                {/*</TouchableHighlight>*/}
                                {/*<TouchableHighlight onPress={()=>{this.handleItemSelected("Date")}}>*/}
                                    {/*<View style={styles.selectorTile}>*/}
                                        {/*<Text style={styles.selectorTileText}>{"Creation Date \n(format: YYYY-MM-DD)"}</Text>*/}
                                    {/*</View>*/}
                                {/*</TouchableHighlight>*/}
                                {/*<TouchableHighlight onPress={()=>{this.handleItemSelected("Patients")}}>*/}
                                    {/*<View style={styles.selectorTile}>*/}
                                        {/*<Text style={styles.selectorTileText}>Patient Name</Text>*/}
                                    {/*</View>*/}
                                {/*</TouchableHighlight>*/}
                            {/*</View>*/}
                            {/*<FlatList*/}
                                {/*contentContainterStyle={{*/}
                                    {/*flex:1,*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                {/*}}*/}
                                {/*data={this.props.choices}*/}
                                {/*renderItem={(info) =>*/}
                                    {/*<TouchableHighlight onPress={()=>{this.handleItemSelected(info.item)}}>*/}
                                        {/*<View style={styles.selectorTile}>*/}
                                            {/*<Text style={styles.selectorTileText}>{info.item.name}</Text>*/}
                                        {/*</View>*/}
                                    {/*</TouchableHighlight>*/}
                                {/*}*/}
                            {/*/>*/}
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
{/*<ListItem*/}
{/*roundAvatar*/}
{/*title={info.item.name}*/}
{/*key={info.item.key}*/}
{/*onLongPress={() => {*/}
{/*this.props.handleItemSelected(info.item);*/}
{/*console.log('Item Accessed: ' + info.item.name);*/}
{/*console.log('pressed slowly');*/}
{/*}*/}
{/*}*/}
{/*onPress={() => {*/}
{/*this.props.handleItemSelected(info.item);*/}
{/*console.log('Item accessed: ' + info.item.key);*/}
{/*console.log('pressed quickly');*/}
{/*}}*/}
{/*containertyle={{backgroundColor:"#FFF"}}*/}
{/*/>*/}

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
