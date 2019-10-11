import {Navigation} from 'react-native-navigation';
import { Platform } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';




const startTabs = () => {
    Promise.all([
        IonIcons.getImageSource(Platform.OS==='android'? "md-paper":"ios-paper", 30),
        IonIcons.getImageSource(Platform.OS==='android'? "md-podium": "ios-podium", 30),
        IonIcons.getImageSource(Platform.OS==='android'? "ios-menu" :"ios-menu", 30),
        IonIcons.getImageSource(Platform.OS==='android'? "md-people" :"ios-people",30),
        IonIcons.getImageSource("md-more",3),
        IonIcons.getImageSource(Platform.OS==='android'? "ios-information-circle-outline": "ios-information-circle-outline",30)
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "MDRA_app.managePatientsScreen",
                    label: "Patients",
                    title: "Patients",
                    icon: sources[3],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2], //Sources comes from the array up from here, [2] for the 3rd item sp ios-menu
                                title: "Menu",
                                id: "sideDrawerToggle",
                                buttonColor:"#3057e1"
                            }
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
                        // rightButtons: [
                        //     {
                        //         icon:sources[5],
                        //         title: "Information",
                        //         id: "informationButton",
                        //         buttonColor:"#FFF"
                        //     }
                        // ]
                    },
                    navBarBackgroundColor: '#262626',
                    navBarTextColor: '#ffffff',
                    statusBarTextColorSchemeSingleScreen: 'light',
                    navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
                    topBar: {
                        buttonColor: 'blue'
                    }

                },
                {
                    screen: "MDRA_app.formScreenV2",
                    label: "Form",
                    title: "Form",
                    icon: sources[0],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2], //Sources comes from the array up from here, [2] for the 3rd item sp ios-menu
                                title: "Menu",
                                id: "sideDrawerToggle",
                                buttonColor:"#3057e1"
                            }
                        ],
                        rightButtons: [
                            {
                                icon:sources[5],
                                title: "Information",
                                id: "informationButton",
                                buttonColor:"#FFF"
                            }
                        ]
                    },
                    navBarBackgroundColor: '#262626',
                    navBarTextColor: '#ffffff',
                    statusBarTextColorSchemeSingleScreen: 'light',
                    //navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
                    // topBar: {
                    //     buttonColor: "blue"
                    // },
                },
                {
                    screen: "MDRA_app.resultScreen",
                    label: "Results",
                    title: "Results",
                    icon: sources[1],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2], //Sources comes from the array up from here, [2] for the 3rd item sp ios-menu
                                title: "Menu",
                                id: "sideDrawerToggle",
                                buttonColor:"#3057e1"
                            }
                        ],
                    },
                    navBarBackgroundColor: '#262626',
                    navBarTextColor: '#ffffff',
                    statusBarTextColorSchemeSingleScreen: 'light',
                    navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
                    topBar: {
                        buttonColor: 'blue'
                    }

                },
            ],
            tabsStyle:{
                tabBarSelectedButtonColor: "#222",
                initialTabIndex: 1,
            },
            appStyle:{
                tabBarSelectedButtonColor: "#222",
                initialTabIndex: 1,
            },
            drawer: {
                left: {
                    screen: "MDRA_app.sideDrawerScreen"
                },
                disableOpenGesture: true
            },


        });
    });
};

export default startTabs;
