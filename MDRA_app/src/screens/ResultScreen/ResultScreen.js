import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Image, Animated} from 'react-native';
import {connect} from "react-redux";


import ResultsList from "../../components/ResultsList/ResultsList";


class ResultScreen extends Component{

    state = {
        placesAnim: new Animated.Value(0)
    };

    itemSelectedHandler = key => {
        let selResult = null;
        let selPosition = 0;
        for(let i = 0; i < this.props.state.main.resultsList.length; i++){
            if(this.props.state.main.resultsList[i].key === key)
            {
                selResult=this.props.state.main.resultsList[i];
                selPosition = i;
            }
        }
        console.log(key);
        this.props.navigator.push({
            screen: "MDRA_app.resultTest",
            title: selResult.date,
            passProps: {
                selectedPosition: selPosition
            }
        });
    };

    render(){
        let content = (
            <View>
                <ResultsList list ={this.props.state.main.resultsList} onItemSelected={this.itemSelectedHandler}/>
            </View>
        );
        console.log(this.props.state.main.resultsList);
        return(
            <View>
                {this.props.state.main.resultsList.length > 0
                    ? content
                    : <Text>This doesn't have any results yet</Text>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state
    };
};


export default connect(mapStateToProps,null)(ResultScreen)