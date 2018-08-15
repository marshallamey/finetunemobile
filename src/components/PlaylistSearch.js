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
import { CheckBox } from 'react-native-elements'
import Button from 'react-native-button';
import  Modal from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import allGenres from '../js/genres.js';

export default class PlaylistSearch extends Component {
  static navigationOptions = {
    title: 'FineTune Search',
  };

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
   
       keyDisabled: true,
       modeDisabled: true,

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


  
   /* FUNCTION(): Change state of chosen genres */
   onSelectedItemsChange(genres) { 
    console.log("CHOSEN GENRES: ", genres);  
    this.setState({ chosen_genres: genres });        
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
   togglePopover(id) {
    var popoverState = id+"PopoverOpen";
    console.log(popoverState);
    console.log(this.state[popoverState]);     
    var newState = {}
    newState[popoverState] = !this.state[popoverState];
    console.log(newState);  
    this.setState(newState);
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
  handleSubmit(event) {
    event.preventDefault();
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
      modalContent: {
        backgroundColor: 'white',
        padding: 0,
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
        fontSize: 20,
        textAlign: 'center'
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

          <View style={{ paddingTop: 30}}>
            <Text style={styles.subheader3}>Scroll down to fine tune your search</Text>
            <Text style={styles.subheader3}>OR</Text>
          </View>

          {/* SUBMIT BUTTON TOP */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              style={ styles.button }
              containerStyle={ styles.buttonContainer } 
              onPress={ this.handleSubmit }
            >
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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Duration  </Text> 
              <TouchableHighlight
                onPress={() => { this.togglePopover("dur"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize} 
                  onPress={ () => this.togglePopover("dur") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.durPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Duration</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("dur");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("dur") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
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

            {/* Header and Help Icon */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.header}>Acousticness  </Text> 
              <TouchableHighlight
                onPress={() => { this.togglePopover("ac"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("ac") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.acPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Acousticness</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("ac");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("ac") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        A confidence measure from 0 to 100 of whether the track is acoustic. 100 represents high confidence the track is acoustic.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("dnc"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("dnc") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.dncPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Danceability</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("dnc");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("dnc") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 100 is most danceable.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("en"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("en") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.enPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Energy</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("en");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("en") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        Energy is a measure from 0 to 100 and represents a perceptual measure of intensity and activity. 
                        Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a 
                        Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic 
                        range, perceived loudness, timbre, onset rate, and general entropy.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("inst"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("inst") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.instPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Instrumentalness</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("inst");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("inst") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken 
                        word tracks are clearly “vocal”. The closer the instrumentalness value is to 100, the greater likelihood the track contains no 
                        vocal content. Values above 50 are intended to represent instrumental tracks, but confidence is higher as the value approaches 100.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                
                onPress={() => { this.togglePopover("live"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("live") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.livePopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Liveness</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("live");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("live") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        Detects the presence of an audience in the recording. Higher liveness values represent an increased probability 
                        that the track was performed live. A value above 80 provides strong likelihood that the track is live.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("loud"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("loud") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.loudPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Loudness</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("loud");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("loud") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and 
                        are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary 
                        psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("pop"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("pop") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.popPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Popularity</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("pop");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("pop") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        The popularity of the track. The value will be between 0 and 100, with 100 being the most 
                        popular. The popularity is calculated by algorithm and is based, in the most part, on the 
                        total number of plays the track has had and how recent those plays are.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("sp"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("sp") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.spPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Speechiness</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("sp");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("sp") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the 
                        recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value. Values above 
                        66 describe tracks that are probably made entirely of spoken words. Values between 33 and 66 
                        describe tracks that may contain both music and speech, either in sections or layered, including 
                        such cases as rap music. Values below 33 most likely represent music and other non-speech-like tracks.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("temp"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("temp") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.tempPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Tempo</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("temp");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("temp") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, 
                        tempo is the speed or pace of a given piece and derives directly from the average beat duration.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("val"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("val") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.valPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Valence</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("val");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("val") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>
                        A measure from 0 to 100 describing the musical positiveness conveyed by a track. 
                        Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), 
                        while tracks with low valence sound more negative (e.g. sad, depressed, angry).
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("sig"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("sig") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.sigPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Time Signature</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("sig");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("sig") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>An estimated overall time signature of a track. The time signature (meter) is a notational convention 
                      to specify how many beats are in each bar (or measure).</Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("key"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={5}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("key") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.keyPopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Key</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("key");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("key") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>The key the track is in.  By default, this option is disabled. 
                        Use the checkbox to choose a key. </Text>
                    </View> 

                </View>               
              </Modal>
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
                onPress={() => { this.togglePopover("mode"); }} >
                <FontAwesome5 
                  name={'question-circle'} 
                  color='#1ed760' 
                  paddingLeft={20}
                  size={styles.iconSize}  
                  onPress={ () => this.togglePopover("mode") } />
              </TouchableHighlight>
            </View>

            {/* Help Modal */}
            <View style={styles.modalContainer}>
              <Modal
                transparent={true}
                isVisible={this.state.modePopoverOpen}
                backdropColor={'#222222'}
                backdropOpacity={0.8}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'} 
              >
                <View style={styles.modalContent}>
                    
                    {/* Modal Header and Close Icon */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
                      <Text style={{fontSize: 18}}>Mode</Text>
                      <TouchableHighlight
                        onPress={() => {
                          this.togglePopover("mode");
                        }} >
                        <FontAwesome5 
                          name={'times'} 
                          color='#1ed760' 
                          size={20} 
                          solid
                          onPress={ () => this.togglePopover("mode") } />
                      </TouchableHighlight>
                    </View>
                    
                    {/* Modal Body */}
                    <View style={{padding: 20}}>
                      <Text>Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived.
                      By default, this option is disabled. Use the checkbox to choose a mode.
                      </Text>
                    </View> 

                </View>               
              </Modal>
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
              onPress={ this.handleSubmit }
            >
              Submit
            </Button>
          </View>

        </View>

      </ScrollView>
    );
  }
}