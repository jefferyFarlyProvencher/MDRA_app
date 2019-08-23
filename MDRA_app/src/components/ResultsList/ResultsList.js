import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native'
import {List, ListItem, SearchBar} from 'react-native-elements'
import SwipeOut  from 'react-native-swipeout'
import Swipeable from 'react-native-swipeable'
import * as colors from "../../assets/colors";
import Feather from 'react-native-vector-icons/Feather'
//components
import SelectorPicker from '../SelectorPicker/SelectorPicker';
import DropDownListV2 from "../../components/DropDownList/DropDownListV2";

//credits to vikrant negi which helped with the search bar
class ResultsList extends Component{



    state = {
        //list that will be manipulated for the search bar
        modifiedList : this.props.list,
        searchTarget: 'Name',
        searchText : "",
        date: new Date(),
        patientTarget: "None Selected",
        isSwiping:false,
    };


    componentWillReceiveProps (nextProps) {
        if (nextProps.list !== this.props.list) {
            this.setState({
                modifiedList : nextProps.list,
                searchText : "",
                selectedList: this.props.selectedList
            })
        }
    }
    //
    // handlePressIn = () => {
    //     this.setState(oldState => {
    //         return {
    //             ...oldState,
    //             pressedInTime: oldState.date.getSeconds()
    //         };
    //     })
    // };
    //
    // handlePressOut= () => {
    //     this.setState(oldState => {
    //         return {
    //             ...oldState,
    //             pressedOutTime: oldState.date.getSeconds()
    //         };
    //     })
    // };

    handleOnPressDelete = (key) => {
        this.props.onRemoveData(key);
    };

    handleOnPressRename = (key) => {
        this.props.onRenameData(key);
    };

    // searchFilterFunction = text => {
    //     console.log("searchFilterFunction start and the text is: "+text);
    //     let tempNewData = null;
    //     if(this.state.searchTarget === 'Name'){
    //         console.log("filtering with Name");
    //         tempNewData = (this.props.list).filter(item => {
    //             const itemData = `${item.name.toUpperCase()}
    //                           ${item.name.toUpperCase()}
    //                           ${item.name.toUpperCase()}`;
    //             const textData = text.toUpperCase();
    //
    //             return itemData.indexOf(textData) > -1;
    //         });
    //     }
    //     else if(this.state.searchTarget === 'Date'){
    //         console.log("filtering with Date");
    //         tempNewData = (this.props.list).filter(item => {
    //             if(item.date !== 'null' && typeof item.date !== "undefined") {
    //                 console.log("filtering with Date -> passed if");
    //                 const itemData = `${item.date.toUpperCase()}
    //                           ${item.date.toUpperCase()}
    //                           ${item.date.toUpperCase()}`;
    //                 const textData = text.toUpperCase();
    //
    //                 return itemData.indexOf(textData) > -1;
    //             }else{
    //                 return false
    //             }
    //         });
    //     }
    //     else if(this.state.searchTarget === 'Patients'){
    //         console.log("filtering with Patients");
    //         if(text === "None Selected"){
    //             text = ''
    //         }
    //         tempNewData = (this.props.list).filter(item => {
    //             if(typeof item.patient !== 'undefined' && item.patient !== null) {
    //                 const itemData = `${item.patient.toUpperCase()}
    //                               ${item.patient.toUpperCase()}
    //                               ${item.patient.toUpperCase()}`;
    //                 const textData = text.toUpperCase();
    //
    //                 return itemData.indexOf(textData) > -1;
    //             }else{
    //                 return false
    //             }
    //         });
    //     }
    //     /// OLD CODE START
    //     // const newData = (this.props.list).filter(item => {
    //     //     const itemData = `${item.name.toUpperCase()}
    //     //                       ${item.name.toUpperCase()}
    //     //                       ${item.name.toUpperCase()}`;
    //     //     const textData = text.toUpperCase();
    //     //
    //     //     return itemData.indexOf(textData) > -1;
    //     // });
    //     /// OLD CODE END
    //     const newData = tempNewData;
    //     //console.log(JSON.stringify("modList 1: "+ this.state.modifiedList));
    //     // console.log(JSON.stringify("size modList 1: "+ this.state.modifiedList.length));
    //     this.setState({
    //         modifiedList: newData,
    //         searchText: text
    //     });
    //     // console.log(JSON.stringify("modList 2: "+ this.state.modifiedList));
    //     // console.log(JSON.stringify("size modList 2: "+ this.state.modifiedList.length));
    // };
    //
    // handlePatientProfileSelection = (profile) =>{
    //     this.setState(oldState=> {
    //         return{
    //             ...oldState,
    //             patientTarget: profile
    //         }
    //
    //     })
    // };
    //

