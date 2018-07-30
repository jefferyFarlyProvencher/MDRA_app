import React, {Component} from 'react';
import {
    StyleSheet,
    PanResponder,
    View,
    ViewPropTypes,
    TouchableHighlight,
    Text
} from 'react-native';
import converter from './converter.js';
import mockProps from './mockProps.js';

let PropTypes = require('prop-types');
let createReactClass = require('create-react-class');

let ViewStylePropTypes = ViewPropTypes ? ViewPropTypes.style : View.propTypes.style;


let sliderProps = {
    values: PropTypes.arrayOf(PropTypes.number),

    onValuesChangeStart: PropTypes.func,
    onValuesChange: PropTypes.func,
    onValuesChangeFinish: PropTypes.func,

    sliderLength: PropTypes.number,
    sliderOrientation: PropTypes.string,
    touchDimensions: PropTypes.object,

    customMarker: PropTypes.func,

    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,

    optionsArray: PropTypes.array,

    containerStyle: ViewStylePropTypes,
    trackStyle: ViewStylePropTypes,
    selectedStyle: ViewStylePropTypes,
    unselectedStyle: ViewStylePropTypes,
    markerStyle: ViewStylePropTypes,
    pressedMarkerStyle: ViewStylePropTypes
};

class Slider extends Component{

    getInitialState() {
        this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min,this.props.max,this.props.step);
        this.stepLength = this.props.sliderLength/this.optionsArray.length;

        let initialValues = this.props.values.map(value => converter.valueToPosition(value,this.optionsArray,this.props.sliderLength));

        let pastMarker=[];
        for(let i=0;i<initialValues.length;i++)
        {
            pastMarker.push(initialValues[i]);
        }

