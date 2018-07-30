import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Image, Animated} from 'react-native';
import {connect} from "react-redux";


import ResultsList from "../../components/ResultsList/ResultsList";


class ResultScreen extends Component{
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    state = {
        placesAnim: new Animated.Value(0)
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarTransparent: true,
            navBarNoBorder: true,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: true
        });
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "right"
                });
            }
        }
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
//        console.log(this.props.state.main.resultsList);
        return(
            <View>
                {this.props.state.main.resultsList.length > 0
                    ? content
                    : <Text style={{justifyContent:'center', alignItems:'center'}}>This doesn't have any results yet</Text>
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