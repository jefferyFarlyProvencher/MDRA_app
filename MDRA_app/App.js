import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormTest from './src/screens/FormTest/FormTest'
import FormScreen from './src/screens/FormScreen/FormScreen';
import mainScreenTest from './src/screens/FormTest/mainScreenTest';
import MainScreen from './src/screens/MainScreen/MainScreen';
import ResultScreen from './src/screens/ResultScreen/ResultScreen';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import FormScreenInitial from './src/screens/FormScreen1_initial/FormScreen_initial';
import FormScreenTimeZonage from './src/screens/FormScreen2_timeZonage/FormScreen_timeZonage';
import FormScreenWeights from './src/screens/FormScreen3_weights/FormScreen_weights';
import FormScreenAdvanced from './src/screens/FormScreen4_advanced/FormScreen_advanced';
import ResultTest from './src/screens/ResultTest/ResultTest';

const store = configureStore();

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest);
Navigation.registerComponent('MDRA_app.mainScreen', ()=>MainScreen);
Navigation.registerComponent('MDRA_app.resultScreen',()=>ResultScreen);
Navigation.registerComponent('MDRA_app.sideDrawerScreen', () => SideDrawer, store, Provider);
Navigation.registerComponent('MDRA_app.formScreen', ()=>FormScreen, store, Provider);
Navigation.registerComponent('MDRA_app.formScreenInitial', () => FormScreenInitial, store, Provider);
Navigation.registerComponent('MDRA_app.formScreenTimeZonage', () => FormScreenTimeZonage, store, Provider);
Navigation.registerComponent('MDRA_app.formScreenWeights', () => FormScreenWeights, store, Provider);
Navigation.registerComponent('MDRA_app.formScreenAdvanced', () => FormScreenAdvanced, store, Provider);
Navigation.registerComponent('MDRA_app.resultTest', () => ResultTest, store, Provider);


//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.mainScreen",
        title: "mainScreen"
    }
});