        return {
            pressedOne: true,
            amountOfDots: initialValues.length,
            values: (this.props.values.slice()),
            //valueOne: this.props.values[0],
            //valueTwo: this.props.values[1],
            pastMarker: initialValues.slice(),
            //pastOne: initialValues[0],
           // pastTwo: initialValues[1],
            positions: initialValues.slice(),
           // positionOne: initialValues[0],
           // positionTwo: initialValues[1],
            markersArray: [],
        };
    }

    state = this.getInitialState();

    componentWillMount() {

        let customPanResponderModified = function (id,start,move,end) {
            return PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
                onPanResponderGrant: (evt, gestureState) => start(id),
                onPanResponderMove: (evt, gestureState) => move(id,gestureState),
                onPanResponderTerminationRequest: (evt, gestureState) => false,
                onPanResponderRelease: (evt, gestureState) => end(id,gestureState),
                onPanResponderTerminate: (evt, gestureState) => end(id,gestureState),
                onShouldBlockNativeResponder: (evt, gestureState) => true
            })
        };

        this._panResponder = [];
        for(let id = 0; id < this.state.amountOfDots;id++){
            this._panResponder.push(customPanResponderModified(id,this.start, this.move, this.end));
        }
    }

    componentWillReceiveProps(nextProps) {
        let { values } = this.props;
        if (nextProps.values.join() !== values.join()) {
            this.set(nextProps);
        }
    }

    set(config) {
        let { max, min, optionsArray, step, values } = config || this.props;
        this.optionsArray = optionsArray || converter.createArray(min, max, step);
        this.stepLength = this.props.sliderLength/this.optionsArray.length;

        let initialValues = values.map(value => converter.valueToPosition(value,this.optionsArray,this.props.sliderLength));

        this.setState({
            pressed: true,
            values: values,
            pastMarker: initialValues.slice(),
            positions: initialValues.slice(),

        });
    }

    //New code
    start (id) {
        this.props.onValuesChangeStart();
        let newMarkerPressed = this.state.markerPressed.slice();
        newMarkerPressed[id] = !this.state.markerPressed[id];
        this.setState({
            markerPressed: newMarkerPressed,
        });
    }

    ///New code
    move(id,gestureState) {
        let unconfined = gestureState.dx + this.state.pastMarker[id];
        let bottom     = id-1 > 0? id-1:0;
        let top        =  id+1<=this.state.position.length-1?(this.state.position[id+1] - this.stepLength) || this.props.sliderLength: null;
        let confined   = unconfined < bottom ? bottom : (unconfined > top ? top : unconfined);
        let value      = converter.positionToValue(this.state.position[id], this.optionsArray, this.props.sliderLength);

        let slipDisplacement = this.props.touchDimensions.slipDisplacement;

        if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
            let newPosition = this.state.positions.slice();
            newPositions[id] = confined;
            this.setState({
                positions: newPositions
            });
        }
        if ( value !== this.state.values[id] ) {
            let newValues = this.state.values.slice();
            newValues[id] = value;
            this.setState({
                values: newValues
            }, function () {
                let change = [this.state.values[0]];
                if (this.state.amountOfDots>1) {
                    for(let i = 0; i < this.amountOfDots; i++) {
                        change.push(this.state.values[i]);
                    }
                }
                this.props.onValuesChange(change);
            });
        }
    }

    end(id,gestureState) {
        //set up for new state
        let newMarkerPressed= this.state.markerPressed.slice();
        newMarkerPressed[id]=!newMarkerPressed[id];

        let newPastMarker = this.state.pastMaker.slice();
        newPastMarker[id]= this.state.positions[id];

        //do new state
        this.setState({
            pastMarker: newPastMarker,
            markerPressed: newMarkerPressed,
        }, function () {
            let change = [this.state.values[0]];
            if (this.state.amountOfDots>1) {
                for(let i = 1; i < this.amountOfDots; i++) {
                    change.push(this.state.values[i]);
                }
            }
            this.props.onValuesChange(change);
        });
    }

    ///MY CODE FROM HERE ON DUDES AND DUDETTES
    _handleMarkers = (
        Marker,
        fixedPositions,
        multiMarkers,
        positions,
        touchStyle,
        trackLengths,
        width,
        panResponder,
        markers) =>
    {
        console.log(JSON.stringify(fixedPositions));
       /* let markers = fixedPositions.map((a, i) => {
            console.log(a);
            return(
                <View
                    key={i}
                    style={{
                        height:40,
                        borderBottomWidth:2,
                        borderBottomColor: '#ededed'
                    }}
                >
                    <Text> {a}</Text>
                </View>
            )
        });
        console.log(markers);
        return markers;*/
        return(
             multiMarkers && (positions[positions.length-1] !== this.props.sliderLength) && (
                fixedPositions.map((a,i) =>{
                    let leftValue = () => {
                        let returnValue = 0;
                        for(let j = i+1; j < trackLengths.length-1; j++)
                            returnValue+=trackLengths[j]
                        return returnValue;
                    };
                    return(
                       <View
                        style={[styles.touch, touchStyle, {left: -(leftValue() + width * 1.5)}]}
                        ref={component => markers.push(component)}
                        {...panResponder[i].panHandlers}
                        >
                            <Marker
                                pressed={this.state.markerPressed[i]}
                                value={a}
                                markerStyle={this.props.markerStyle}
                                pressedMarkerStyle={this.props.pressedMarkerStyle}
                            />
                        </View>
                    )
                })
            )
        )
    }


    render() {

        this._markers= [];
        let {positions} = this.state;
        let {selectedStyle, unselectedStyle, sliderLength} = this.props;
        let multiMarkers = this.state.amountOfDots;

        let fixedPositions = [];
        for(let i = 0; i < this.state.amountOfDots; i++)
        {
            fixedPositions.push(Math.floor(this.state.positions[i]/this.stepLength) * this.stepLength)
        }
        //console.log("fixedPositions: "+ JSON.stringify(fixedPositions));

        let trackLengths = [];
        trackLengths.push(positions[0]);
        let lastTrackLength = multiMarkers? sliderLength - positions[positions.length-1]: 0;
        for( let i = 1; i < positions.length; i++)
        {
            trackLengths.push(positions[i]-positions[i-1])
        }
        trackLengths.push(lastTrackLength);

        let trackStyles = [];
        for( let i = 0; i < positions.length; i++)
        {
            trackStyles.push(multiMarkers? unselectedStyle: selectedStyle)
        }
        trackStyles.push(unselectedStyle);



        let Marker = this.props.customMarker;
        let {top, slipDisplacement, height, width, borderRadius} = this.props.touchDimensions;
        let touchStyle = {
            top: top || -10,
            height: height,
            width: width,
            borderRadius: borderRadius || 0
        };


        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={[styles.fullTrack, { width: sliderLength }]}>
                    <View style={[this.props.trackStyle, styles.track, trackStyles[0], { width: trackLengths[0] }]} />
                    <View style={[this.props.trackStyle, styles.track, trackStyles[1], { width: trackLengths[1] }]} />
                    { multiMarkers && (
                        <View style={[this.props.trackStyle, styles.track, trackStyles[2], { width: trackLengths[2] }]} />
                    ) }
                    <View
                        style={[styles.touch, touchStyle, {left: -(trackLengths[1] + trackLengths[2] + width / 2)}]}
                        ref={component => this._marker.push(component)}
                        {...this._panResponder[0].panHandlers}
                    >
                        <Marker
                            pressed={this.state.markerPressed[0]}
                            value={this.state.values[0]}
                            markerStyle={this.props.markerStyle}
                            pressedMarkerStyle={this.props.pressedMarkerStyle}
                        />
                    </View>

                    { twoMarkers && (positionOne !== this.props.sliderLength) && (
                        <View
                            style={[styles.touch, touchStyle, {left: -(trackLengths[2] + width * 1.5)}]}
                            ref={component => this._marker.push(component)}
                            {...this._panResponder[1].panHandlers}
                        >
                            <Marker
                                pressed={this.state.markerPressed[1]}
                                value={this.state.values[1]}
                                markerStyle={this.props.markerStyle}
                                pressedMarkerStyle={this.props.pressedMarkerStyle}
                            />
                        </View>
                    ) }
                </View>
            </View>
        );
    }
}
/*
{ this._handleMarkers(
    Marker,
    fixedPositions,
    multiMarkers,
    positions,
    touchStyle,
    trackLengths,
    width,
    this._panResponder,
    this._markers
)
}
*/

