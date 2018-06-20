import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
          <Icon
              size={40}
              name= {Platform.OS==='android'? "md-log-out" :"ios-log-out-outline"}
              color="#52afff" style={styles.drawerItemIcon}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
