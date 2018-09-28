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
    BackHandler
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {addToResultList, allowAdvancedOptions, emptyResultList} from "../../store/actions";
import SendForm from '../../components/SendForm/SendForm'

class SideDrawer extends Component{
    logOutHandler = () => {
        Navigation.startSingleScreenApp({
            screen: {
                screen: "MDRA_app.mainScreen",
                title: "mainScreen"
            }
        });
    };

    handleConnectionTest = async()=>{
        console.log("commencing");
        console.log(await SendForm());
        console.log("RETURNED");
    };

    handleCreatorTest = async () => {
        /*let data = await SendForm();
        if(data !== -1) {
            //console.log(JSON.stringify(data));
            this.props.onAddToResultList(data);
            //console.log(JSON.stringify(FormatReceivedData(data)));
            //this.props.onAddToResultList(FormatReceivedData(data));
            ToastAndroid.showWithGravity("Data added to List", 1, ToastAndroid.BOTTOM);
        }
        */
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
                    onPress: () => this.props.onEmptyResultList()
                }
            ],
            {
                cancelable: false
            }
        );

    };

    render() {
        return(
            <View style = {[{width: Dimensions.get("window").width *0.7}, styles.container]}>
                <View>
                    <Text style={{marginVertical:10, textAlign: "center", fontSize: 30}}>Menu</Text>
                </View>
                <TouchableOpacity onPress={this.logOutHandler}>
                    <View  style={styles.drawerItem}>
                        <Icon
                            size={40}
                            name= {Platform.OS==='android'? "md-log-out" :"ios-log-out-outline"}
                            color="#52afff" style={styles.drawerItemIcon}
                        />
                        <Text>Log Out</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.allowAdvancedOptions}>
                    <View  style={styles.drawerItem}>
                        <Icon
                            size={40}
                            name= {Platform.OS==='android'? "ios-nutrition" :"ios-log-out-outline"}
                            color="#52afff" style={styles.drawerItemIcon}
                        />
                        <Text>Advanced tab enabler</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleConnectionTest}>
                    <View  style={styles.drawerItem}>
                        <Icon
                            size={40}
                            name= {Platform.OS==='android'? "md-sync" :"ios-sync"}
                            color="#52afff" style={styles.drawerItemIcon}
                        />
                        <Text>Connect test</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleCreatorTest}>
                    <View  style={styles.drawerItem}>
                        <Icon
                            size={40}
                            name= {Platform.OS==='android'? "md-bowtie" :"ios-bowtie"}
                            color="#52afff" style={styles.drawerItemIcon}
                        />
                        <Text>Create test</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleEmptyResultList}>
                    <View  style={[styles.drawerItem,{borderBottomWidth: 1,}]}>
                        <Icon
                            size={40}
                            name= {Platform.OS==='android'? "md-trash" :"ios-trash"}
                            color="#52afff" style={[styles.drawerItemIcon]}
                        />
                        <Text>Empty Result List</Text>
                    </View>
                </TouchableOpacity>

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

   drawerItemIcon: {
       marginRight: 10
   }
});

const mapDispatchToProps = dispatch => {
    return {
        allowAdvancedOptions: () => dispatch(allowAdvancedOptions()),
        onAddToResultList: (data)=> dispatch(addToResultList(data)),
        onEmptyResultList: () => dispatch(emptyResultList())
    };
};

const mapStateToProps = state => {
  return {state}
};

export default connect(mapStateToProps,mapDispatchToProps)(SideDrawer);