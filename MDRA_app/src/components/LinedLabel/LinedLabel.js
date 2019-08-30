import React, {PureComponent} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';

import * as colors from "../../assets/colors"

/**
 *
 * LinedLabel REQUIRES these props:
 *
 *  - label
 *
 *  Optional:
 *
 *   - text position: (between right, left, center)
 *   - style (for the size of the square
 *
 */


class LinedLabel extends PureComponent{

    //props that it takes:
    // textPosition, label
    // and style props for the back of the style of the line label container

    state={
      textPosition: this.props.textPosition? this.props.textPosition: "center",
        isRotated: false
    };

    onLayout(){
        this.setState(oldState=>{
            return{
                ...oldState,
                isRotated: !oldState.isRotated
            }
        })
    }

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
            <View style={[styles.root,this.props.containerStyle]}>
                <View
                    style={[
                        styles.lineStyle,
                        this.props.lineStyle,
                        {
                            width: (this.giveLineWidth(1)),
                        },
                        this.state.isRotated
                            ? styles.lineStyleTurned
                            : styles.lineStyleBase
                    ]}
                />
                <View style={[styles.textContainerStyle, this.props.textContainerStyle]}>
                    <Text style={[{color: "#FFF"},this.props.textStyle]}>
                        {this.props.label}
                    </Text>
                </View>
                <View
                    style={[
                        styles.lineStyle,
                        this.props.lineStyle,
                        {
                            width: (this.giveLineWidth(2)),
                        },
                        this.state.isRotated
                            ? styles.lineStyleTurned
                            : styles.lineStyleBase
                    ]}
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
        paddingTop: Dimensions.get("window").height*0.05,
    },
    lineStyleBase: {
        backgroundColor: colors.royalBlue1,
        height: 1,
        marginTop: Dimensions.get("window").height*0.02
    },

    lineStyleTurned:{
        backgroundColor: colors.royalBlue1,
        height: 1,
        marginTop: Dimensions.get("window").width*0.02
    },

    textContainerStyle: {
        width: "50%",
        height: Dimensions.get("window").height*0.04,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:colors.royalBlue1,
        borderWidth: 1,
        borderColor: colors.royalBlue1,

    }

});

export default LinedLabel;