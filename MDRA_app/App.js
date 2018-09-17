import React from 'react';
import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormScreen from './src/screens/FormScreen/FormScreen';
import FormScreenV2 from './src/screens/FormScreenV2/FormScreenV2';
import MainScreen from './src/screens/MainScreen/MainScreen';
import ResultScreen from './src/screens/ResultScreen/ResultScreen';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import FormScreenInitial from './src/screens/FormScreen1_initial/FormScreen_initial';
import FormScreenInitialV2 from './src/screens/FormScreen1_initial/FormScreen_initialV2';
import FormScreenTimeZonage from './src/screens/FormScreen2_timeZonage/FormScreen_timeZonage';
import FormScreenWeights from './src/screens/FormScreen3_weights/FormScreen_weights';
import FormScreenAdvanced from './src/screens/FormScreen4_advanced/FormScreen_advanced';
import SendFormScreen from './src/screens/SendFormScreen/SendFormScreen';
import FormTest from './src/screens/FormTest/FormTest'
import mainScreenTest from './src/screens/FormTest/mainScreenTest';
import ResultTest from './src/screens/ResultTest/ResultTest';
import ResultPage from './src/screens/ResultPage/ResultPage';

import SendForm from './src/components/SendForm/SendForm';

const configureStoreResult = configureStore();
const store = configureStoreResult.store;
const persistor = configureStoreResult.persistor;

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest);
Navigation.registerComponent('MDRA_app.mainScreen', ()=>MainScreen);
Navigation.registerComponent('MDRA_app.resultScreen',()=>ResultScreen,store, Provider, persistor);
Navigation.registerComponent('MDRA_app.sideDrawerScreen', () => SideDrawer, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreen', ()=> FormScreen, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenV2', ()=> FormScreenV2, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenInitial', () => FormScreenInitial, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenInitialV2', () => FormScreenInitialV2, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenTimeZonage', () => FormScreenTimeZonage, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenWeights', () => FormScreenWeights, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenAdvanced', () => FormScreenAdvanced, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.resultTest', () => ResultTest, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.sendForm',() => SendForm, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.resultPage',() => ResultPage, store, Provider, persistor);

//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.mainScreen",
        title: "mainScreen",
    }
});
