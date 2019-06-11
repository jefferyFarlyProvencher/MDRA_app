
//Lets write down what should happen with this.
//lets start with what a patient should have...?
//Name (unique between
//Weight
//Gender
//Birthday?
//Dinner Time
//Bed Time
//Colored profile pics?

//Now, what should it look like?
// a List? (would it be really acceptable to have another list...?)
//really like my idea of random colors, it might make it acceptable
// note that patientProfiles should be imported automatically upon log in  (should results be as well?)

import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView, Dimensions, Picker, BackHandler} from 'react-native';
import {connect} from 'react-redux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import Input from "../../components/Input/Input";

import PatientsList from "../../components/PatientsList/PatientsList";

class ManagePatientsScreen extends Component{

    static navigatorButtons = {
        leftButtons: [
            {
                title: '< Go back', // for a textual button, provide the button title (label)
                id: 'backButton', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
                buttonColor: '#3057e1', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 18, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            },
        ],
        rightButtons: [
            {
                title: 'Add Patient', // for a textual button, provide the button title (label)
                id: 'addPatient', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
                buttonColor: '#EEE', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 16, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            },
        ]

    };

    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.props.navigator.setStyle({
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
            orientation: 'portrait',
        });
    };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'backButton') { // this is the same id field from the static navigatorButtons definition
                this.props.navigator.dismissModal()
            }
            else if(event.id === 'addPatient')
            {
                alert("Add patient? Maybe? No? Okay...?")
            }
        }
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.pickerStyle}>
                    <PatientsList
                        list={this.props.patientsList}
                        style={styles.pickerStyle}
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F00',
    },

    pickerStyle:{
        height: "100%",
        width: "100%"
    }
});

export default ManagePatientsScreen