import React, { Component } from 'react';
import { 
  ScrollView, 
  Slider, 
  View, 
  Text, 
  TouchableHighlight } from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import { CheckBox, Icon } from 'react-native-elements'
import Button from 'react-native-button';
import  Modal from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SearchByGenre from '../components/SearchByGenre';
import SearchByArtist from '../components/SearchByArtist';
import SearchByAlbum from '../components/SearchByAlbum';
import HelpModal from '../components/HelpModal';



export default class PlaylistSearch extends Component {

  constructor(props) {
    super(props);
    //console.log("GENRES AS OBJECTS: ", genres);
    
    this.state = {
       spotify_genres: this.props.navigation.state.params.allGenres,
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
       target_mode: 1,
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
   
       sliderLength: 280,
       keyDisabled: true,
       modeDisabled: true,

      isModalVisible: false,
      feature: 'none'
    };
    
    this.toggleHelpModal = this.toggleHelpModal.bind(this);
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
  }
  
   /* FUNCTION(): Change state of chosen genres */
   onSelectedItemsChange(genres) { 
    console.log("CHOSEN GENRES: ", genres);
    if(genres.length <= 5) {  
      this.setState({ chosen_genres: genres });   
    }     
 }

  /* FUNCTION: Change state of song attributes when user moves any MultiSlider */
    onRangeChange(id, value) { 
    console.log(id, value);
    const attrMin = "min_"+id;   
    const attrMax = "max_"+id;   
    var newState = {};
    newState[attrMin] = value[0];
    newState[attrMax] = value[1];
    this.setState(newState);        
  }

  /* FUNCTION: Change state of song attributes when user moves any Slider */
  onSliderChange(id, value) {    
    const attr = "target_"+id;   
    var newState = {}
    newState[attr] = value
    this.setState(newState);    
  }

  /** FUNCTION(): Toggle a Slider for use **/
  toggleAttr(id) {
    const disabledState = id+'Disabled'
    let newState = {}
    newState[disabledState] = !this.state[disabledState]
    this.setState(newState)
 }

  /* FUNCTION(): Show Modal with more information about an attribute */
  toggleHelpModal(id) { 
    console.log("IS modal visible?  ", this.state.isModalVisible);
    
    this.setState({ isModalVisible: !this.state.isModalVisible, feature: id });
  }

  /* FUNCTION(): Display the proper note for key attribute */
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

  /* FUNCTION(): Display the proper time for duration attribute */
  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  /* FUNCTION(): Send request to Spotify API once form is submitted */
  handleSubmit() { 
    console.log("CHOSEN GENRES: ", this.state.chosen_genres);

    //Make sure genres are lower case before submitting
    const genres = this.state.chosen_genres.map(genre => {
      return genre.toLowerCase();
    })

    // Add selected properties to Spotify API request
    let searchProps = { seed_genres: genres }

    if(this.state.min_acousticness !== 0.0 || this.state.max_acousticness !== 1.0) {
        searchProps.min_acousticness = this.state.min_acousticness;
        searchProps.max_acousticness = this.state.max_acousticness;
    }
    if(this.state.min_danceability !== 0.0 || this.state.max_danceability !== 1.0) {
        searchProps.min_danceability = this.state.min_danceability;
        searchProps.max_danceability = this.state.max_danceability;
    }
    if(this.state.min_energy !== 0.0 || this.state.max_energy !== 1.0) {
        searchProps.min_energy = this.state.min_energy;
        searchProps.max_energy = this.state.max_energy;
    }
    if(this.state.min_instrumentalness !== 0.0 || this.state.max_instrumentalness !== 1.0) {
        searchProps.min_instrumentalness = this.state.min_instrumentalness;
        searchProps.max_instrumentalness = this.state.max_instrumentalness;
    }
    if(this.state.min_liveness !== 0.0 || this.state.max_liveness !== 1.0) {
        searchProps.min_liveness = this.state.min_liveness;
        searchProps.max_liveness = this.state.max_liveness;
    }
    if(this.state.min_loudness !== -60 || this.state.max_loudness !== 0) {
        searchProps.min_loudness = this.state.min_loudness;
        searchProps.max_loudness = this.state.max_loudness;
    }
    if(this.state.min_popularity !== 0 || this.state.max_popularity !== 100) {
        searchProps.min_popularity = this.state.min_popularity;
        searchProps.max_popularity = this.state.max_popularity;
    }
    if(this.state.min_speechiness !== 0.0 || this.state.max_speechiness !== 1.0) {
        searchProps.min_speechiness = this.state.min_speechiness;
        searchProps.max_speechiness = this.state.max_speechiness;
    }
    if(this.state.min_tempo !== 40 || this.state.max_tempo !== 300) {
        searchProps.min_tempo = this.state.min_tempo;
        searchProps.max_tempo = this.state.max_tempo;
    }
    if(this.state.min_valence !== 0.0 || this.state.max_valence !== 1.0) {
        searchProps.min_valence = this.state.min_valence;
        searchProps.max_valence = this.state.max_valence;
    }
    if(this.state.min_duration !== 60000 || this.state.max_duration !== 1800000) {
        searchProps.min_duration = this.state.min_duration;
        searchProps.max_duration = this.state.max_duration;
    }
    if(this.state.min_time_signature !== 1 || this.state.max_time_signature !== 13) {
      searchProps.min_time_signature = this.state.min_time_signature;
      searchProps.max_time_signature = this.state.max_time_signature;
    }
    if(!this.state.modeDisabled) searchProps.target_mode = this.state.target_mode;
    if(!this.state.keyDisabled) searchProps.target_key = this.state.target_key;

    console.log("(2) SENDING THESE SEARCH PROPS ==> ", searchProps);      
    this.props.navigation.state.params.onSearchFormSubmit(searchProps);
  }

