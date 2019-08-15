import React, {PureComponent} from 'react';
import {View, Text, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet, Image, Modal} from 'react-native';
import Swiper from 'react-native-swiper';
import * as colors from "../../assets/colors";

import TitleComponent from "../../components/TitleComponent/TitleComponent";


class TutorialPage extends PureComponent {

    state= {
        tutorialData: this.props.tutorialData
    };

    //
    // renderPagination = (index, total, context) => {
    //     return (
    //         <View style={styles.paginationStyle}>
    //             <Text style={{ color: 'grey' }}>
    //                 <Text style={styles.paginationText}>{index + 1}</Text>/{total}
    //             </Text>
    //         </View>
    //     )
    // }

    render() {


        const swiperItems = this.state.tutorialData.map(item => {
            return(
                <View  key={item.position}>
                    <Image
                        source={item.path}
                        style={styles.swiperImage}
                    />
                </View>
            )
        });

        let window = Dimensions.get('window');

        swiperItems.push(
            (<View style={{alignItems:"center", justifyContent:"center", height:window.height*0.7}} key={swiperItems.length}>
                <TouchableOpacity onPress={()=>{this.refs.swiper.scrollBy(-1*(this.state.tutorialData.length))}}>
                    <View style={styles.tutorialEndButtons}>
                        <Text style={styles.tutorialEndButtonsText}>{"Reset\nTutorial"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {this.props.handleShowTutorialToggler(false)}}>
                    <View style={styles.tutorialEndButtons}>
                        <Text style={styles.tutorialEndButtonsText}>{"Close\nTutorial"}</Text>
                    </View>
                </TouchableOpacity>
            </View>)
        );


        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                    this.props.handleShowTutorialToggler(!this.props.showTutorial);
                }}
            >
                <View style={
                    {
                        flex:1,
                        alignItems:"center",
                        justifyContent:"center",
                    }
                }>
                    <TouchableWithoutFeedback
                        onPress={()=>{
                            this.props.handleShowTutorialToggler(false)
                        }}
                    >
                        <View
                            style={
                                {
                                    backgroundColor:"#000",
                                    opacity:0.5,
                                    flex:1,
                                    position:"absolute",
                                    left:0,
                                    top:0,
                                    height:window.height,
                                    width:window.width
                                }
                            }
                        />
                    </TouchableWithoutFeedback>
                    <View
                        style={{
                            height:window.height*0.85,
                            width:window.width*0.85,
                            alignItems:"center",
                        }}
                    >
                        <View style={[styles.centerElements,{width:window.width*0.85,}]}>
                            <TitleComponent
                                text={"Tutorial"}
                                containerStyle={{backgroundColor:"#333"}}
                                textStyle={{color:"#FFF"}}
                            />
                        </View>
                        <Swiper
                            ref={'swiper'}
                            showsButtons={true}
                            loop={false}
                            style={{backgroundColor:"#333"}}
                            height={window.height*0.9}
                            width={window.width*0.85}
                            key={this.state.tutorialData.length}
                            //renderPagination={this.renderPagination}
                        >
                            {swiperItems}
                        </Swiper>
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    swiperImage: {
        height:Dimensions.get('window').height*0.7,
        width:Dimensions.get('window').width*0.70,
        resizeMode:"contain",
        alignSelf: "center"
    },
    paginationStyle: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    tutorialEndButtons:{
        backgroundColor:"#333",
        borderColor: "#FFF",
        borderWidth: 1,
        width:300,
        borderRadius:80,
        padding: 15,
        marginVertical: 50,
        alignItems: "center",
        justifyContent:"center",
    },
    tutorialEndButtonsText:{
        fontSize:40,
        color: "#FFF",
        alignSelf: "center",
        textAlign: "center"
    }
});

export default TutorialPage;