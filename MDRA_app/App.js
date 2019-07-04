import React from 'react';
import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormScreen from './src/screens/FormScreen/FormScreen';
import FormScreenV2 from './src/screens/FormScreen/FormScreenV2';
import StartScreen from './src/screens/StartScreen/StartScreen';
import ResultScreen from './src/screens/ResultScreen/ResultScreen';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import OptionsDrawer  from './src/screens/OptionsDrawer/OptionsDrawer';
import FormScreenInitialV2 from './src/screens/FormScreen0_initial/FormScreen_initialV2';
import FormScreenTimeZonageV2 from './src/screens/FormScreen1_timeZonage/FormScreen_timeZonageV2';
import FormScreenWeights from './src/screens/FormScreen2_weights/FormScreen_weights';
import FormScreenAdvanced from './src/screens/FormScreen3_advanced/FormScreen_advanced';
import SendFormScreen from './src/screens/SendFormScreen/SendFormScreen';
import FormTest from './src/screens/FormTest/FormTest'
import mainScreenTest from './src/screens/FormTest/mainScreenTest';
import ResultTest from './src/screens/ResultTest/ResultTest';
import ResultPage from './src/screens/ResultPage/ResultPage';
import PickerTest from './src/screens/PickerTest/PickerTest';
import TestCapturePDF from './src/screens/TestCapturePDF/TestCapturePDF';
import RetrieveOldResults from './src/screens/RetrieveResultsScreens/RetrieveResultsScreen';
import MainScreenTest from './src/screens/MainScreenTest/MainScreenTest';
import ManagePatientScreen from './src/screens/ManagePatientsScreen/ManagePatientsScreen';
import PatientPage from './src/screens/PatientPage/PatientPage'

import SendForm from './src/components/SendForm/SendForm';

const configureStoreResult = configureStore();
const store = configureStoreResult.store;
const persistor = configureStoreResult.persistor;

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest);
Navigation.registerComponent('MDRA_app.startScreen', ()=>StartScreen, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.resultScreen',()=>ResultScreen,store, Provider, persistor);
Navigation.registerComponent('MDRA_app.sideDrawerScreen', () => SideDrawer, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.optionsDrawerScreen', () => OptionsDrawer, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreen', ()=> FormScreen, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenV2', ()=> FormScreenV2, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenInitialV2', () => FormScreenInitialV2, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenTimeZonage', () => FormScreenTimeZonageV2, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenWeights', () => FormScreenWeights, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.formScreenAdvanced', () => FormScreenAdvanced, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.resultTest', () => ResultTest, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.sendFormScreen',() => SendFormScreen, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.resultPage',() => ResultPage, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.pickerTest',() => PickerTest);
Navigation.registerComponent('MDRA_app.testCapturePDF',() => TestCapturePDF, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.retrieveOldResults',() => RetrieveOldResults, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.mainScreenTest',() => MainScreenTest, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.managePatientsScreen',() => ManagePatientScreen, store, Provider, persistor);
Navigation.registerComponent('MDRA_app.patientPage',() => PatientPage);


//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.startScreen",
        title: "startScreen",
    },
    navBarHidden: true,
});
