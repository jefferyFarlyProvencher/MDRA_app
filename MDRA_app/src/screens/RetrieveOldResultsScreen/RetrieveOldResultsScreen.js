import React, {Component} from "react";
import {Image, Platform, StyleSheet, View, Text, TouchableOpacity, DatePickerIOS} from "react-native";

import {
    Button,
    SearchBar
} from 'react-native-elements';

import * as colors from "../../assets/colors";

import SendRetrieval from '../../components/SendRetrieval/SendRetrieval';
import {addToResultList} from "../../store/actions";
import {connect} from "react-redux";

class RetrieveOldResultsScreen extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        searchItems: false,
        displayedMessage: "Enter proper information to make the appropriate search",
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarNoBorder: false,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: false,
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            navBarButtonColor: Platform.OS === 'android'?'#3057e1': null
        });
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };

    setDate(newDate) {
        this.setState({chosenDate: newDate});
    }

    changeDisplayedMessage = (message) => {
        this.setState(oldState => {
            return({
                ...oldState,
                displayedMessage: message
            })
        });
    };

    verifyIfNotDuplicate = (resultToCompare) =>{

        let currentResultList = this.props.state.main.resultsList;
        for(let i = 0; i < currentResultList.length; i++)
        {
            console.log("this is the current result form from resultList: " + JSON.stringify(currentResultList[i].formData));
            console.log("and this is the result form compared to: "+ JSON.stringify(resultToCompare.formData));
            if(JSON.stringify(currentResultList[i].formData) === JSON.stringify(resultToCompare.formData))
            {
                return false;
            }
        }
        return true;
    };

    handleRetrieveResults = async() => {
        let retrievalResult = await SendRetrieval();
        //console.log('handleRetrieveResult: '+ JSON.stringify(retrievalResult));
        let possibleDuplicatesList = [];
        for(let i = 0; i < retrievalResult.length; i++){
            let currentResult = retrievalResult[i];
            if(this.verifyIfNotDuplicate(currentResult))
            {
                this.changeDisplayedMessage("Currently adding the result: "+ currentResult.name + " , to the list.");
                this.props.onAddToResultList(currentResult.data, currentResult.name, currentResult.formData, currentResult.date)
            }
            else{
                possibleDuplicatesList.push(currentResult.name)
            }

        }

        if(possibleDuplicatesList.length > 0)
        {
            alert((possibleDuplicatesList.length===1?"This result was a possible duplicate and thus has ":"These results were possible duplicates and thus have ")+"not been added to the list: "+ possibleDuplicatesList)
        }

    };

    render() {
        return (
            <View style={styles.containerStyle}>
                <Text>
                    {this.state.displayedMessage}
                </Text>
                <SearchBar
                    placeholder="Type Here..."
                    lightTheme={true}
                    containerStyle={{width:"95%"}}
                    round={true}
                    platform="android"
                />
                <TouchableOpacity title={"Send"} onPress={()=>{console.log("HEY HEY HEY STARTING SENDSEARCH!"); this.handleRetrieveResults()}}>
                    <View style={[styles.pillButton2]}>
                        <Text style={{textAlign: 'center', color:'#FFF', fontSize: 18}}>
                            Start Retrieval Process
                        </Text>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    pillButton2: {
        borderRadius:100,
        backgroundColor: "#3057e1",
        width:"100%",
        flexDirection:"row",
        padding:12,
    },

});

const mapStateToProps = state => {
    return{
        state
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onAddToResultList: (data,name, formData, date)=>dispatch(addToResultList(data, name, formData, date)),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(RetrieveOldResultsScreen);