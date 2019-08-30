import React from 'react';
import { createStore, combineReducers, compose} from 'redux';
import { createWhitelistFilter } from 'redux-persist-transform-filter';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers/root';

const persistConfig = {
    key: 'root',
    storage: storage,
    transforms: [
        createWhitelistFilter(
            'main',
            ["stayConnected",'resultsList', 'patientsList', "indicatorVisibility", "linkedAccount" ]
        )
    ]
};

const rootReducer =combineReducers({
    main: reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

//let store = createStore(rootReducer, composeEnhancers());

const configureStore = () => {
    let store = createStore(persistedReducer);
    let persistor = persistStore(store);
    return {store, persistor};
};

export default configureStore;