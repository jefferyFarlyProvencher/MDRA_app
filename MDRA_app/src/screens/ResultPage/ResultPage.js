import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity,
    BackHandler,
    Alert, Animated
} from 'react-native';
import {Button} from 'react-native-elements';
import 'react-native-svg';
import { IndicatorViewPager, PagerTitleIndicator, PagerTabIndicator } from 'rn-viewpager'
import Ionicon from 'react-native-vector-icons/Ionicons';
import Spinner from "react-native-loading-spinner-overlay";

//What is this?
import Draggable from 'react-native-draggable';

//Image imports
import areaImage from '../../assets/area_small.png';
import pieImage from '../../assets/pie_small.png';

//redux imports
import {connect} from 'react-redux';

//component imports
import GraphComponent from '../../components/ResultPage_GraphComponent/GraphComponent';
import PieChartComponent from '../../components/ResultPage_PieChartsComponent/PieChartsComponent';
import {addData, changePosition} from "../../store/actions";
import TitleComponent from "../../components/TitleComponent/TitleComponent";

class ResultPage extends PureComponent {
    state = {
        listLength: this.props.state.main.resultsList.length,
        currentPosition: this.props.selectedPosition,
        orientation: true, //portrait true, landscape false
        modalVisible: false,
        visible: Platform.OS==="ios",

    };

    handleBackButton = () => {

    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    };

    _renderTabIndicator = () => {
        return (
            <PagerTabIndicator
                tabs={
                    [
                        {
                            text: 'Area',
                            iconSource: areaImage,
                            selectedIconSource: areaImage
                        },
                        {
                            text: 'Pie',
                            iconSource: pieImage,
                            selectedIconSource: pieImage
                        }
                    ]
                }
                iconStyle={{height:30, width:30}}
                selectedIconStyle={{height:40, width:40}}
            />
        )
    };

    _handleOnStartUp = () => {
        setTimeout(
            ()=>{
                this.setState((oldState) =>{
                    return({
                        ...oldState,
                        //remove spinner
                        visible:false
                    })
                })
            },
            2000
        )
    };

    _handleOnPressBack = () => {
        if(this.state.currentPosition!==0) {
            console.log("changing pos back");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition - 1,
                })
            })

        }else{
            console.log("next should be disabled")
        }
    };

    _handleOnPressNext = () => {
        if(this.state.currentPosition<this.state.listLength-1) {
            console.log("changing pos");
            this.setState((oldState)=>{
                return({
                    ...oldState,
                    ///update position
                    currentPosition: oldState.currentPosition + 1,
                })
            })

        }else{
            console.log("next should be disabled")
        }
    };

    setFormValues = () => {
        //collect current result's formData
        let formData = this.props.state.main.resultsList[this.state.currentPosition].formData;
        // console.log("FORM BEFORE: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );
        // console.log("FORMDATA: " + JSON.stringify(formData));
        //set It to each page
        this.props.onAddData(formData[0],0);
        this.props.onAddData(formData[1],1);
        this.props.onAddData(formData[2],2);
        this.props.onAddData(formData[3],3);

        // console.log("FORM AFTER: "+
        //     JSON.stringify(this.props.state.main.Page0Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page1Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page2Data) + ";"+
        //     JSON.stringify(this.props.state.main.Page3Data) + ";"
        // );

        //Changes here to reset form
        //go to send, then, back to 1, will cause promise rejection
        this.props.onChangePosition(5);
        this.props.onChangePosition(0);

        //close modal
        this.props.navigator.pop({
            animated: false,
        });
        //change screen
        this.props.navigator.switchToTab({
            tabIndex: 0 // (optional) if missing, this screen's tab will become selected
        });
    };

    _handleOnPressReuse = () => {
        Alert.alert(
            'Confirmation',
            'Restore values and go to form?', [
                {
                    text: 'Cancel',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Okay',
                    onPress: () => this.setFormValues()
                }
            ],
            {
                cancelable: false
            }
        );
    };

//    Animated.sequence([

    render() {
        if(this.state.visible  && Platform.OS === "ios")this._handleOnStartUp();
        return (
            <View style={{backgroundColor:"#FFF", flex: 1}}>
                <IndicatorViewPager
                    style={{height:'90%', width:"100%"}}
                    indicator={this._renderTabIndicator()}
                    indicatorOnTop={true}
                >
                    <View>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{alignItems:'center',justifyContent:"center"}} pointerEvents="none">
                                <TitleComponent text={"Area Chart"}/>
                                <GraphComponent
                                    data={this.props.state.main.resultsList[this.state.currentPosition].data}
                                    formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                    style={{backgroundColor:"white"}}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={this.state.orientation?styles.pieChartStylesPortrait:styles.pieChartStylesLandscape}>
                                <TitleComponent text={"Pie Charts"}/>
                                <PieChartComponent
                                    data={this.props.state.main.resultsList[this.state.currentPosition].data}
                                    formData = {this.props.state.main.resultsList[this.state.currentPosition].formData}
                                    style={{backgroundColor:"white"}}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </IndicatorViewPager>
                <View style={[styles.buttonsContainer]}>
                    <Button
                        title="Go back"
                        onPress={this._handleOnPressBack}
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition === 0
                        }
                        icon={
                            {
                                name: "chevron-left",
                                color: "white",
                                type: "ionicons"
                            }
                        }
                    />
                    <Button
                        title="Reuse Data"
                        onPress={this._handleOnPressReuse}
                        buttonStyle={{backgroundColor:"#27408b"}}
                    />
                    <Button
                        title="Go next"
                        onPress={this._handleOnPressNext}
                        iconRight={
                            {
                                name:"chevron-right"
                            }
                        }
                        disabled={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                        raise={
                            this.state.listLength<1 ||
                            this.state.currentPosition > this.state.listLength-2
                        }
                    />
                </View>
                <View>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: "25%",
        height:"7%"
    },

    pieChartStylesPortrait: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    pieChartStylesLandscape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    buttonsContainer: {
        flexDirection:"row",
        justifyContent:'center',
        height:"10%",
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onAddData: (data, position) => dispatch(addData(data, position)),
        onChangePosition: (position) => dispatch(changePosition(position))
    }
};

const mapStateToProps = (state) => {
    return {
        state
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ResultPage);