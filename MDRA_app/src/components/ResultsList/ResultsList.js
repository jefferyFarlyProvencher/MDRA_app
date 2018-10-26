import React, {Component} from 'react'
import {View, Text,StyleSheet, FlatList} from 'react-native'
import {List, ListItem, SearchBar} from 'react-native-elements'
import Swipeout  from 'react-native-swipeout'

//credits to vikrant negi which helped with the search bar
class ResultsList extends Component{



    state = {
        //list that will be manipulated for the search bar
        modifiedList : this.props.list,
        searchText : ""
    };


    componentWillReceiveProps (nextProps) {
        if (nextProps.list !== this.props.list) {
            this.setState({
                modifiedList : this.props.list,
                searchText : ""
            })
        }
    }

    handleOnPressDelete = (key) => {
        this.props.onRemoveData(key);
    };

    handleOnPressRename = (key) => {
        this.props.onRenameData(key);
    };

    searchFilterFunction = text => {
        console.log("searchFilterFunction start and the text is: "+text);
        const newData = (this.props.list).filter(item => {
            const itemData = `${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log(JSON.stringify("modList 1: "+ this.state.modifiedList));
        console.log(JSON.stringify("size modList 1: "+ this.state.modifiedList.length));
        this.setState({
            modifiedList: newData,
            searchText: text
        });
        console.log(JSON.stringify("modList 2: "+ this.state.modifiedList));
        console.log(JSON.stringify("size modList 2: "+ this.state.modifiedList.length));
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder={"Press to Search"}
                lightTheme={false}
                round={true}
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
                        extraData={this.props.extraData}
                        renderItem={(info) => (
                            <Swipeout
                                right={
                                    [
                                        {

                                            text: "Rename",
                                            color: "white",
                                            backgroundColor: "teal",
                                            onPress: () => {
                                                this.handleOnPressRename(info.item.key)
                                            },
                                        },
                                        {

                                            text: "Delete",
                                            color: "white",
                                            backgroundColor: "red",
                                            onPress: () => {
                                                this.handleOnPressDelete(info.item.key)
                                            },
                                        },]
                                }
                                backgroundColor="white"
                            >
                                <ListItem
                                    roundAvatar
                                    title={"Test Result: " + info.item.id}
                                    subtitle={info.item.name}
                                    key={info.item.key}
                                    onPress={() => {
                                        this.props.onItemSelected(info.item.key);
                                        console.log('Item selected: ' + info.item.key);
                                    }
                                    }
                                />
                            </Swipeout>
                        )}
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

export default ResultsList;