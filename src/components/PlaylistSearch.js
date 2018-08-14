import React, { Component } from 'react';
import { 
  ScrollView, 
  Slider, 
  Image, 
  View, 
  Text, 
  TextInput,
  TouchableHighlight,
TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import  Modal from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
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

     //FIX!!  COULD BE BETTER!!
   /* FUNCTION(): Change state of song attributes when user moves any input slider */
   onSelectedItemsChange(genres) { 
    console.log("CHOSEN GENRES: ", genres);  
    this.setState({ chosen_genres: genres });        
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

   /* FUNCTION(): Show modal with more information about each attribute */
   togglePopover(id) {
    var popoverState = id+"PopoverOpen";
    console.log(popoverState);
    console.log(this.state[popoverState]);     
    var newState = {}
    newState[popoverState] = !this.state[popoverState];
    console.log(newState);  
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
      
      /** VIEW CONTAINERS **/
      containerStyle: {
        backgroundColor: '#222222', 
        justifyContent: 'center',
      },
      requiredAlert: {
        backgroundColor: '#1ed760', 
        padding: 10,
        paddingBottom: 5
      },
      requiredOptions: {
        backgroundColor: '#222222', 
        paddingLeft: 20,            
        paddingRight: 20, 
        paddingBottom: 20           
      },
      inputView: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#aaaaaa',       
      },
      viewStyleLight: {  
        backgroundColor: '#555555',   
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 20,
        paddingBottom: 10
      },
      viewStyleDark: {    
        backgroundColor: '#222222', 
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 20,
        paddingBottom: 10
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalContainer: {
        flex: 1,
      },

      /** HEADERS AND TEXT **/
      title: {
        color: '#1ed760',
        fontSize: 25,
        textAlign: 'center',
        margin: 10
      },
      header: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center'
      },
      subheader: {
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
        paddingTop: 10,

      },
      subheader2: {
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
        paddingBottom: 10
      },
      inputs: {
        paddingTop: 0,
        paddingBottom: 5,
        color: '#aaaaaa',
        fontSize: 16,
      },

      /** BUTTONS **/
      button: {
        color: '#ffffff',      
        fontSize: 20
      },
      buttonContainer: { 
        marginBottom: 5,
        padding: 10, 
        width: 100,
        borderRadius: 20, 
        backgroundColor: '#ff2525',
        justifyContent: 'center'
      }
    };

    const downArrowIcon = (
      <FontAwesome5 name={'angle-down'} color='#ffffff' size={20} solid />
    );

    const helpIcon = (
      <FontAwesome5 
        name={'question-circle'} 
        color='#1ed760' 
        size={14} 
        onClick={ () => this.togglePopover("dur") }/>
    );

    return (
      <ScrollView contentContainerStyle={ styles.containerStyle }>
        
        <Text style={styles.title}>FineTune Search</Text>

        <View style={ styles.requiredAlert }>
          <Text style={styles.header}>Required**</Text>
          <Text style={styles.subheader2}>You must search by EITHER genre, OR artist OR album.  Please choose ONE.</Text>
        </View>

        {/* REQUIRED OPTIONS
        *   A user is required to choose either a set of genres OR an artist
        *   OR an album to conduct their search.  If more than one option is 
        *   used, then the search will use the first option.  This means GENRE
        *   receives highest search priority, followed by ARTIST, and then ALBUM       
        */}
        <View style={ styles.requiredOptions }>
        
          {/* SEARCH BY GENRE */}
          <View style={ styles.inputView }>
            <Text style={ styles.header }>Search by Genre</Text>
            <SectionedMultiSelect
              items={ allGenres } 
              uniqueKey='name'
              selectText="Select up to 5 genres"
              loadingComponent={ <Text>Sorry, no results</Text> }
              onSelectedItemsChange={ (event) => this.onSelectedItemsChange(event) }
              selectedItems={ this.state.chosen_genres }
              alwaysShowSelectText={ true }
              showDropDowns={ true }
              showCancelButton={ true }
              styles={{
                container: {
                  flexGrow: 1,
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  
                },
                selectToggle: {
                  paddingBottom: 10,
                  paddingLeft: 5
                }
              }}
              colors={{
                primary: '#1ed760',
                cancel: '#ff2525',
                text: '#333333',
                selectToggleTextColor: '#aaaaaa'
              }}
            />
          </View>

          {/* SEARCH BY ARTIST */}
          <View style={styles.inputView}>
          <Text style={styles.header}>Search by Artist</Text>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid='transparent'
              placeholder="Enter an artist"
              placeholderTextColor="#aaaaaa"
              autoCorrect={false}
              onChangeText={(text) => this.setState({text})}
            />
          </View>
          
          {/* SEARCH BY ALBUM */}
          <View style={styles.inputView}>
          <Text style={styles.header}>Search by Album</Text>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid='transparent'
              placeholder="Enter an album"
              placeholderTextColor="#aaaaaa"
              autoCorrect={false}
              onChangeText={(text) => this.setState({text})}
            />
          </View>

          <View style={{ paddingTop: 20}}>
            <Text style={styles.subheader}>Scroll down to fine tune your search</Text>
            <Text style={styles.subheader2}>OR</Text>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              style={ styles.button }
              containerStyle={ styles.buttonContainer } >
              Submit
            </Button>
            {downArrowIcon}
          </View>
                 
        </View>

        <View style={ styles.requiredAlert }>
          <Text style={styles.header}>Optional**</Text>
          <Text style={styles.subheader2}>Modify any of the following criteria based on your specific needs.
            Or just explore the many possibilities!</Text>
        </View>

        {/* OPTIONAL SEARCH CRITERIA
        *   A user can use the multisliders to fine tune search criteria
        *   If the multisliders are not moved (at max and min), they are not 
        *   included in the search when submitted.  One point sliders must be
        *   enabled using the corresponding checkbox in order to be used 
        *   in the search.       
        */}
        <View style={ styles.optionalOptions }>
        
          {/* DURATION */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>
              Duration 
              <FontAwesome5 
                name={'question-circle'} 
                color='#1ed760' 
                paddingLeft={10}
                size={20} 
                onPress={ () => this.togglePopover("dur") } />
            </Text> 

            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.durPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'}
                onRequestClose={() => {
                  alert('Modal has been closed.');
                }}>
                <View style={styles.modalContent}>

                    <View>
                      <Text>Duration</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("dur");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          paddingLeft={10}
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("dur") } />
                      </TouchableHighlight>
                    </View>
                    
                    <View>
                      <Text>The length of the track</Text>
                    </View>

                    
                  
                </View>
              </Modal>
            </View>

            <MultiSlider
              className="duration"
              values={ [this.state.min_duration, this.state.max_duration] }
              sliderLength={ this.state.sliderLength }
              min={ 60000 }
              max={ 1800000 }
              step={ 5000 } 
              onValuesChange={ event => this.onRangeChange("duration", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ this.millisToMinutesAndSeconds(this.state.min_duration) } to { this.millisToMinutesAndSeconds(this.state.max_duration) } </Text>
        
          </View>

          {/* ACOUSTICNESS */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Acousticness { helpIcon }</Text>

            <MultiSlider
              className="acousticness"
              values={ [this.state.min_acousticness, this.state.max_acousticness] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("acousticness", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_acousticness * 100) } to { Math.floor(this.state.max_acousticness * 100) }</Text>
        
          </View>

          {/* DANCEABILITY */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Danceability { helpIcon }</Text>

            <MultiSlider
              className="danceability"
              values={ [this.state.min_danceability, this.state.max_danceability] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("danceability", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_danceability * 100) } to { Math.floor(this.state.max_danceability * 100) }</Text>
        
          </View>

          {/* ENERGY */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Energy { helpIcon }</Text>

            <MultiSlider
              className="energy"
              values={ [this.state.min_energy, this.state.max_energy] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("energy", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_energy * 100) } to { Math.floor(this.state.max_energy * 100) }</Text>
        
          </View>

          {/* INSTRUMENTALNESS */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Instrumentalness { helpIcon }</Text>

            <MultiSlider
              className="instrumentalness"
              values={ [this.state.min_instrumentalness, this.state.max_instrumentalness] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("instrumentalness", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_instrumentalness * 100) } to { Math.floor(this.state.max_instrumentalness * 100) }</Text>
        
          </View>

          {/* LIVENESS */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Liveness { helpIcon }</Text>

            <MultiSlider
              className="liveness"
              values={ [this.state.min_liveness, this.state.max_liveness] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("liveness", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_liveness * 100) } to { Math.floor(this.state.max_liveness * 100) }</Text>
        
          </View>

          {/* LOUDNESS */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Loudness { helpIcon }</Text>

            <MultiSlider
              className="loudness"
              values={ [this.state.min_loudness, this.state.max_loudness] }
              sliderLength={ this.state.sliderLength }
              min={ -60.0 }
              max={ 0.0 }
              step={ 0.5 } 
              onValuesChange={ event => this.onRangeChange("loudness", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ this.state.min_loudness } to { this.state.max_loudness } dB</Text>
        
          </View>

          {/* POPULARITY */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Popularity { helpIcon }</Text>

            <MultiSlider
              className="popularity"
              values={ [this.state.min_popularity, this.state.max_popularity] }
              sliderLength={ this.state.sliderLength }
              min={ 0 }
              max={ 100 }
              step={ 1 } 
              onValuesChange={ event => this.onRangeChange("popularity", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ this.state.min_popularity } to { this.state.max_popularity }</Text>
        
          </View>

          {/* SPEECHINESS */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Speechiness { helpIcon }</Text>

            <MultiSlider
              className="speechiness"
              values={ [this.state.min_speechiness, this.state.max_speechiness] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("speechiness", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_speechiness * 100) } to { Math.floor(this.state.max_speechiness * 100) }</Text>
        
          </View>

          {/* TEMPO */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Tempo { helpIcon }</Text>

            <MultiSlider
              className="tempo"
              values={ [this.state.min_tempo, this.state.max_tempo] }
              sliderLength={ this.state.sliderLength }
              min={ 40 }
              max={ 300 }
              step={ 1 } 
              onValuesChange={ event => this.onRangeChange("tempo", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ this.state.min_tempo } to { this.state.max_tempo } bpm</Text>
        
          </View>

          {/* VALENCE */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Valence { helpIcon }</Text>

            <MultiSlider
              className="valence"
              values={ [this.state.min_valence, this.state.max_valence] }
              sliderLength={ this.state.sliderLength }
              min={ 0.0 }
              max={ 1.0 }
              step={ 0.01 } 
              onValuesChange={ event => this.onRangeChange("valence", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ Math.floor(this.state.min_valence * 100) } to { Math.floor(this.state.max_valence * 100) }</Text>
        
          </View>

          {/* TIME SIGNATURE */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Time Signature { helpIcon }</Text>

            <MultiSlider
              className="time_signature"
              values={ [this.state.min_time_signature, this.state.max_time_signature] }
              sliderLength={ this.state.sliderLength }
              min={ 1 }
              max={ 13 }
              step={ 1 } 
              onValuesChange={ event => this.onRangeChange("time_signature", event) } 
              allowOverlap />

            <Text style={styles.subheader2}>{ this.state.min_time_signature } to { this.state.max_time_signature } beats per measure</Text>
        
          </View>

          {/* KEY */}
          <View style={ styles.viewStyleLight }>

            <Text style={styles.header}>Key { helpIcon }</Text>

            <Slider
              className="key"
              value={ this.state.target_key }
              style={{ width: this.state.sliderLength }}         
              minimumValue={ 0 }
              maximumValue={ 11 }
              step={ 1 } 
              onValueChange={ event => this.onSliderChange("key", event) } />

            <Text style={styles.subheader2}>{ this.convertKey(this.state.target_key) }</Text>
        
          </View>

          {/* MODE */}
          <View style={ styles.viewStyleDark }>

            <Text style={styles.header}>Mode { helpIcon }</Text>

            <Slider
              className="mode"
              value={ this.state.target_mode }
              style={{ width: this.state.sliderLength }}
              min={ 0 }
              max={ 1 }
              step={ 1 } 
              onValueChange={ event => this.onSliderChange("mode", event) } />

            { this.state.target_mode === 0 ? <Text style={styles.subheader2}>Minor</Text> : <Text style={styles.subheader2}>Major</Text> }
        
          </View>

        </View>

      </ScrollView>
    );
  }
}