export default featuresDesc = {
  none: {
    name: '',
    desc: ''
  },
  dur: {
    name: 'Duration',
    desc: 'The length of the track'
  },
  ac: {
    name: 'Acousticness',
    desc: 'A confidence measure from 0 to 100 of whether the track is '
      + 'acoustic. 100 represents high confidence the track is acoustic.'
  },
  dnc: {
    name: 'Danceability',
    desc: 'Danceability describes how suitable a track is for dancing based '
      + 'on a combination of musical elements including tempo, rhythm stability, '
      + 'beat strength, and overall regularity. A value of 0 is least danceable '
      + 'and 100 is most danceable.'
  },
  en: {
    name: 'Energy',
    desc: 'Energy is a measure from 0 to 100 and represents a perceptual '
      + 'measure of intensity and activity. Typically, energetic tracks '
      + 'feel fast, loud, and noisy. For example, death metal has high '
      + 'energy, while a Bach prelude scores low on the scale. Perceptual '
      + 'features contributing to this attribute include dynamic range, '
      + 'perceived loudness, timbre, onset rate, and general entropy.'
  },
  inst: {
    name: 'Instrumentalness',
    desc: 'Predicts whether a track contains no vocals. “Ooh” and “aah” '
      + 'sounds are treated as instrumental in this context. Rap or spoken '
      + 'word tracks are clearly “vocal”. The closer the instrumentalness '
      + 'value is to 100, the greater likelihood the track contains no '
      + 'vocal content. Values above 50 are intended to represent instrumental '
      + 'tracks, but confidence is higher as the value approaches 100. '
  },
  live: {
    name: 'Liveness',
    desc: 'Detects the presence of an audience in the recording. Higher '
      + 'liveness values represent an increased probability that the track '
      + 'was performed live. A value above 80 provides strong likelihood '
      + 'that the track is live.'
  },
  loud: {
    name: 'Loudness',
    desc: 'The overall loudness of a track in decibels (dB). Loudness values '
      + 'are averaged across the entire track and are useful for comparing '
      + 'relative loudness of tracks. Loudness is the quality of a sound that '
      + 'is the primary psychological correlate of physical strength '
      + '(amplitude). Values typical range between -60 and 0 db.'
  },
  pop: {
    name: 'Popularity',
    desc: 'The popularity of the track. The value will be between 0 and 100, '
      + 'with 100 being the most popular. The popularity is calculated by '
      + 'algorithm and is based, in the most part, on the total number of '
      + 'plays the track has had and how recent those plays are.'
  },
  sp: {
    name: 'Speechiness',
    desc: 'Speechiness detects the presence of spoken words in a track. '
      + 'The more exclusively speech-like the recording (e.g. talk show, '
      + 'audio book, poetry), the closer to 100 the attribute value. Values '
      + 'above 66 describe tracks that are probably made entirely of spoken '
      + 'words. Values between 33 and 66 describe tracks that may contain '
      + 'both music and speech, either in sections or layered, including such '
      + 'cases as rap music. Values below 33 most likely represent music and '
      + 'other non-speech-like tracks.'
  },
  temp: {
    name: 'Tempo',
    desc: 'The overall estimated tempo of a track in beats per minute (BPM). '
      + 'In musical terminology, tempo is the speed or pace of a given ' 
      + 'piece and derives directly from the average beat duration.'
  },
  val: {
    name: 'Valence',
    desc: ' A measure from 0 to 100 describing the musical positiveness ' 
      + 'conveyed by a track. Tracks with high valence sound more positive ' 
      + '(e.g. happy, cheerful, euphoric), while tracks with low valence sound '
      + 'more negative (e.g. sad, depressed, angry).'
  },
  sig: {
    name: 'Time Signature',
    desc: 'An estimated overall time signature of a track. The time signature '
      + '(meter) is a notational convention to specify how many beats '
      + 'are in each bar (or measure).'
  },
  key: {
    name: 'Key',
    desc: 'The key the track is in.  By default, this option is disabled.' 
      + 'Use the checkbox to choose a key.'
  },
  mode: {
    name: 'Mode',
    desc: 'Mode indicates the modality (major or minor) of a track, the type of '
      + 'scale from which its melodic content is derived. '
      + 'By default, this option is disabled. Use the checkbox to choose a mode.'
  }
}