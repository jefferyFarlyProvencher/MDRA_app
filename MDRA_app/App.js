import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormTest from './src/screens/FormTest/FormTest'
import mainScreenTest from './src/screens/FormTest/mainScreenTest';
import MainScreen from './src/screens/MainScreen/MainScreen';

const store = configureStore();

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest, store, Provider);
Navigation.registerComponent('MDRA_app.mainScreen.js', ()=>MainScreen, store, Provider);

//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.mainScreenTest",
        title: "mainScreen"
    }
});
