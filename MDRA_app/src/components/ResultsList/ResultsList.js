import React from 'react'
import {View, Text,StyleSheet, FlatList} from 'react-native'
import {List, ListItem} from 'react-native-elements'
import Swipeout  from 'react-native-swipeout'

const ResultsList = (props) => {
    const handleOnPressDelete = (key) => {
        props.onRemoveData(key);
    };

    const handleOnPressRename = (key) => {
        //TODO: launch rename prompt
        props.onRenameData(key, newName);
      console.log("Should rename this item: "+ key);
    };
    return(
        <List>
            <FlatList
                style={styles.listContainer}
                data = {props.list}
                renderItem ={(info)=> (
                    <Swipeout
                        right={
                            [
                                {

                                    text: "Rename",
                                    color: "white",
                                    backgroundColor: "teal",
                                    onPress: () =>{ handleOnPressRename(info.item.key)},
                                },
                                {

                                    text: "Delete",
                                    color: "white",
                                    backgroundColor: "red",
                                    onPress: () =>{ handleOnPressDelete(info.item.key)},
                                },]
                        }
                        backgroundColor="white"
                    >
                        <ListItem
                            roundAvatar
                            title="Test Result"
                            subtitle={info.item.name}
                            key={info.item.key}
                            onPress = {() => {
                            props.onItemSelected(info.item.key);
                            console.log('Item selected: ' + info.item.key);
                            }
                            }
                        />
                    </Swipeout>

                )}

            />
        </List>
    );
};

const styles = StyleSheet.create({
    listContainer:{
    width: "100%",
    margin: 10
    },

    welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    }
});

export default ResultsList;