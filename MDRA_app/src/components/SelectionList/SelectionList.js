import React, {Component} from 'react'
import {View, Text,StyleSheet, FlatList, TouchableWithoutFeedback} from 'react-native'
import {List, ListItem, SearchBar, CheckBox} from 'react-native-elements'
import Swipeout  from 'react-native-swipeout'

//credits to vikrant negi which helped with the search bar
class SelectionList extends Component{



    state = {
        //list that will be manipulated for the search bar
        modifiedList : this.props.list,
        searchText : "",
        selectedList: []
    };


    componentWillReceiveProps (nextProps) {
        if (nextProps.list !== this.props.list) {
            this.setState({
                modifiedList : this.props.list,
                searchText : "",
                selectedList: [this.props.selectedList]
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
        // console.log(JSON.stringify("modList 1: "+ this.state.modifiedList));
        // console.log(JSON.stringify("size modList 1: "+ this.state.modifiedList.length));
        this.setState({
            modifiedList: newData,
            searchText: text
        });
        // console.log(JSON.stringify("modList 2: "+ this.state.modifiedList));
        // console.log(JSON.stringify("size modList 2: "+ this.state.modifiedList.length));
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
        this.setState((oldState)=>{
            return {
                ...oldState,
                selectedList:newList
            }
        });
        console.log("selectedList after:"+JSON.stringify(this.state.selectedList));
        //reload screen?
    };

    handleIsItemChecked = (key) =>{
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
        console.log(JSON.stringify(this.state.selectedList));
        return (
            <View style={{alignContent:"center",backgroundColor:"#262626"}}>
                {this.renderHeader()}
                <List containerStyle={{margin:0, padding:0, borderTopWidth:0, borderBottomWidth:0}}>
                    <FlatList
                        style={styles.listContainer}
                        data={this.state.searchText !== ""?this.state.modifiedList:this.props.list}
                        extraData={this.props.extraData}
                        renderItem={(info) => {
                            console.log(this.handleIsItemChecked(info.item.key));
                            return (
                                <View>
                                    <CheckBox
                                        checked={
                                            this.handleIsItemChecked(info.item.key)
                                        }
                                        title={info.item.name}
                                        onPress={() => {
                                            console.log("selecting: " + info.item.key);
                                            this.handleItemSelected(info.item.key)
                                        }}
                                        containerStyle={{margin: 0}}
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
        width: "100%",
        height:"100%"
    },
});

export default SelectionList;