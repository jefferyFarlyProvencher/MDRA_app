import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormTest from './src/screens/FormTest/FormTest'
import mainScreenTest from './src/screens/FormTest/mainScreenTest';
import MainScreen from './src/screens/MainScreen/MainScreen';
import ResultScreen from './src/screens/ResultScreen/ResultScreen';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';

const store = configureStore();

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest);
Navigation.registerComponent('MDRA_app.mainScreen', ()=>MainScreen);
Navigation.registerComponent('MDRA_app.resultScreen',()=>ResultScreen);
Navigation.registerComponent('MDRA_app.sideDrawerScreen', () => SideDrawer);

//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.mainScreen",
        title: "mainScreen"
    }
});
