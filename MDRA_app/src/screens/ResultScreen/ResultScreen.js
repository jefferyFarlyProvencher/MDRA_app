//system
import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, Animated, Modal, StyleSheet, StatusBar, Alert} from 'react-native';
import {Formik} from "formik";
import {Button} from 'react-native-elements';
import {connect} from "react-redux";
import * as Yup from "yup";
import Spinner from "react-native-loading-spinner-overlay";
//actions
import {removeData, renameData} from '../../store/actions/index';

//components
import ResultsList from "../../components/ResultsList/ResultsList";
import Input from "../../components/Input/Input";


class ResultScreen extends Component{
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    state = {
        //placesAnim: new Animated.Value(0)
        modalVisible: false,
        renameTarget: null,
        currentNewName: null,
        //selected is linked to extraData in the list and not the actual selection
        selected: false,
        visible: false
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarTransparent: true,
            navBarNoBorder: true,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: true,
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'dark',
        });

        this.props.navigator.setStyle({


        });
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "right"
                });
            }
        }
    };

    itemSelectedHandler = key => {
        let selResult = null;
        let selPosition = 0;
        for(let i = 0; i < this.props.state.main.resultsList.length; i++){
            if(this.props.state.main.resultsList[i].key === key)
            {
                selResult=this.props.state.main.resultsList[i];
                selPosition = i;
            }
        }
        //console.log(key);
        this.props.navigator.push({
            screen: "MDRA_app.resultPage",
            title: selResult.title,
            passProps: {
                selectedPosition: selPosition
            }
        });
    };

    setModalVisible = (visible) => {
        this.setState((oldState) => {
                return({
                    ...oldState,
                    modalVisible: visible,
                })
            }
        );
    };

    handleOnRenamePressed = (key) =>
    {
        this.setState((oldState) => {
                return({
                    ...oldState,
                    modalVisible: true,
                    renameTarget: key,
                    selected: true,
                })
            }
        );
    };

    handleRemoveResult = (key) => {
        Alert.alert(
            'Confirmation',
            'Do you really want to remove this Result?', [
                {
                    text: 'Nevermind, no',
                    onPress: (() => console.log('Cancel Pressed')),
                    style: 'cancel'
                }, {
                    text: 'Yes, erase it',
                    onPress: () => this.props.onRemoveData(key)
                }
            ],
            {
                cancelable: false
            }
        );

    };

    _handleSubmit =(async (values, bag) => {
        try {
            this.props.onRenameData(this.state.renameTarget,values.newName);
            this.setState((oldState)=>{
                return({
                    ...oldState,
                })
            });
            this.setModalVisible(false);
        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    render(){
        let content = (
            <View>
                <ResultsList
                    list ={this.props.state.main.resultsList}
                    onItemSelected={this.itemSelectedHandler}
                    onRemoveData={this.handleRemoveResult}
                    onRenameData={this.handleOnRenamePressed}
                    extraData={this.state}
                />
            </View>
        );
//        console.log(this.props.state.main.resultsList);
        return(
            <View>
                <View>
                    {this.props.state.main.resultsList.length > 0
                        ? content
                        : <Text style={{justifyContent:'center', alignItems:'center'}}>This doesn't have any results yet</Text>
                    }
                </View>
                <View>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
                <View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{height: "80%", width:"80%"}}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {this.setModalVisible(!this.state.modalVisible);}}
                            >
                                <View
                                    style={{
                                        backgroundColor:'#000',
                                        opacity: 0.5,
                                        flex:1,
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                    }}
                                />
                            </TouchableWithoutFeedback>
                            <View style={styles.modalStyle}>
                                <Formik
                                    initialValues={{ newName: JSON.stringify(this.props.state.main.data)}}
                                    onSubmit={this._handleSubmit}
                                    validationSchema={Yup.object().shape({
                                        newName: Yup.string().required(),
                                    })}
                                    render={({
                                                 values,
                                                 handleSubmit,
                                                 setFieldValue,
                                                 errors,
                                                 touched,
                                                 setFieldTouched,
                                                 isValid,
                                                 isSubmitting
                                             }) => (
                                        <View>
                                            <Input
                                                label="New Name"
                                                autoCapitalize="none"
                                                value={values.newName}
                                                onChange={setFieldValue}
                                                onTouch={setFieldTouched}
                                                name="newName"
                                                error={touched.newName && errors.newName}
                                            />
                                            <Button
                                                title={"Cancel"}
                                                onPress={() =>{this.setModalVisible(false)}}
                                            />
                                            <Button
                                                title="OK"
                                                onPress={handleSubmit}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle:{
        marginTop: 22,
        height: "50%",
        width:"80%",
        backgroundColor: '#EEE',
        paddingTop: "20%",
    }
});

const mapStateToProps = (state) => {
    return {
        state
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRemoveData: (key) => dispatch(removeData(key)),
        onRenameData: (key, newName) => dispatch(renameData(key,newName))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(ResultScreen)