import React, {PureComponent} from 'react';
import {StyleSheet, View, Platform, TouchableWithoutFeedback, TouchableHighlight, Animated, ScrollView} from 'react-native';

import {
    FormInput,
    FormValidationMessage,
    FormLabel
} from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/Ionicons'

//components import
import LinedLabel from '../LinedLabel/LinedLabel'

/**
 *  ViewToggle's code is partly credited to Crystel Villa from moduscreate.com
 *
 *  Thank you for the excellent tutorial
 *
 */

class ViewToggle extends PureComponent{

    state = {

        toggleValue: false, //false === close; true === open
        animation: new Animated.Value(39),
        specialAnimationInProgress: false
    };

    constructor(props){
        super(props);
    }

    _setMaxHeight = (event) =>{
        // console.log("event max is: "+JSON.stringify(event.nativeEvent));
        // console.log("event max layout is: "+JSON.stringify(event.nativeEvent.layout));
        let height = event.nativeEvent.layout.height;
        // console.log("event max height is: "+height);
        let oldheight = this.state.maxHeight;

        this.setState(oldState => {
            return{
                ...oldState,
                maxHeight : height
            }

        });

        //need to adjust if already opened
        if(this.state.toggleValue && height-oldheight !== 0 && !this.state.specialAnimationInProgress)
        {
            console.log("Special Animation: changing ViewToggle height because content is bigger/smaller");
            this.handleSpecialAnimation(height+this.state.minHeight)
        }
    };

    _setMinHeight= (event) => {
        // console.log("event min is: "+JSON.stringify(event.nativeEvent));
        // console.log("event min layout is: "+JSON.stringify(event.nativeEvent.layout));
        let height = event.nativeEvent.layout.height;
        // console.log("event min height is: "+height);
        this.setState(oldState => {
            return {
                ...oldState,
                minHeight: height
            }
        });
    };

    handleSpecialAnimation = (value) => {
        this.setState(oldState => {
            return {
                ...oldState,
                specialAnimationInProgress: true
            }
        });
        Animated.spring(this.state.animation,{
            toValue: value,
            duration: 200
        }).start()

        setTimeout(() => this.setState(oldState => {
                        return {
                            ...oldState,
                            specialAnimationInProgress: false
                        }
                    }),200
        )

    };

    toggleToggler = () => {

        // if(this.state.toggleValue)
        // {
        //     this.handleCloseAnimation()
        // }else{
        //     this.handleSpecialAnimation()
        // }

        console.log("toggeling Toggler");

        //Step 1
        let initialValue    = this.state.toggleValue? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
        let  finalValue      = this.state.toggleValue? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        console.log("initialValue: "+ initialValue);
        console.log("finalValue: "+ finalValue);

    //Step 2
        this.setState(oldState => {
          return{
              ...oldState,
              toggleValue: !oldState.toggleValue
          }
        });

        this.state.animation.setValue(initialValue);  //Step 3

        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue

            }
        ).start();  //Step 5
    };

    render() {
        const {label, error, backgroundColor, name, center,onBlur, maxLength, inputStyle,...rest } = this.props;
        let labelPosition = this.props.labelPosition;

        let arrowPositionLeft = this.props.arrowPositionLeft;

        if(typeof arrowPositionLeft == 'undefined' || arrowPositionLeft == null)
        {
            arrowPositionLeft = false;
        }

        let icon = this.state.toggleValue
            ?<Ionicons
                size={35}
                name= {"md-arrow-dropup"}
                color="#000"
                style={styles.drawerItemIcon}
            />
            :<Ionicons
                size={35}
                name= {"md-arrow-dropdown"}
                color="#000"
                style={styles.drawerItemIcon}
            />;



        return(
            <Animated.View
                style=
                    {[
                        styles.container,
                        {
                            height: this.state.animation
                        },
                        this.props.togglerStyle
                    ]}
            >
                <ScrollView>
                    <TouchableHighlight
                        onPress={this.toggleToggler}
                        underlayColor={"#f1f1f1"}
                    >
                        <View>
                            <View style={[styles.togglerStyle]} onLayout={this._setMinHeight}>
                                {this.props.label
                                    ?<View style={{width:"92%", alignItems: "center"}}>
                                        <LinedLabel
                                            label={this.props.label}
                                            containerStyle={{paddingTop:5}}
                                            textContainerStyle={{backgroundColor:"#000032", borderColor: "#000032"}}
                                            lineStyle={{backgroundColor:"#000032"}}
                                            textPosition="left"
                                        />
                                    </View>
                                    :<View style={styles.lineStyle}/>
                                }
                                {icon}
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.body} onLayout={this._setMaxHeight}>
                        {this.props.children}
                        </View>
                </ScrollView>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor : '#f4f7f9',
    },
    togglerStyle: {
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: "row",

    },
    lineStyle:{
        width: '92%',
        height: 0.5,
        borderWidth: 0.5,
        alignSelf: "center"
    },
    body: {
        padding     : 10,
        paddingTop  : 0
    }
});

export default ViewToggle;