//credit for function goes to Brian Huisman's js implementation of David Koelle's AlphaNum algorithm
/*function alphanum(a, b) {
    function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >=48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }

    var aa = chunkify(a);
    var bb = chunkify(b);

    for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x]);
            if (c == aa[x] && d == bb[x]) {
                return c - d;
            } else return (aa[x] > bb[x]) ? 1 : -1;
        }
    }
    return aa.length - bb.length;
}*/

Slider.propTypes ={
    values: PropTypes.arrayOf(PropTypes.number),

    onValuesChangeStart: PropTypes.func,
    onValuesChange: PropTypes.func,
    onValuesChangeFinish: PropTypes.func,

    sliderLength: PropTypes.number,
    sliderOrientation: PropTypes.string,
    touchDimensions: PropTypes.object,

    customMarker: PropTypes.func,

    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,

    optionsArray: PropTypes.array,

    containerStyle: ViewStylePropTypes,
    trackStyle: ViewStylePropTypes,
    selectedStyle: ViewStylePropTypes,
    unselectedStyle: ViewStylePropTypes,
    markerStyle: ViewStylePropTypes,
    pressedMarkerStyle: ViewStylePropTypes
};

Slider.defaultProps = mockProps;


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    fullTrack: {
        flexDirection: 'row',
    },
    track: {
        justifyContent: 'center'
    },
    touch: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    }
});


export default Slider;
