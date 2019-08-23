import React, {Component} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Button, Dimensions} from 'react-native'
import {List, ListItem, SearchBar} from 'react-native-elements'
import Swipeout  from 'react-native-swipeout'

//components
import CheckBox from '../../components/CheckBox/CheckBox'
import * as colors from '../../assets/colors'
import SwipeOut from "../ResultsList/ResultsList";

//credits to vikrant negi which helped with the search bar
class SelectionList extends Component{



    state = {
        //list that will be manipulated for the search bar
        modifiedList : this.props.list,
        searchText : "",
        selectedList: [this.props.selectedValue],
    };


    componentWillReceiveProps (nextProps) {
        console.log("SelectionList will receive props");
        if (nextProps.list !== this.props.list) {
            //console.log('Next props list: ' + JSON.stringify(nextProps.list));
            this.setState({
                modifiedList : nextProps.list,
                searchText : "",
            })
        }
        //console.log('current props list: ' + JSON.stringify(this.props.list));

    }

    // searchFilterFunction = text => {
    //     console.log("searchFilterFunction start and the text is: "+text);
    //     const newData = (this.props.list).filter(item => {
    //         const itemData = `${item.name.toUpperCase()}
    //                           ${item.name.toUpperCase()}
    //                           ${item.name.toUpperCase()}`;
    //         const textData = text.toUpperCase();
    //
    //         return itemData.indexOf(textData) > -1;
    //     });
    //     this.setState({
    //         modifiedList: newData,
    //         searchText: text
    //     });
    //
    // };
    //
    // //adds or removes key from list of selected elements
    handleItemSelected = (key) => {
        console.log("selectedList before:"+JSON.stringify(this.state.selectedList));
        //update key
        let isInList = false;
        let i = 0;
        for(i; i < this.state.selectedList.length; i++)
        {
            if(this.state.selectedList[i] === key) {
                isInList = true;
                break;
            }
        }
        let newList = this.state.selectedList.slice();
        if(isInList){
            newList.splice(i, 1)

        }
        else {
            newList.push(key);
        }

        this.props.disableDeleteButton(newList.length, newList);

        this.setState((oldState)=>{
            return {
                ...oldState,
                selectedList:newList,
            }
        });
       // console.log("selectedList after:"+JSON.stringify(this.state.selectedList));
        //reload screen?
    };

    handleIsItemChecked = (key, selectedList) =>{
        let localList = selectedList?selectedList: this.state.selectedList;
        let isInList = false;
        let i = 0;
        for(i; i < this.state.selectedList.length; i++)
        {
            if(this.state.selectedList[i] === key) {
                isInList = true;
                break;
            }
        }

        return isInList;
    };

    // renderHeader = () => {
    //     return (
    //         <SearchBar
    //             placeholder={"Press to Search"}
    //             lightTheme={false}
    //             round={false}
    //             onChangeText={text => this.searchFilterFunction(text)}
    //             autoCorrect={false}
    //             containerStyle={{backgroundColor:"#262626", borderTopWidth:0, borderBottomWidth:0, marginBottom:0, paddingBottom:0}}
    //         />
    //     );
    // };

    render() {
        //console.log("size of list inside render: "+this.state.modifiedList.length);
        return (
            <View style={{alignContent:"center",backgroundColor:"#FFF"}}>
                <FlatList
                    style={[styles.listContainer, this.props.listStyle]}
                    data={this.state.modifiedList}
                    extraData={this.state.modifiedList.length}
                    ListHeaderComponent={this.props.header}
                    renderItem={(info) => {
                        return (
                            <View style={{flexDirection: "row"}}>
                                <CheckBox
                                    checked={this.handleIsItemChecked(info.item.key)}
                                    onPress={() => {
                                        console.log("selecting: " + info.item.key);
                                        this.handleItemSelected(info.item.key)
                                    }}
                                    containerStyle={{
                                        margin: 0,
                                        paddingHorizontal: 0,
                                        borderWidth: 0,
                                        borderBottomWidth:0.5,
                                        borderBottomColor: "grey",
                                        backgroundColor: ((info.index % 2) === 0) ? "#FFF" : "#f3f3f3",
                                        width:"10%",
                                        alignItems: 'center',
                                        justifyContent: "center"
                                    }}
                                />
                                <ListItem
                                    title={"Test Result: " + info.item.id}
                                    subtitle={info.item.name}
                                    key={info.item.key}
                                    onPress={() => {
                                        console.log("selecting: " + info.item.key);
                                        this.handleItemSelected(info.item.key)
                                    }
                                    }
                                    containerStyle={{
                                        width:"90%",
                                        paddingLeft:0,
                                        marginLeft:0,
                                        backgroundColor:((info.index % 2) === 0) ? "#FFF" : "#f3f3f3"
                                    }}
                                />
                            </View>
                        )
                    }}
                    keyExtractor={item => item.name}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer:{
        //width: "100%",
        //height: (Dimensions.get('window').height)*0.70,
    },

    buttonContainer:{
        //flexDirection: "row"
    },

    buttonStyle:{
        width: '50%',
        marginBottom: 0,
        paddingBottom: 0
    }
});

export default SelectionList;