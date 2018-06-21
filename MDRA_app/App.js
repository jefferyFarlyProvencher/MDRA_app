import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';

//redux
import configureStore from './src/store/configureStore';


//screens
import FormTest from './src/screens/FormTest/FormTest'
import mainScreenTest from './src/screens/FormTest/mainScreenTest';

const bye = () =>{
    console.log('hey!');
};
bye();

const store = configureStore();

// register all screens of the app (including internal ones)
Navigation.registerComponent('MDRA_app.formTest', () => FormTest);
Navigation.registerComponent('MDRA_app.mainScreenTest', () => mainScreenTest);

//start App
Navigation.startSingleScreenApp({
    screen: {
        screen: "MDRA_app.mainScreenTest",
        title: "mainScreen"
    }
});
