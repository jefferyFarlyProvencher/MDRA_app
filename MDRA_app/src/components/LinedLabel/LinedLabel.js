import React, {PureComponent} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';

class LinedLabel extends PureComponent{

    //props that it takes:
    // textPosition, label
    // and style props for the back of the style of the line label container

    state={
      textPosition: this.props.textPosition? this.props.textPosition: "center"
    };

    giveLineWidth = (line) => {
      switch (this.state.textPosition){
          case ("center"):
                return "25%";
                break;
          case ("left"):{
              if(line === 1)
              {
                  return "15%"
              }
              else if( line ===2)
              {
                  return "35%"
              }
              break;
          }
          case ("right"):{
              if(line === 1)
              {
                  return "35%"
              }
              else if( line === 2)
              {
                  return "15%"
              }
              break;
          }

      }
    };

    render() {
        return(
            <View style={[styles.root,this.props.style]}>
                <View
                    style={[styles.lineStyle, { width: (this.giveLineWidth(1)),}]}
                />
                <View style={styles.textStyle}>
                    <Text>
                        {this.props.label}
                    </Text>
                </View>
                <View
                    style={[styles.lineStyle,{ width: (this.giveLineWidth(2)),}]}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        flex:1,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: "5%",
    },
    lineStyle: {
        backgroundColor: 'grey',
        height: 1,
        marginTop:'3%'
    },

    textStyle: {
        width: "40%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"transparent",
        borderWidth: 1,
        borderColor: '#919191'

    }

});

export default LinedLabel;