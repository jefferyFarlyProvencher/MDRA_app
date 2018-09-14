import React from 'react';
import {AsyncStorage, AppState} from "react-native";

import { createStore, combineReducers, compose} from 'redux';

import { Provider } from 'react-redux'

import reducer from './reducers/root';

const rootReducer =combineReducers({
    main: reducer
});

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

//let store = createStore(rootReducer, composeEnhancers());

const configureStore = () => {
    /*//Root code was taken from:
    // https://medium.com/@sumitkushwaha/syncing-redux-store-with-asyncstorage-in-react-native-2b8b890b9ca1
    //not used right now, was supposed to handle permenant local storing
    class Root extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                isStoreLoading: false,
                store: store
            }
        };

        componentWillMount= () => {
            let self = this;
            console.log("HERE");
            AppState.addEventListener('change', this);
            console.log("HERE2");
            this.setState({isStoreLoading: true});
            console.log("HERE3");
            AsyncStorage.getItem('completeStore').then((value) => {
                if (value && value.length)
                {
                    let initialStore = JSON.parse(value);
                    console.log("THE INITIAL STORE IS THIS: "+JSON.stringify(initialStore));
                    store=createStore(rootReducer, initialStore, composeEnhancers())
                    self.setState({store: createStore(rootReducer, initialStore, composeEnhancers())})
                }else{
                    self.setState({store:store});
                }
                self.setState({isStoreLoading:false});
            }).catch((error) => {
                self.setState({store: store, isStoreLoading: false});
                console.log(error)
            });
        };
    }*/
    return createStore(rootReducer, composeEnhancers());
};

export default configureStore;