  /** Header Config */
  static navigationOptions = {
    title: 'FineTune Search',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    headerRight: (<View></View>)
  };

  render() {
    console.log("RENDERING PLAYLISTSEARCH"); 
    console.log("Have results?  ",this.props.navigation.state.params.haveResults);

   

    return (
      <ScrollView contentContainerStyle={ styles.containerStyle }>

        {/* REQUIRED OPTIONS
        *   A user is required to choose either a set of genres OR an artist
        *   OR an album to conduct their search.  If more than one option is 
        *   used, then the search will use the first option.  This means GENRE
        *   receives highest search priority, followed by ARTIST, and then ALBUM       
        */}
        <View style={ styles.requiredOptions }>
        
          {/* SEARCH BY OPTIONS */}
          <SearchByGenre 
            spotify_genres={this.state.spotify_genres}
            chosen_genres={this.state.chosen_genres}
            onSelectedItemsChange={this.onSelectedItemsChange} />
          {/* <SearchByArtist />
          <SearchByAlbum /> */}

          {/* SUBMIT BUTTON TOP */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
            style={ styles.button }
            containerStyle={ styles.buttonContainer } 
            onPress={ () => this.handleSubmit() } >
              Submit
            </Button>
            
          </View>

          <View style={{ paddingTop: 5}}>
            <Text style={styles.subheader3}>OR</Text>
            <Text style={ styles.header }>Step 2: Fine Tune Your Search</Text>
          </View>

        </View>

        {/* OPTIONAL SEARCH CRITERIA
        *   A user can use the multisliders to fine tune search criteria
        *   If the multisliders are not moved (at max and min), they are not 
        *   included in the search when submitted.  One point sliders must be
        *   enabled using the corresponding checkbox in order to be used 
        *   in the search.       
        */}
        <View style={ styles.optionalOptions }>

          <HelpModal 
            toggleHelpModal={ this.toggleHelpModal } 
            isModalVisible={this.state.isModalVisible}
            feature={this.state.feature}
          />
          
          {/* DURATION */}
          <View style={ styles.viewStyleLight }>

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Duration  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("dur"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize} 
                  onPress={ () => this.toggleHelpModal("dur") } />
              </TouchableHighlight>
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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Acousticness  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("ac"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("ac") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Danceability  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("dnc"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("dnc") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Energy  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("en"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("en") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}> Instrumentalness  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("inst"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("inst") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Liveness  </Text> 
              <TouchableHighlight
                
                onPress={() => { this.toggleHelpModal("live"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("live") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Loudness  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("loud"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("loud") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Popularity  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("pop"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("pop") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Speechiness  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("sp"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("sp") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Tempo  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("temp"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("temp") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Valence  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("val"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("val") } />
              </TouchableHighlight>
            </View>

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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Time Signature  </Text> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("sig"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("sig") } />
              </TouchableHighlight>
            </View>

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

            {/* Header, Disable CheckBox and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                title='Key'
                checked={!this.state.keyDisabled}
                checkedColor='#1ed760'
                onPress={ () => this.toggleAttr("key") }
                containerStyle={{backgroundColor: 'transparent', borderWidth: 0, padding: 0, marginRight: 0}}
                textStyle={styles.header}
      
              />
              
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("key"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("key") } />
              </TouchableHighlight>
            </View>

            <Slider
              className="key"
              value={ this.state.target_key }
              disabled={ this.state.keyDisabled }
              style={{ width: this.state.sliderLength }}         
              minimumValue={ 0 }
              maximumValue={ 11 }
              step={ 1 } 
              onValueChange={ event => this.onSliderChange("key", event) } />

            <Text style={styles.subheader2}>{ this.convertKey(this.state.target_key) }</Text>
        
          </View>

          {/* MODE */}
          <View style={ styles.viewStyleDark }>

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
                title='Mode'
                checked={!this.state.modeDisabled}
                checkedColor='#1ed760'
                onPress={ () => this.toggleAttr("mode") }
                containerStyle={{backgroundColor: 'transparent', borderWidth: 0, padding: 0, marginRight: 0}}
                textStyle={styles.header}
      
              /> 
              <TouchableHighlight
                onPress={() => { this.toggleHelpModal("mode"); }} >
                <Icon 
                  name='help-outline' 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.toggleHelpModal("mode") } />
              </TouchableHighlight>
            </View>

            <Slider
              className="mode"
              value={ this.state.target_mode }
              disabled={ this.state.modeDisabled }
              style={{ width: this.state.sliderLength }}
              min={ 0 }
              max={ 1 }
              step={ 1 } 
              onValueChange={ event => this.onSliderChange("mode", event) } />

            { this.state.target_mode === 0 ? <Text style={styles.subheader2}>Minor</Text> : <Text style={styles.subheader2}>Major</Text> }
        
          </View>

          {/* SUBMIT BUTTON BOTTOM */}
          <View style={ styles.viewStyleLight }>
            <Button
              style={ styles.button }
              containerStyle={ styles.buttonContainer } 
              onPress={ () => this.handleSubmit() }
            >
              Submit
            </Button>
          </View>

        </View>

      </ScrollView>
    );
  }
}

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
    paddingBottom: 10           
  },
  inputView: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa',       
  },
  viewStyleLight: {  
    backgroundColor: '#333333',   
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
  

  /** HEADERS AND TEXT **/
  title: {
    color: '#1ed760',
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  },
  header: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  subheader: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 10,

  },
  subheader2: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 10
  },
  subheader3: {
    color: '#1ed760',
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 10
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
  },
  iconSize: 16
};
