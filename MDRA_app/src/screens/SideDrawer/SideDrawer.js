import React, {Component} from 'react';
import { View, Text,Platform, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {allowAdvancedOptions} from "../../store/actions";

class SideDrawer extends Component{
    logOutHandler = () => {
        Navigation.startSingleScreenApp({
            screen: {
                screen: "MDRA_app.mainScreen",
                title: "mainScreen"
            }
        });
    };

    render() {
        return(
            <View style = {[{width: Dimensions.get("window").width *0.7}, styles.container]}>
                <Text style={{marginVertical:10}}>SideDrawer</Text>
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
                        <Text>Access advanced tab</Text>
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
       backgroundColor: "#eeeeee"
   },

   drawerItemIcon: {
       marginRight: 10
   }
});

const mapDispatchToProps = dispatch => {
    return {
        allowAdvancedOptions: () => dispatch(allowAdvancedOptions())
    };
};

const mapStateToProps = state => {
  return {state}
};

export default connect(mapStateToProps,mapDispatchToProps)(SideDrawer);