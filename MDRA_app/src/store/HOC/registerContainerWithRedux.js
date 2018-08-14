import React, { Component } from 'react';
import Navigation from 'react-native-navigation';
import { Provider } from 'react-redux';

export function registerContainerWithRedux(
    containerName,
    comp,
    store,
    Provider,
) {
    const generatorWrapper = function() {
        const InternalComponent = comp;

        return class Scene extends Component {
            constructor(props) {
                super(props);
            }

            static options = {
                ...comp.options,
            };

            render() {
                return (
                    <Provider store={store}>
                        <InternalComponent
                            ref="child"
                            {...this.props}
                        />
                    </Provider>
                );
            }

            resendEvent = (eventName, params) =>
            {
                instance = this.refs.child.getWrappedInstance();
                if (instance && instance[eventName]) {
                    instance[eventName](params);
                }
            };

            componentDidAppear() {
                this.resendEvent('componentDidAppear');
            }

            componentDidDisappear() {
                this.resendEvent('componentDidDisappear');
            }

            componentWillUnmount() {
                this.resendEvent('componentWillUnmount');
            }

            componentWillReceiveProps(nextProps) {
                this.resendEvent('componentWillReceiveProps', nextProps);
            }

            onNavigationButtonPressed(buttonId) {
                this.resendEvent('onNavigationButtonPressed', buttonId);
            }
        };
    };

    Navigation.registerComponent(containerName, generatorWrapper);
}

export default registerContainerWithRedux;