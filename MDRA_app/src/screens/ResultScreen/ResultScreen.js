//system
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Animated,
    Modal,
    StyleSheet,
    StatusBar,
    Alert,
    Platform
} from 'react-native';
import {Formik} from "formik";
import {Button} from 'react-native-elements';
import {connect} from "react-redux";
import * as Yup from "yup";
//actions
import {removeData, renameData} from '../../store/actions/index';

//components
import ResultsList from "../../components/ResultsList/ResultsList";
import Input from "../../components/Input/Input";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import {udemDark} from "../../assets/colors";
import Spinner from "react-native-loading-spinner-overlay";
import SelectionList from "../../components/SelectionList/SelectionList";


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
        //selected is linked to rename in the list and not the actual selection
        selected: false,
        spinnerIsVisible: false,
        //amountOfPush is there to limit the amount of pushed screen done
        amountOfPushes: 0,
        selectorListAvailable: false,
        currentlySelectedItem: 0,
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarNoBorder: false,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: false,
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            navBarButtonColor: Platform.OS === 'android'?'#3057e1': null
        });
    }

    componentDidMount() {
        //create new list of possible selection
        let newSelectedMap = {};
        //add new objects to list
        for (let i = 0; i < this.props.state.main.resultsList.length; i++) {
            newSelectedMap[this.props.state.main.resultsList[i].key] = false;
        }
        this.setState((oldState) => {
            return {
                ...oldState,
                selectedList: newSelectedMap
            }
        });

        console.log("New selected dictionary"+JSON.stringify(newSelectedMap))
    }

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };

    spinnerToggler = () => {
        this.setState((oldState)=>{
            return {
                ...oldState,
                spinnerIsVisible: !oldState.spinnerIsVisible,
                amountOfPushes: 1
            }
        });
    };

    handleItemAccessed = key => {
        //blocker's purpose is to stop multi pushes on android
        let activateBlocker = Platform.OS === "android";
        if(this.state.amountOfPushes === 0) {
            if(activateBlocker) {
                this.spinnerToggler();
            }
            let selResult = null;
            let selPosition = 0;
            for (let i = 0; i < this.props.state.main.resultsList.length; i++) {
                if (this.props.state.main.resultsList[i].key === key) {
                    selResult = this.props.state.main.resultsList[i];
                    selPosition = i;
                }
            }
            //console.log(key);
            //this.props.navigator.popToRoot();
            this.props.navigator.push({
                screen: "MDRA_app.resultPage",
                title: this.props.state.main.resultsList[selPosition].name,
                passProps: {
                    selectedPosition: selPosition
                }
            });


            if(activateBlocker) {
                //remove spinner
                setTimeout(
                    () => {
                        this.spinnerToggler();
                    },
                    1000)
            }
        }
        else{
            setTimeout(
                () => {
                    this.setState((oldState)=>{
                        return {
                            ...oldState,
                            amountOfPushes: 0
                        }
                    });
                },
                500)
        }
    };

    toggleSelectorList = () => {
        this.setState((oldState) => {
            return({
              ...oldState,
              selectorListAvailable: !oldState.selectorListAvailable,
            })
        })
    };

    handleOnEnablingSelection = (key) => {
        this.toggleSelectorList();
        this.handleItemSelected(key)
    };

    handleItemSelected = (key) => {
        console.log("selectedList before:"+JSON.stringify(this.state.currentlySelectedItem));
        //update key
        // let newSelectedList = {};
        // for (let i in this.state.selectedList)
        //     newSelectedList[i] = this.state.selectedList[i];
        // newSelectedList[key] = !this.state.selectedList[key];
        this.setState((oldState) => {
            return({
                ...oldState,
                currentlySelectedItem: key
            })
        });
        //reload screen
        console.log("selectedList after:"+JSON.stringify(this.state.currentlySelectedItem));
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

        // Alert.alert(
        //     'Rename',
        //     'Please enter new name?', [
        //         {
        //             text: 'Cancel',
        //             onPress: (() => console.log('Cancel Pressed')),
        //             style: 'cancel'
        //         }, {
        //             text: 'Rename',
        //             onPress: () => this.props.onRenameData(key,values.newName);
        //         }
        //     ],
        //     {
        //         cancelable: false
        //     }
        // );
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
            (this.state.selectorListAvailable)
                ?<View>
                    <Button title={"Now in selection mode"} onPress={this.toggleSelectorList}/>
                    <SelectionList
                        list ={this.props.state.main.resultsList}
                        onItemSelected={this.handleItemSelected}
                        selectedList={this.state.selectedList}
                    />
                </View>
                : <ResultsList
                    list ={this.props.state.main.resultsList}
                    onToggleSelectorList={this.handleOnEnablingSelection}
                    onItemSelected={this.handleItemAccessed}
                    onRemoveData={this.handleRemoveResult}
                    onRenameData={this.handleOnRenamePressed}
                    extraData={this.state}
                />
        );
//        console.log(this.props.state.main.resultsList);
        return(
            <View>
                <View style={{margin:0, paddingBottom:0, height:"92%"}}>
                    {this.props.state.main.resultsList.length > 0
                        ? content
                        : <View style={{flex:1, alignItems:"center", justifyContent:"center"}}><Text style={{justifyContent:'center', alignItems:'center'}}>This doesn't have any results yet</Text></View>
                    }
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
                                <View>
                                    <TitleComponent
                                        text={'Please enter new name'}
                                        textStyle={{fontSize:20}}
                                        containerStyle={{backgroundColor:"transparent"}}
                                    />
                                </View>
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
                                            <View style={{marginBottom: 10, marginTop: 0, paddingTop:0}}>
                                                <Input
                                                    autoCapitalize="none"
                                                    style={[styles.buttonStyles]}
                                                    value={values.newName}
                                                    onChange={setFieldValue}
                                                    onTouch={setFieldTouched}
                                                    name="newName"
                                                    error={touched.newName && errors.newName}
                                                />
                                            </View>
                                            <TouchableHighlight
                                                onPress={handleSubmit}
                                                style={[styles.buttonStyles, {backgroundColor:"#EEE", borderRadius: 15}]}
                                            >
                                                <TitleComponent
                                                    text={'Rename'}
                                                    textStyle={{fontSize:15}}
                                                    containerStyle={styles.buttonTitleComponentStyle}
                                                />
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                onPress={() =>{this.setModalVisible(false)}}
                                                style={[styles.buttonStyles, {backgroundColor:"transparent"}]}
                                            >
                                                <TitleComponent
                                                    text={'Cancel'}
                                                    textStyle={{fontSize:15}}
                                                    containerStyle={styles.buttonTitleComponentStyle}
                                                />
                                            </TouchableHighlight>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <Spinner visible={this.state.spinnerIsVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle:{
        marginTop: 22,
        width: (4/6*100)+"%",
        backgroundColor: '#EEE',
        borderRadius: 15,
    },

    buttonStyle:{
        width: "100%",
        height: "10%"
    },

    buttonTitleComponentStyle: {
        borderBottomWidth: 0,
        borderTopWidth: 0.5,
        backgroundColor:"transparent"
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