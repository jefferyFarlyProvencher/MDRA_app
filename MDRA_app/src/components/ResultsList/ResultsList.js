import React from 'react'
import {View, Text,StyleSheet, FlatList} from 'react-native'
import {List, ListItem} from 'react-native-elements'

const ResultsList = (props) => {
    return(
        <List>
            <FlatList
                style={styles.listContainer}
                data = {props.list}
                renderItem ={(info)=> (
                    <ListItem
                        roundAvatar
                        title="Test Result"
                        subtitle={""+Date.now()}
                        key={info.key}
                        onPress = {() => {
                        props.onItemSelected(info.item.key);
                        console.log('Item selected: ' + info.item.key);
                        }
                        }
                    />

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