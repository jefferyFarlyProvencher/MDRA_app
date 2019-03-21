import React, {Component} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Button, Dimensions} from 'react-native'
import {List, ListItem, SearchBar} from 'react-native-elements'
import Swipeout  from 'react-native-swipeout'

//components
import CheckBox from '../../components/CheckBox/CheckBox'
import * as colors from '../../assets/colors'

//credits to vikrant negi which helped with the search bar
class SelectionList extends Component{



    state = {
        //list that will be manipulated for the search bar
        modifiedList : this.props.list,
        searchText : "",
        selectedList: [this.props.selectedValue],
    };


    componentWillReceiveProps (nextProps) {
        if (nextProps.list !== this.props.list) {
            this.setState({
                modifiedList : this.props.list,
                searchText : "",
            })
        }
    }

    searchFilterFunction = text => {
        console.log("searchFilterFunction start and the text is: "+text);
        const newData = (this.props.list).filter(item => {
            const itemData = `${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            modifiedList: newData,
            searchText: text
        });

    };

    //adds or removes key from list of selected elements
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

        this.props.disableDeleteButton(newList.length);

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

    renderHeader = () => {
        return (
            <SearchBar
                placeholder={"Press to Search"}
                lightTheme={false}
                round={false}
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                containerStyle={{backgroundColor:"#262626", borderTopWidth:0, borderBottomWidth:0, marginBottom:0, paddingBottom:0}}
            />
        );
    };

    render() {
        return (
            <View style={{alignContent:"center",backgroundColor:"#262626"}}>
                {this.renderHeader()}
                <List containerStyle={{margin:0, padding:0, borderTopWidth:0, borderBottomWidth:0}}>
                    <FlatList
                        style={styles.listContainer}
                        data={this.state.searchText !== ""?this.state.modifiedList:this.props.list}
                        extraData={this.state}
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
                                            backgroundColor: "transparent",
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
                                        containerStyle={{width:"90%", paddingLeft:0, marginLeft:0}}
                                    />
                                </View>
                            )
                        }}
                        keyExtractor={item => item.name}
                    />
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer:{
        //width: "100%",
        height: (Dimensions.get('window').height)*0.70,
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