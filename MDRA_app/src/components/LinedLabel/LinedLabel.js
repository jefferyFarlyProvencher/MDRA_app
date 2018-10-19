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
                  return "10%"
              }
              else if( line ===2)
              {
                  return "40%"
              }
              break;
          }
          case ("right"):{
              if(line === 1)
              {
                  return "40%"
              }
              else if( line === 2)
              {
                  return "10%"
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
                    <Text style={{        color: "#FFF"}}>
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
        backgroundColor: '#4169e1',
        height: 1,
        marginTop:'3%'
    },

    textStyle: {
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#4169e1",
        borderWidth: 1,
        borderColor: '#4169e1',

    }

});

export default LinedLabel;