import React, {Component} from 'react';
import {
    View,
    Text,
    Platform,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert,
    BackHandler, Switch
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import Ionicon from 'react-native-vector-icons/Ionicons';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    addToResultList,
    allowAdvancedOptions,
    emptyResultList,
    restoreBackUp,
    backUpBeforeDeletion,
    addData, changePosition
} from "../../store/actions";
import testNetWorkConnection from '../../functions/testNetworkConnection/';
import * as colors from "../../assets/colors";

class SideDrawer extends Component{

    handleFetchVersion = () => {
        //TODO: find a way to get version

        let version = "v0.5.2";
        return version;
    };

    logOutHandler = () => {
        this.props.onChangePosition(0);
        Navigation.startSingleScreenApp({
            screen: {
                screen: "MDRA_app.startScreen",
                title: "startScreen"
            }
        });
    };

    handleRetrieveResultsScreen = () => {
        this.props.navigator.handleDeepLink({ link: "retrieveOldResults"});
    };

    handleConnectionTest = async()=>{
        console.log("commencing connection test");
        if(await testNetWorkConnection())
        {
            console.log("connected");
            alert("Connection successful")
        }
        else{
            console.log("not connected");
            alert("Connection was unsuccessful")
        }
        console.log("RETURNING from connection test");
    };

    handleEmptyResultList = async() => {
        Alert.alert(
            'Confirmation',
            'Do you really want to erase all of the Results?', [
                {
                    text: 'Nevermind, no',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Yes, erase everything',
                    onPress: () => {
                        if(this.props.state.main.resultsList.length > 0) {
                            this.props.onBackUpResultList();
                            this.props.onEmptyResultList()
                        }
                    }
                }
            ],
            {
                cancelable: false
            }
        );

    };

    handleReloadBackup = async() => {
        Alert.alert(
            'Confirmation',
            'Do you really want to restore the previously emptied Results?', [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Agree',
                    onPress: () => this.props.onRestoreBackUp()
                }
            ],
            {
                cancelable: false
            }
        );
    };

    render() {
        let IsBackUpRestoreDisabled = (this.props.state.main.backUpResultList === undefined || this.props.state.main.backUpResultList.length === 0 );
        console.log("Update of SideDrawer");
        return(
            <View style = {[{width: Dimensions.get("window").width *0.7}, styles.container]}>
                <View>
                    <Text style={styles.titleStyle}>Menu</Text>
                </View>
                <TouchableOpacity onPress={this.logOutHandler}>
                    <View  style={styles.drawerItem}>
                        <Ionicon
                            size={40}
                            name= {Platform.OS==='android'? "md-log-out" :"ios-log-out-outline"}
                            color="#52afff"
                            style={styles.drawerItemIcon}
                        />
                        <Text>Log Out</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        this.handleRetrieveResultsScreen();
                    }}
                >
                <View  style={[styles.drawerItem]}>
                    <Ionicon
                        size={40}
                        name={Platform.OS==='android'? "md-search" :"ios-search"}
                        color="#52afff"
                        style={styles.drawerItemIcon}
                    />
                    <Text style={{color:"#000000"}}>Retrieve Old Results</Text>
                </View>
            </TouchableOpacity>
                <TouchableOpacity onPress={this.props.allowAdvancedOptions}>
                    <View  style={styles.drawerItem}>
                        {/*<Ionicon*/}
                            {/*size={40}*/}
                            {/*name= {Platform.OS==='android'? "md-add-circle" :"ios-add-circle"}*/}
                            {/*color="#52afff"*/}
                            {/*style={styles.drawerItemIcon}*/}
                        {/*/>*/}
                        <View style={{marginRight: 10}}>
                            <Switch
                                value={this.props.state.main.advanceTabAccessible}
                                onValueChange={this.props.allowAdvancedOptions}
                                tintColor={"#ddd"}
                                onTintColor={"#52afff"}
                                thumbTintColor={(Platform==="ios"? "white": '#eee')}
                            />
                        </View>
                        <Text>{this.props.state.main.advanceTabAccessible?"Disable Advanced tab":"Enable Advanced tab"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleConnectionTest}>
                    <View  style={styles.drawerItem}>
                        <Ionicon
                            size={40}
                            name= {Platform.OS==='android'? "md-sync" :"ios-sync"}
                            color="#52afff"
                            style={styles.drawerItemIcon}
                        />
                        <Text>Connection test</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleReloadBackup}
                    disabled={IsBackUpRestoreDisabled}
                >
                    <View  style={[styles.drawerItem,{borderBottomWidth: 1,}]}>
                        <MatComIcon
                            size={40}
                            name= {"backup-restore"}
                            color={(IsBackUpRestoreDisabled)?"#DDD":"#52afff"} style={[styles.drawerItemIcon]}
                        />
                        <Text style={(IsBackUpRestoreDisabled)?{color:"#DDD"}:{color:"#52afff"}}>Restore BackUp List</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleEmptyResultList}
                >
                    <View  style={[styles.drawerItem,{borderBottomWidth: 1,}]}>
                        <Ionicon
                            size={40}
                            name= {Platform.OS==='android'? "md-trash" :"ios-trash"}
                            color="#52afff" style={[styles.drawerItemIcon]}
                        />
                        <Text>Empty ResultsList</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Alert.alert("About MDRA",
                            "This app was developed in affiliation with the Universite de Montreal for use by a professional.\n It is not necessarily a tool for play. " +
                        "\n"+ "This app has also partnered with WeTakeCare for a more seamless integration of systems of the mentioned application into this one."
                        )}
                >
                    <View  style={[styles.drawerItem,{borderBottomWidth: 1,}]}>
                        <FontAwesome
                            size={40}
                            name= {"question-circle-o"}
                            color="#AAA" style={[styles.drawerItemIcon]}
                        />
                        <Text>About this app</Text>
                    </View>
                </TouchableOpacity>
                <View style={{position:'absolute',bottom:0, left:0}}>
                    <Text style={{color:"grey"}}>{this.handleFetchVersion()}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       paddingTop: 22,
       backgroundColor: "white",
   },
    drawerTitle: {
      marginBottom: 10
    },
   drawerItem: {
       flexDirection: "row",
        alignItems: "center",
       padding:10,
       backgroundColor: "#fff",
       borderTopWidth: 1,
   },

    titleStyle:{
       marginVertical:10,
        textAlign: "center",
        fontSize: 30
    },

   drawerItemIcon: {
       marginRight: 10
   }
});

const mapDispatchToProps = dispatch => {
    return {
        allowAdvancedOptions: () => dispatch(allowAdvancedOptions()),
        onAddToResultList: (data)=> dispatch(addToResultList(data)),
        onEmptyResultList: () => dispatch(emptyResultList()),
        onBackUpResultList: () => dispatch(backUpBeforeDeletion()),
        onRestoreBackUp: () => dispatch(restoreBackUp()),
        onChangePosition: (position) => dispatch(changePosition(position))
    };
};

const mapStateToProps = state => {
  return {state}
};

export default connect(mapStateToProps,mapDispatchToProps)(SideDrawer);