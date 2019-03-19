import {Navigation} from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS==='android'? "md-paper":"ios-paper", 30),
        Icon.getImageSource(Platform.OS==='android'? "md-podium": "ios-podium", 30),
        Icon.getImageSource(Platform.OS==='android'? "ios-menu" :"ios-menu", 30),
        Icon.getImageSource(Platform.OS==='android'? "md-search" :"ios-search", 30),
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
                    },
                    navBarBackgroundColor: '#262626',
                    navBarTextColor: '#ffffff',
                    statusBarTextColorSchemeSingleScreen: 'light',
                    navBarButtonColor: Platform.OS === 'android'?'#3057e1': null,
                    topBar: {
                        buttonColor: "blue"
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
                    screen: "MDRA_app.searchOldResults",
                    label: "Search",
                    title: "Search",
                    icon: sources[3],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2], //Sources comes from the array up from here, [2] for the 3rd item sp ios-menu
                                title: "Menu",
                                id: "sideDrawerToggle"
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
                tabBarSelectedButtonColor: "#222"
            },
            drawer: {
                left: {
                    screen: "MDRA_app.sideDrawerScreen"
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
