export const onPressIn = ({nativeEvent:{locationX,locationY, target}}) => {
    // Android will send multiple events with different targets
    // so we will store the target so we may filter move events
    this.pressInfo = {
        startX: locationX,
        startY: locationY,
        lastX: locationX,
        lastY: locationY,
        target: target
    }
};

export const onMove = ({nativeEvent:{locationX,locationY, target}}) => {
    if (this.pressInfo && this.pressInfo.target === target) {
        this.pressInfo.lastX = locationX;
        this.pressInfo.lastY = locationY;
    }
};

export const onPressOut = (item,{nativeEvent:{locationX,locationY,target}}) => {

    // locationX and LocationY are undefined on iOS if the event
    // was cancelled by a pan/scroll type action. On Android it seems
    // to return the coordinates at the moment it was cancelled, so we
    // will have to distance (radius) test.
    //
    // Note1: Logging the onResponderMove shows Android emits two move events for
    //        each move, each with different targets. Also the onPressIn event
    //        will see a different target than the onPressOut event, so
    //        we will filter onResponderMove events for the target used during
    //        the onPressIn event and ignore the one for onPressOut

    if (locationX === undefined || !this.pressInfo)
        return;

    // adjust move distance as required, 3 seems to work, anything larger is
    // likely a pan/scroll type situation, or a very fat thumb
    if (Math.abs(
        Math.sqrt(
            Math.pow((this.pressInfo.lastX - this.pressInfo.startX), 2) +
            Math.pow((this.pressInfo.lastY - this.pressInfo.startY), 2)
        )
    ) > 3)
        return

    // emulated onPress happened - DO YOUR ONPRESS WORK HERE
};