import React, {PureComponent} from 'react'
import {View, Text, Animated, TouchableOpacity, Dimensions, Platform, StyleSheet} from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class ScrollDownIndicator extends PureComponent {
    state ={
        pointerOpacity: new Animated.Value(0),
        pointerPosition: new Animated.Value(1.5),
        backgroundAnim: new Animated.Value(0)
    };

    componentDidMount() {
        if(this.props.activated)
        {
            setTimeout(
                ()=> this.handleActivateArrowAnimation(),
                10000
            )
        }
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if(nextProps.activated)
    //     {
    //         setTimeout(
    //             ()=> this.handleActivateArrowAnimation(),
    //             5000
    //         )
    //     }
    // }

    componentWillUnmount() {
        Animated.timing(this.state.pointerOpacity).stop();
        Animated.timing(this.state.backgroundAnim).stop();
        Animated.timing(this.state.pointerPosition).stop();
    }

    handleActivateArrowAnimation = () => {

        this.setState((oldState)=>{
            return{
                ...oldState,
                animationInProgress: true
            }

        });

        Animated.sequence([
            Animated.timing(this.state.backgroundAnim,{
                toValue: 1,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(this.state.pointerOpacity,{
                        toValue: 1,
                    }),
                    Animated.timing(this.state.pointerPosition,{
                        toValue: -1,
                        duration: 1000
                    }),
                    Animated.timing(
                        this.state.pointerOpacity,{
                            toValue: 0,
                        }
                    ),
                    Animated.timing(this.state.pointerPosition,{
                        toValue: 1.5,
                        duration: 200
                    }),

                ]),
                {
                    iterations: 3
                }
            ),
            Animated.timing(this.state.pointerPosition,{
                toValue:1,
                duration: 500
            }),
            Animated.timing(this.state.backgroundAnim,{
                toValue: 0,
            }),
            Animated.timing(
                this.state.pointerOpacity,{
                    toValue: 0,
                }
            ),
        ]).start();
        setTimeout(()=> this.handleActivateArrowAnimation(),
                15000
        )

    };

    render() {
        return(
            <View style={[styles.rootStyle,  this.props.style,]}>
                {/*<Animated.View*/}
                    {/*style={[*/}
                        {/*{*/}
                            {/*opacity: this.state.backgroundAnim.interpolate({*/}
                                {/*inputRange: [0,1],*/}
                                {/*outputRange: [0,1]  // 0 : 150, 0.5 : 75, 1 : 0*/}
                            {/*}),*/}
                        {/*}*/}
                    {/*]}*/}
                {/*>*/}
                    {/*<View*/}
                        {/*style={[*/}
                            {/*{*/}
                                {/*position: "absolute",*/}
                                {/*backgroundColor: '#eee',*/}
                                {/*width:Dimensions.get("window").width,*/}
                                {/*top:0,*/}
                                {/*height:55,*/}
                            {/*},*/}
                        {/*]}*/}
                    {/*/>*/}
                {/*</Animated.View>*/}
                <Animated.View
                    style={{
                        backgroundColor: this.state.backgroundAnim.interpolate({
                            inputRange: [0,1],
                            outputRange: ['rgba(51, 51, 51, 0)', 'rgba(51, 51, 51, 0.2)']
                        }),
                        borderRadius: 10,
                        width:"100%",
                    }}
                >
                    <Animated.View
                        style={{
                            opacity: this.state.pointerOpacity.interpolate({
                                inputRange: [0,0.1,0.8, 1],
                                outputRange: [0,0.5,0.9,1]  // 0 : 150, 0.5 : 75, 1 : 0
                            }), // Binds directly
                            transform: [{
                                translateY: this.state.pointerPosition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 10]  // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            }],
                        }}
                    >
                        <View style={
                            {
                                width:"100%",
                                height:"100%",
                                alignItems:"center",
                                justifyContent: "center",
                            }
                        }>
                            <MaterialIcons
                                name={"touch-app"}
                                size={50}
                                color={"#555"}
                            />
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    rootStyle:{
        flex:1,
        alignItems: "center",
        alignSelf: "center",
        width: Dimensions.get("window").width*0.15,
        height: Dimensions.get("window").height*0.15,
        borderRadius: 10,
    }
});

export default ScrollDownIndicator