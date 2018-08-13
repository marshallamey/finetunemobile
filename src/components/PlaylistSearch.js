import React, { Component } from 'react';
import { ScrollView, Slider, Image, View, Text, Button } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import allGenres from '../js/genres.js';

export default class PlaylistSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
       spotify_genres: allGenres,
       chosen_genres: [],

       min_acousticness: 0.0,
       max_acousticness: 1.0,
       min_danceability: 0.0,
       max_danceability: 1.0,
       min_energy: 0.0,
       max_energy: 1.0,
       min_instrumentalness: 0.0,
       max_instrumentalness: 1.0,
       target_key: 0,
       min_liveness: 0.0,
       max_liveness: 1.0,
       min_loudness: -60,
       max_loudness: 0,
       target_mode: 0,
       min_popularity: 0,
       max_popularity: 100,
       min_speechiness: 0.0,
       max_speechiness: 1.0,
       min_tempo: 40,
       max_tempo: 300,
       min_time_signature: 1,
       max_time_signature: 13,
       min_valence: 0.0,
       max_valence: 1.0,
       min_duration: 60000,
       max_duration: 1800000,
   
       keyDisabled: true,
       modeDisabled: true,
       signatureDisabled: true,

       sliderLength: 280,
       acPopoverOpen: false,
       dncPopoverOpen: false,
       enPopoverOpen: false,
       instPopoverOpen: false,
       keyPopoverOpen: false,
       livePopoverOpen: false,
       loudPopoverOpen: false,
       modePopoverOpen: false,
       popPopoverOpen: false,
       spPopoverOpen: false,
       tempPopoverOpen: false,
       tsPopoverOpen: false,
       valPopoverOpen: false,
       durPopoverOpen: false,
       sigPopoverOpen: false
    };    
   
  }

  /* FUNCTION: Change state of song attributes when user moves any input slider */
    onRangeChange(id, value) { 
    console.log(id, value);
    const attrMin = "min_"+id;   
    const attrMax = "max_"+id;   
    var newState = {};
    newState[attrMin] = value[0];
    newState[attrMax] = value[1];
    this.setState(newState);        
  }

  /* FUNCTION: Change state of song attributes when user moves any input slider */
  onSliderChange(id, value) {    
    const attr = "target_"+id;   
    var newState = {}
    newState[attr] = value
    this.setState(newState);    
  }

  // Display the proper note for key attribute
  convertKey(note){
    const pitchNotation = {
       0: 'C',
       1: 'C# / D\u266D',
       2: 'D',
       3: 'D# / E\u266D',
       4: 'E',
       5: 'F',
       6: 'F# / G\u266D',
       7: 'G',
       8: 'G# / A\u266D',
       9: 'A',
       10: 'A# / B\u266D',
       11: 'B',
    };
    return pitchNotation[note];
 }

  // Display the proper time for duration attribute
  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  render() {

    const styles = {
      viewStyle: {     
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginTop: 20,
        marginBottom: 20
      },
      btnStyle: {
        color: '#ffffff',      
        fontSize: 20
      },
      containerStyle: {
        backgroundColor: '#dddddd', 
        padding: 10, 
        alignItems: 'center',
        justifyContent: 'center' 
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.containerStyle}>
        
        <Text>Playlist Search Page</Text>
        
        {/* DURATION */}
        <View style={ styles.viewStyle }>

          <Text>Duration</Text>

          <MultiSlider
            className="duration"
            values={ [this.state.min_duration, this.state.max_duration] }
            sliderLength={ this.state.sliderLength }
            min={ 60000 }
            max={ 1800000 }
            step={ 5000 } 
            onValuesChange={ event => this.onRangeChange("duration", event) } 
            allowOverlap />

          <Text>{ this.millisToMinutesAndSeconds(this.state.min_duration) } to { this.millisToMinutesAndSeconds(this.state.max_duration) } </Text>
      
        </View>

        {/* ACOUSTICNESS */}
        <View style={ styles.viewStyle }>

          <Text>Acousticness</Text>

          <MultiSlider
            className="acousticness"
            values={ [this.state.min_acousticness, this.state.max_acousticness] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("acousticness", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_acousticness * 100) } to { Math.floor(this.state.max_acousticness * 100) }</Text>
      
        </View>

        {/* DANCEABILITY */}
        <View style={ styles.viewStyle }>

          <Text>Danceability</Text>

          <MultiSlider
            className="danceability"
            values={ [this.state.min_danceability, this.state.max_danceability] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("danceability", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_danceability * 100) } to { Math.floor(this.state.max_danceability * 100) }</Text>
      
        </View>

        {/* ENERGY */}
        <View style={ styles.viewStyle }>

          <Text>Energy</Text>

          <MultiSlider
            className="energy"
            values={ [this.state.min_energy, this.state.max_energy] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("energy", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_energy * 100) } to { Math.floor(this.state.max_energy * 100) }</Text>
      
        </View>

        {/* INSTRUMENTALNESS */}
        <View style={ styles.viewStyle }>

          <Text>Instrumentalness</Text>

          <MultiSlider
            className="instrumentalness"
            values={ [this.state.min_instrumentalness, this.state.max_instrumentalness] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("instrumentalness", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_instrumentalness * 100) } to { Math.floor(this.state.max_instrumentalness * 100) }</Text>
      
        </View>

        {/* LIVENESS */}
        <View style={ styles.viewStyle }>

          <Text>Liveness</Text>

          <MultiSlider
            className="liveness"
            values={ [this.state.min_liveness, this.state.max_liveness] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("liveness", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_liveness * 100) } to { Math.floor(this.state.max_liveness * 100) }</Text>
      
        </View>

        {/* LOUDNESS */}
        <View style={ styles.viewStyle }>

          <Text>Loudness</Text>

          <MultiSlider
            className="loudness"
            values={ [this.state.min_loudness, this.state.max_loudness] }
            sliderLength={ this.state.sliderLength }
            min={ -60.0 }
            max={ 0.0 }
            step={ 0.5 } 
            onValuesChange={ event => this.onRangeChange("loudness", event) } 
            allowOverlap />

          <Text>{ this.state.min_loudness } to { this.state.max_loudness } dB</Text>
      
        </View>

        {/* POPULARITY */}
        <View style={ styles.viewStyle }>

          <Text>Popularity</Text>

          <MultiSlider
            className="popularity"
            values={ [this.state.min_popularity, this.state.max_popularity] }
            sliderLength={ this.state.sliderLength }
            min={ 0 }
            max={ 100 }
            step={ 1 } 
            onValuesChange={ event => this.onRangeChange("popularity", event) } 
            allowOverlap />

          <Text>{ this.state.min_popularity } to { this.state.max_popularity }</Text>
      
        </View>

        {/* SPEECHINESS */}
        <View style={ styles.viewStyle }>

          <Text>Speechiness</Text>

          <MultiSlider
            className="speechiness"
            values={ [this.state.min_speechiness, this.state.max_speechiness] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("speechiness", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_speechiness * 100) } to { Math.floor(this.state.max_speechiness * 100) }</Text>
      
        </View>

        {/* TEMPO */}
        <View style={ styles.viewStyle }>

          <Text>Tempo</Text>

          <MultiSlider
            className="tempo"
            values={ [this.state.min_tempo, this.state.max_tempo] }
            sliderLength={ this.state.sliderLength }
            min={ 40 }
            max={ 300 }
            step={ 1 } 
            onValuesChange={ event => this.onRangeChange("tempo", event) } 
            allowOverlap />

          <Text>{ this.state.min_tempo } to { this.state.max_tempo } bpm</Text>
      
        </View>

        {/* VALENCE */}
        <View style={ styles.viewStyle }>

          <Text>Valence</Text>

          <MultiSlider
            className="valence"
            values={ [this.state.min_valence, this.state.max_valence] }
            sliderLength={ this.state.sliderLength }
            min={ 0.0 }
            max={ 1.0 }
            step={ 0.01 } 
            onValuesChange={ event => this.onRangeChange("valence", event) } 
            allowOverlap />

          <Text>{ Math.floor(this.state.min_valence * 100) } to { Math.floor(this.state.max_valence * 100) }</Text>
      
        </View>

        {/* TIME SIGNATURE */}
        <View style={ styles.viewStyle }>

          <Text>Time Signature</Text>

          <MultiSlider
            className="time_signature"
            values={ [this.state.min_time_signature, this.state.max_time_signature] }
            sliderLength={ this.state.sliderLength }
            min={ 1 }
            max={ 13 }
            step={ 1 } 
            onValuesChange={ event => this.onRangeChange("time_signature", event) } 
            allowOverlap />

          <Text>{ this.state.min_time_signature } to { this.state.max_time_signature } beats per measure</Text>
      
        </View>

        {/* KEY */}
        <View style={ styles.viewStyle }>

          <Text>Key</Text>

          <Slider
            className="key"
            value={ this.state.target_key }
            style={{ width: this.state.sliderLength }}         
            minimumValue={ 0 }
            maximumValue={ 11 }
            step={ 1 } 
            onValueChange={ event => this.onSliderChange("key", event) } />

          <Text>{ this.convertKey(this.state.target_key) }</Text>
      
        </View>

        {/* MODE */}
        <View style={ styles.viewStyle }>

          <Text>Mode</Text>

          <Slider
            className="mode"
            value={ this.state.target_mode }
            style={{ width: this.state.sliderLength }}
            min={ 0 }
            max={ 1 }
            step={ 1 } 
            onValueChange={ event => this.onSliderChange("mode", event) } />

          { this.state.target_mode === 0 ? <Text>Minor</Text> : <Text>Major</Text> }
      
        </View>

      </ScrollView>
    );
  }
}