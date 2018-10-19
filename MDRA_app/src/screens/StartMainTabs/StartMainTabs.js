import {Navigation} from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS==='android'? "md-paper":"ios-paper", 30),
        Icon.getImageSource(Platform.OS==='android'? "md-podium": "ios-podium", 30),
        Icon.getImageSource(Platform.OS==='android'? "ios-menu" :"ios-menu", 30),
        Icon.getImageSource("md-more",30),
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
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
                                id: "sideDrawerToggle"
                            }
                        ],
                        rightButtons: [
                            {
                                icon: sources[3],
                                title: "Options",
                                id: "sideOptionsToggle"
                            }
                        ]
                    },
                    topBar: {
                        background: {
                            color: 'red'
                        }
                    }
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
                                id: "sideDrawerToggle"
                            }
                        ],
                        rightButtons: [
                            {
                                icon: sources[3],
                                title: "Options",
                                id: "sideOptionsToggle"
                            }
                        ]
                    }
                },
            ],
            tabsStyle:{
                tabBarSelectedButtonColor: "#222"
            },
            drawer: {
                left: {
                    screen: "MDRA_app.sideDrawerScreen"
                },
                right: {
                    screen: "MDRA_app.optionsDrawerScreen"
                },
                disableOpenGesture: true
            },

            appStyle:{
                tabBarSelectedButtonColor: "#222"
            }
        });
    });
};

export default startTabs;
