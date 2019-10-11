import {Button} from "react-native-elements";
import {View} from "react-native";
import React, {Component} from "react";
import * as colors from "../../assets/colors";

class FormBackButton extends Component {
    render(){
        console.log("Update of FormBackButton");
        return (
            <View style={{backgroundColor: colors.royalBlue2}}>
                <Button
                    title="Go back"
                    onPress={this.props.onPress}
                    icon={
                        {
                            name: "chevron-left",
                            color: "#FFF",
                            type: "ionicons"
                        }
                    }
                    color={"#FFF"}
                    buttonStyle={{backgroundColor: colors.royalBlue2, width: "50%"}}
                />
            </View>
        )
    }
}

export default FormBackButton;