    // handleItemSelected = (target) => {
    //     console.log("target: "+ target);
    //     this.setState(oldState=> {
    //         return{
    //             ...oldState,
    //             searchTarget: target
    //         }
    //
    //     })
    // };
    //
    // renderHeader = () => {
    //     let selectorChoices= [
    //         {
    //             key: '0848496513',
    //             name: "Result Name",
    //             subtitle:"",
    //             displayName: "Name",
    //         },
    //         {
    //             key: '15555884454',
    //             name: "Creation Date\n(format: YYYY-MM-DD)",
    //             displayName: "Date"
    //         },
    //         {
    //             key: '26655894135',
    //             name: "Patient Profile",
    //             displayName: "Patients"
    //         },
    //     ];
    //
    //     let isPatients = this.state.searchTarget !== "Patients";
    //
    //
    //
    //     let patientsList_id = ["None Selected"];
    //
    //     if(!isPatients){
    //         for(let i = 0; i < this.props.patientsList.length; i++)
    //         {
    //             patientsList_id.push(this.props.patientsList[i].id);
    //         }
    //     }
    //
    //     return (
    //         <View style={{flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
    //             <View style={{width: Dimensions.get("window").width *0.8}}>
    //                 {isPatients
    //                     ?<SearchBar
    //                         placeholder={"Press to Search"}
    //                         lightTheme={false}
    //                         round={true}
    //                         onChangeText={text => this.searchFilterFunction(text)}
    //                         autoCorrect={false}
    //                         containerStyle={{backgroundColor:"#262626", borderTopWidth:0, borderBottomWidth:0, marginBottom:0, paddingBottom:0}}
    //                     />
    //                     :<View style={{flexDirection:"row", width:"92%", marginLeft: 10, }}>
    //                         <DropDownListV2
    //                             value={this.state.patientTarget}
    //                             onChange={(name,value)=>{
    //                                 this.handlePatientProfileSelection(value);
    //                                 this.searchFilterFunction(value)
    //                             }}
    //                             itemList={patientsList_id}
    //                             Picker={this.props.Picker}
    //                             setDarkVisibility = {this.props.handleSetDarkVisibility}
    //                             pickerBackgroundColor={"#303338"}
    //                             textColor={"#FFF"}
    //                         />
    //                     </View>
    //                 }
    //             </View>
    //             <SelectorPicker choices={selectorChoices} itemSelected={this.handleItemSelected} style={{borderRadius:100}}/>
    //         </View>
    //     );
    // };

    setIsSwiping = (value) => {
        this.setState(oldState => {
            return{
                ...oldState,
                isSwiping: value
            }
        })
    };

