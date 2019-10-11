import React from "react";
import {Image, StyleSheet, View, TouchableWithoutFeedback, Platform} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import * as colors from "../../assets/colors";

class CheckBox extends React.Component {

    state={
      checked: this.props.checked
    };

    render() {
        console.log("Update of Checkbox");
        return (
            <View style={[styles.containerStyle, this.props.containerStyle]}>
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                {this.props.checked
                    ?<View>
                        <Icon
                            size={35}
                            name= {"md-checkbox"}
                            color= {colors.paleBlue1}
                        />
                    </View>
                    :<View>
                        <Icon
                            size={35}
                            name= {"md-square"}
                            color={colors.paleBlue1}
                        />
                    </View>
                }
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
    },

    containerStyle: {

    }
});

export default CheckBox;