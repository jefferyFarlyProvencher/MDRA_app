//system
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Modal,
    StyleSheet,
    StatusBar,
    Alert,
    Platform,
    Dimensions,
    BackHandler
} from 'react-native';
import {Formik} from "formik";
import {Button, SearchBar} from 'react-native-elements';
import {connect} from "react-redux";
import * as Yup from "yup";
import Picker from 'react-native-picker';

//actions
import {removeData, renameData} from '../../store/actions/index';

//components
import ResultsList from "../../components/ResultsList/ResultsList";
import Input from "../../components/Input/Input";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import {udemDark} from "../../assets/colors";
import Spinner from "react-native-loading-spinner-overlay";
import SelectionList from "../../components/SelectionList/SelectionList";
import isSameName from '../../functions/IsSameName';
import NewYupString from "../../components/NewYupString/NewYupString";
import DropDownListV2 from "../../components/DropDownList/DropDownListV2"
import SelectorPicker from '../../components/SelectorPicker/SelectorPicker';
import * as colors from "../../assets/colors";



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
        renameError: false,
        isDeleteDisabled: false,
        toDeleteList: [],
        darkVisible: false,
        currentModifiedList: this.props.state.main.resultsList,
        fullList: this.props.state.main.resultsList,
        searchTarget: 'Name',
        searchText : '',
        patientTarget: "None Selected",
        refreshList: false,
    };


    DefaultCustomButtons = [
        {
            title: 'Delete', // for a textual button, provide the button title (label)
            id: 'deleteButton', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            disabled:  this.state.isDeleteDisabled, // optional, used to disable the button (appears faded and doesn't interact)
            disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
            showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            buttonColor: '#ff374b', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontSize: 16.5, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
        },
        {
            title: 'Cancel', // for a textual button, provide the button title (label)
            id: 'cancelButton', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
            disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
            showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            buttonColor: colors.royalBlue1, // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontSize: 16.5, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
        }
    ];

    static navigatorButtons = {
        rightButtons: []
    };

    onNavigatorEvent = event => {
        if(event.type === "NavBarButtonPress") {
            if(event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
            else if(event.id === "deleteButton"){
                console.log("deleteButton Pressed");
                this.handleSelectionDeletion(this.state.toDeleteList);
            }
            else if(event.id === "cancelButton"){
                console.log("cancelButton Pressed");
                this.toggleSelectorList();
            }
        }
    };

    componentWillMount() {
        this.props.navigator.setStyle({
            navBarNoBorder: false,
            topBarElevationShadowEnabled: false,
            drawUnderNavBar: false,
            navBarBackgroundColor: '#262626',
            navBarTextColor: '#ffffff',
            statusBarTextColorSchemeSingleScreen: 'light',
            //navBarButtonColor: Platform.OS === 'android'?'#3057e1': null
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

        //console.log("New selected dictionary"+JSON.stringify(newSelectedMap))
    }

    componentWillReceiveProps(nextProps, nextContext) {
        //console.log("about to start comparison");
        if(this.state.fullList.length !== this.props.state.main.resultsList.length)
        {
            console.log("passed full list comparison, searchText is: "+ this.state.searchText);
            this.setState(oldState=>{
                return{
                    ...oldState,
                    refreshList: true
                }
            })
        }
        //else
            //console.log("failed comparison")
    }

    /**
     *
     */

    spinnerToggler = () => {
        this.setState((oldState)=>{
            return {
                ...oldState,
                spinnerIsVisible: !oldState.spinnerIsVisible,
                amountOfPushes: 1
            }
        });
    };

    /**
     * handleItemAccessed
     *
     * @param key
     * @param contextSensitiveList
     *
     * Finds the position of the current item and pushes new screen
     */

    handleItemAccessed = (key,contextSensitiveList) => {
        //blocker's purpose is to stop multi pushes on android

        let list = contextSensitiveList;

        let activateBlocker = Platform.OS === "android";
        if(this.state.amountOfPushes === 0) {
            if(activateBlocker) {
                this.spinnerToggler();
            }
            let selResult = null;
            let selPosition = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].key === key){//this.props.state.main.resultsList[i].key === key) {
                    selResult = list[i];//this.props.state.main.resultsList[i];
                    selPosition = i;
                }
            }
            //console.log(key);
            //this.props.navigator.popToRoot();

            //here we push the new screen and we send its position and

            BackHandler.removeEventListener('back',
                () => {
                    // if(this.props.state.main.position === 0 || this.props.state.main.position === 4)
                    Alert.alert(
                        'Exit App',
                        'Exiting the application?', [
                            {
                                text: 'Cancel',
                                onPress: (() => console.log('Cancel Pressed')),
                                style: 'cancel'
                            }, {
                                text: 'OK',
                                onPress: () => BackHandler.exitApp(),
                            }
                        ],
                        {
                            cancelable: false
                        }
                    );
                return true;}
            )

            this.props.navigator.push({
                screen: "MDRA_app.resultPage",
                title: list[selPosition].name,
                passProps: {
                    selectedPosition: selPosition,
                    contextSensitiveList: list.length === this.props.state.main.resultsList.length?null:list
                }
            });


            if(activateBlocker) {
                //remove spinner
                setTimeout(
                    () => {
                        this.spinnerToggler();
                        this.setState((oldState)=>{
                            return {
                                ...oldState,
                                amountOfPushes: 0
                            }
                        });
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
                100)
        }
    };

    toggleSelectorList = (key) => {
        //since this is a toggle, if it's false, then it will become true afterwards
        // and it was sent a key to put in list
        if(!this.state.selectorListAvailable || key)
        {
            this.handleItemSelected(key)
        }
        this.setState((oldState) => {
            return({
                ...oldState,
                selectorListAvailable: !oldState.selectorListAvailable,
            })
        })
    };

    handleOnEnablingSelection = (key) => {
        //this.handleItemSelected(key, list);
        this.toggleSelectorList(key);
    };

    handleItemSelected = (key) => {
        console.log("handleItemSelected accessed");
        //console.log("selectedList before:"+JSON.stringify(this.state.currentlySelectedItem));
        //console.log("currenModifiedtList before:"+JSON.stringify(this.state.currentModifiedList));
        //update key
        // let newSelectedList = {};
        // for (let i in this.state.selectedList)
        //     newSelectedList[i] = this.state.selectedList[i];
        // newSelectedList[key] = !this.state.selectedList[key];
        this.setState((oldState) => {
            return({
                ...oldState,
                currentlySelectedItem: key,
                toDeleteList: [key]
            })
        });
        //reload screen
        //console.log("selectedList after:"+JSON.stringify(this.state.currentlySelectedItem));
        //console.log("currentModifiedList after:"+JSON.stringify(this.state.currentModifiedList));

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

    /**
     * handleOnRenamePressed prepares for the rename process
     * @param key
     */


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

    verifyIfNeedToUpdateList= () => {
        return(this.props.state.main.resultsList.length !== this.state.fullList.length)
    };

    updateDisplayedList = () => {
        let searchText= this.state.searchText;
        this.searchFilterFunction("+");
        this.searchFilterFunction(searchText);

        this.setState(oldState=>{
            return{
                ...oldState,
                refreshList: false
            }
        })
    };

    /**
     *
     * @param list
     */
    changeDeletionList = (list) =>{
        this.setState(oldState => {

            return({
                ...oldState,
                toDeleteList: list
            })
        });
    };

    /**
     * handleRemoveResult
     * @param key
     *
     * Deletes ONE result, with confirmation pop up
     */
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
                    onPress: () =>{
                        this.props.onRemoveData(key);
                        this.updateDisplayedList();
                    }
                }
            ],
            {
                cancelable: false
            }
        );

    };

    /**
     * handleSelectionDeletion
     * @param selectedList
     *
     * Deletes a group (more than 1) of result
     */

    handleSelectionDeletion = (deletionList)=>{
        //console.log("selectedList: "+ selectedList);
        if(this.state.toDeleteList.length > 0) {
            Alert.alert(
                'Confirmation',
                'Do you really want to remove the selected result(s)?', [
                    {
                        text: 'Nevermind, no',
                        onPress: (() => console.log('Cancel Pressed')),
                        style: 'cancel'
                    }, {
                        text: 'Yes, erase them',
                        onPress: () => {
                            let newSelectedList = this.state.currentModifiedList;
                            console.log("newSelectedList length before: "+ newSelectedList.length);
                            for (let i = 0; i < deletionList.length; i++) {
                                this.props.onRemoveData(deletionList[i]);
                            }

                            console.log("newSelectedList length after: "+ newSelectedList.length);

                            this.setState(oldState => {
                                return{
                                    ...oldState,
                                    currentModifiedList: newSelectedList,
                                }
                            });
                            this.updateDisplayedList();
                            this.handleDisableDeleteButton(0, [])
                        }
                    }
                ],
                {
                    cancelable: false
                }
            );
        }
        else if(this.state.toDeleteList.length < 1){
            Alert.alert("Warning", "No items are selected")
        }
    };
    /**
     * Does as it is said
     * @param lengthOfSelection
     * @param list
     *
     * NOTE: I do not now how to dynamically change the disabled from true to false,
     *       Thus, I do the extremely inefficient way of recreating the object
     *
     * NOTE2: Because of an unknown glitch, we need to have the length sent on its own, as otherwise the effect of the
     *        disable is not done immediately
     */
    handleDisableDeleteButton = (lengthOfSelection, list) => {
        let newCustomButtons = [
            {
                title: 'Delete', // for a textual button, provide the button title (label)
                id: 'deleteButton', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                disabled:  lengthOfSelection < 1, // optional, used to disable the button (appears faded and doesn't interact)
                disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
                buttonColor: '#ff374b', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 16.5, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            },
            {
                title: 'Cancel', // for a textual button, provide the button title (label)
                id: 'cancelButton', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
                buttonColor: colors.royalBlue1, // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 16.5, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            }
        ];

        this.changeDeletionList(list);

        setTimeout(
            ()=> {
                this.props.navigator.setButtons({rightButtons:newCustomButtons});
            },
            100
        )


    };

    _handleRenameSubmit =(async (values, bag) => {
        try {
            if(!isSameName(values.newName, this.props.state.main.resultsList, this.state.renameTarget)) {
                this.props.onRenameData(this.state.renameTarget,values.newName);
                this.setState((oldState)=>{
                    return({
                        ...oldState,
                        renameError: false,
                    })
                });
                await this.setModalVisible(false);
            }else{
                await Alert.alert("Rename Warning","Name "+ action.name +" is already used by another Result, please use a name that is not used by any other item");
                console.log("Rename Warning","Name "+ action.name +" is already used by another Result, please use a name that is not used by any other item");
                bag.setErrors("newName","Name "+ action.name +" is already used by another Result, please use a name that is not used by any other item");
            }

        }catch (e) {
            bag.setSubmitting(false);
            bag.setErrors(e);
        }
    });

    handleSetDarkVisibility = () => {
        this.setState(oldState =>{
            return({
                ...oldState,
                darkVisible: !oldState.darkVisible
            })
        })
    };

    searchFilterFunction = text => {
        //console.log("searchFilterFunction start and the text is: "+text);

        let list = this.props.state.main.resultsList;

        let tempNewData = null;

        if(text !== null || text !== '') {
            if (this.state.searchTarget === 'Name') {
                console.log("filtering with Name");
                tempNewData = (list).filter(item => {
                    const itemData = `${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}
                              ${item.name.toUpperCase()}`;
                    const textData = text.toUpperCase();

                    return itemData.indexOf(textData) > -1;
                });
            } else if (this.state.searchTarget === 'Date') {
                console.log("filtering with Date");
                tempNewData = (list).filter(item => {
                    if (item.date !== 'null' && typeof item.date !== "undefined") {
                        console.log("filtering with Date -> passed if");
                        const itemData = `${item.date.toUpperCase()}
                              ${item.date.toUpperCase()}
                              ${item.date.toUpperCase()}`;
                        const textData = text.toUpperCase();

                        return itemData.indexOf(textData) > -1;
                    } else {
                        return false
                    }
                });
            } else if (this.state.searchTarget === 'Patients') {
                console.log("filtering with Patients");
                if (text === "None Selected") {
                    text = ''
                }
                tempNewData = (list).filter(item => {
                    if (typeof item.patient !== 'undefined' && item.patient !== null) {
                        const itemData = `${item.patient.toUpperCase()}
                                  ${item.patient.toUpperCase()}
                                  ${item.patient.toUpperCase()}`;
                        const textData = text.toUpperCase();

                        return itemData.indexOf(textData) > -1;
                    } else {
                        return false
                    }
                });
            }
            /// OLD CODE START
            // const newData = (this.props.list).filter(item => {
            //     const itemData = `${item.name.toUpperCase()}
            //                       ${item.name.toUpperCase()}
            //                       ${item.name.toUpperCase()}`;
            //     const textData = text.toUpperCase();
            //
            //     return itemData.indexOf(textData) > -1;
            // });
            /// OLD CODE END

            //console.log(JSON.stringify("modList 1: "+ this.state.currentModifiedList));
            //console.log(JSON.stringify("size modList 1: "+ this.state.currentModifiedList.length));
        }
        else{
            tempNewData = list;
        }

        const newData = tempNewData;
        this.setState(oldState => {
            return{
                ...oldState,
                currentModifiedList: newData,
                searchText: text
            }
        });
        // console.log(JSON.stringify("modList 2: "+ this.state.currentModifiedList));
        //console.log(JSON.stringify("size modList 2: "+ this.state.currentModifiedList.length));
        if(this.state.selectorListAvailable && this.state.toDeleteList.length === 0){
            this.handleDisableDeleteButton(0, [])
        }
    };

    handlePatientProfileSelection = (profile) =>{
        this.setState(oldState=> {
            return{
                ...oldState,
                patientTarget: profile
            }

        })
    };


    handleSearchTypeSelection = (target) => {
        console.log("target: "+ target);
        this.setState(oldState=> {
            return{
                ...oldState,
                searchTarget: target
            }

        })
    };


    /**
     * renders header for search
     * @returns {*}
     */
    renderHeader = () => {
        //console.log("search target: "+ this.state.searchTarget);
        //console.log("search text: "+ this.state.searchText);
        let selectorChoices= [
            {
                key: '0848496513',
                name: "Result Name",
                subtitle:"",
                displayName: "Name",
            },
            {
                key: '15555884454',
                name: "Creation Date\n(format: YYYY-MM-DD)",
                displayName: "Date"
            },
            {
                key: '26655894135',
                name: "Patient Profile",
                displayName: "Patients"
            },
        ];

        let isPatients = this.state.searchTarget !== "Patients";



        let patientsList_id = ["None Selected"];

        if(!isPatients){
            for(let i = 0; i < this.props.state.main.patientsList.length; i++)
            {
                patientsList_id.push(this.props.state.main.patientsList[i].id);
            }
        }

        return (
            <View style={{flexDirection:"row", alignItems: "center", justifyContent: "center", backgroundColor:"#262626", paddingBottom: 10}}>
                <View style={{width: Dimensions.get("window").width *0.8}}>
                    {isPatients
                        ?<SearchBar
                            placeholder={"Press to Search"}
                            lightTheme={false}
                            round={true}
                            onChangeText={text => {
                                this.searchFilterFunction(text);
                            }}
                            autoCorrect={false}
                            containerStyle={{backgroundColor:"#262626", borderTopWidth:0, borderBottomWidth:0, marginBottom:0, paddingBottom:0}}
                        />
                        :<View style={{flexDirection:"row", width:"92%", marginLeft: 10, }}>
                            <DropDownListV2
                                value={this.state.patientTarget}
                                onChange={(name,value)=>{
                                    this.handlePatientProfileSelection(value);
                                    this.searchFilterFunction(value);
                                }}
                                itemList={patientsList_id}
                                Picker={Picker}
                                setDarkVisibility = {this.handleSetDarkVisibility}
                                pickerBackgroundColor={"#303338"}
                                textColor={"#FFF"}
                            />
                        </View>
                    }
                </View>
                <SelectorPicker choices={selectorChoices} itemSelected={this.handleSearchTypeSelection} style={{borderRadius:100}}/>
            </View>
        );
    };

    render(){


        let header = this.renderHeader();
        let content = (
            (this.state.selectorListAvailable)
                ?<View>
                    <SelectionList
                        list ={this.state.currentModifiedList}
                        onItemSelected={this.handleItemSelected}
                        selectedValue={this.state.currentlySelectedItem}
                        cancelSelection={this.toggleSelectorList}
                        deleteSelection={this.handleSelectionDeletion}
                        disableDeleteButton = {this.handleDisableDeleteButton}
                        //listStyle={{height:Dimensions.get("window").height*(Platform.OS === "android"?0.64:0.71)}}
                        //header={header}
                    />
                </View>
                :<View style={styles.container}>
                    <ResultsList
                        list ={this.state.currentModifiedList}
                        onToggleSelectorList={this.handleOnEnablingSelection}
                        onItemAccessed={this.handleItemAccessed}
                        onRemoveData={this.handleRemoveResult}
                        onRenameData={this.handleOnRenamePressed}
                        extraData={this.props.state.main.resultsList.length}
                        //listStyle={{height:Dimensions.get("window").height*(Platform.OS === "android"?0.64:0.71)}}
                        patientsList={this.props.state.main.patientsList}
                        Picker={Picker}
                        handleSetDarkVisibility={this.handleSetDarkVisibility}
                        //header={header}
                    />
                </View>
        );

        if(this.state.selectorListAvailable)
            this.props.navigator.setButtons({rightButtons:this.DefaultCustomButtons});
        else{
            this.props.navigator.setButtons({rightButtons:[]});
        }


        if(this.state.refreshList){
            this.updateDisplayedList()
        }

        //console.log(this.props.state.main.resultsList);
        //console.log("This is the current list of results[1]:"+ JSON.stringify(this.props.state.main.resultsList));
//        console.log("This is the current list of results[2]:"+ JSON.stringify(this.props.state.main.resultsList[2]));
//        console.log("This is the current list of results[3]:"+ JSON.stringify(this.props.state.main.resultsList[3]));
        //console.log("THIS IS THE renameError: " + this.state.renameError);
        return(
            <View style={styles.container}>
                {this.props.state.main.resultsList.length > 0
                    ?<View style={styles.container}>
                        {header}
                        {content}
                    </View>
                    : <View style={{flex:1, alignItems:"center", justifyContent:"center"}}><Text style={{justifyContent:'center', alignItems:'center'}}>This doesn't have any results yet</Text></View>
                }
                <View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
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
                                    onSubmit={this._handleRenameSubmit}
                                    validationSchema={Yup.object().shape({
                                        newName: NewYupString().isSameName(this.props.state.main.resultsList,this.state.renameTarget).required(),
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
                                                    error={touched.newName && errors.newName || this.state.renameError}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                style={[styles.buttonStyles, {backgroundColor:"#EEE", borderRadius: 15}]}
                                            >
                                                <TitleComponent
                                                    text={'Rename'}
                                                    textStyle={{fontSize:15}}
                                                    containerStyle={styles.buttonTitleComponentStyle}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>{this.setModalVisible(false)}}
                                                style={[styles.buttonStyles, {backgroundColor:"transparent"}]}
                                            >
                                                <TitleComponent
                                                    text={'Cancel'}
                                                    textStyle={{fontSize:15}}
                                                    containerStyle={styles.buttonTitleComponentStyle}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
                {(this.state.darkVisible)?
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.handleSetDarkVisibility(!this.state.darkVisible);
                            Picker.hide()
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#000',
                                opacity: 0.5,
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                position: "absolute",

                            }}
                        />
                    </TouchableWithoutFeedback>
                    :<View/>
                }
                <View>
                    <Spinner visible={this.state.spinnerIsVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
    },
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
    },

    surroundTextContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 50
    },
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