    render() {
        // let rightButtons = [
        //     <TouchableOpacity
        //         style={[styles.rightSwipeItem, {backgroundColor:colors.royalBlue4}]}
        //         onPress={() => {this.handleOnPressRename(info.item.key)}}
        //     >
        //         {/*<Text style={{color:"#FFF"}}>Rename</Text>*/}
        //         <Feather
        //             size={25}
        //             name= {"edit"}
        //             color="#FFF"
        //             style={[styles.drawerItemIcon]}
        //         />
        //     </TouchableOpacity>,
        //     <TouchableOpacity
        //         style={[styles.rightSwipeItem, {backgroundColor:"#ff374b"}]}
        //         onPress={()=>this.handleOnPressDelete(info.item.key)}
        //     >
        //         {/*<Text style={{color:"#FFF"}}>Delete</Text>*/}
        //         <Feather
        //             size={25}
        //             name= {"trash"}
        //             color="#FFF"
        //             style={[styles.drawerItemIcon]}
        //         />
        //     </TouchableOpacity>
        // ];
        //console.log("size of list inside render: "+this.state.modifiedList.length);
        return (
            <View style={{alignContent:"center",backgroundColor:"#FFF", flex:1}}>
                {/*<List*/}
                    {/*containerStyle={{margin:0, padding:0, borderTopWidth:0, borderBottomWidth:0}}*/}
                {/*>*/}
                    <FlatList
                        style={[styles.listContainer, this.props.listStyle]}
                        data={this.state.modifiedList}
                        extraData={this.state.modifiedList}
                        scrollEnabled={!this.state.isSwiping}
                        ListHeaderComponent={this.props.header}
                        renderItem={(info) => {
                           //console.log("info: "+JSON.stringify(info));
                            return (

                                <Swipeable
                                    onRef={ref => this.swipeable = ref}
                                    rightButtons={
                                        [
                                            <TouchableOpacity
                                                style={[styles.rightSwipeItem, {backgroundColor:colors.royalBlue4}]}
                                                onPress={() => {this.handleOnPressRename(info.item.key)}}
                                            >
                                                {/*<Text style={{color:"#FFF"}}>Rename</Text>*/}
                                                <Feather
                                                    size={25}
                                                    name= {"edit"}
                                                    color="#FFF"
                                                    style={[styles.drawerItemIcon]}
                                                />
                                            </TouchableOpacity>,
                                            <TouchableOpacity
                                                style={[styles.rightSwipeItem, {backgroundColor:"#ff374b"}]}
                                                onPress={()=>this.handleOnPressDelete(info.item.key)}
                                            >
                                                {/*<Text style={{color:"#FFF"}}>Delete</Text>*/}
                                                <Feather
                                                    size={25}
                                                    name= {"trash"}
                                                    color="#FFF"
                                                    style={[styles.drawerItemIcon]}
                                                />
                                            </TouchableOpacity>
                                        ]
                                        // [
                                        //     {
                                        //
                                        //         text: "Rename",
                                        //         color: "white",
                                        //         backgroundColor: colors.royalBlue4,
                                        //         onPress: () => {
                                        //             this.handleOnPressRename(info.item.key)
                                        //         },
                                        //     },
                                        //     {
                                        //
                                        //         text: "Delete",
                                        //         color: "white",
                                        //         backgroundColor: "#ff374b",
                                        //         onPress: () => {
                                        //             this.handleOnPressDelete(info.item.key)
                                        //         },
                                        //     },]
                                    }
                                    onSwipeStart={() => this.setIsSwiping(true)}
                                    onSwipeRelease={() => this.setIsSwiping(false)}
                                    // backgroundColor={((info.index % 2) === 0) ? "#FFF" : "#f3f3f3"}
                                >
                                    <ListItem
                                        roundAvatar
                                        title={"Test Result: " + info.item.name}
                                        subtitle={info.item.patient?info.item.patient:" "}
                                        key={info.item.key}
                                        onLongPress={() => {
                                            this.props.onToggleSelectorList(info.item.key);
                                            console.log('Item selected: ' + info.item.key);
                                            console.log('pressed slowly');
                                        }
                                        }
                                        onPress={() => {
                                            this.props.onItemAccessed(info.item.key, this.state.modifiedList);
                                            console.log('Item accessed: ' + info.item.key);
                                            console.log('pressed quickly');
                                        }}
                                        containerStyle={{
                                            backgroundColor:((info.index % 2) === 0) ? "#FFF" : "#f3f3f3"
                                        }}
                                    />
                                </Swipeable>
                            )
                        }}

                        keyExtractor={item => item.key}
                        />

                {/*</List>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer:{
        width: "100%",
        //height:"95%"
        //height: (Dimensions.get('window').height)*0.75,
    },

    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        // alignItems:"center",
        // width: 75,
        paddingLeft: 25
    },

});

export default ResultsList;