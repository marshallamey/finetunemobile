import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'
import Svg from 'react-native-svg';
import Axes from './Axes'
import Bars from './Bars'



class Chart extends Component {

   constructor() {
      super()
      this.xScale = scaleBand()
      this.yScale = scaleLinear()
   }

   render() {

      var data = [
         { feature: 'Acousticness', value: this.props.features.acousticness * 100 },
         { feature: 'Danceability', value: this.props.features.danceability * 100 },
         { feature: 'Energy', value: this.props.features.energy * 100 },
         { feature: 'Instrumentalness', value: this.props.features.instrumentalness * 100 },
         { feature: 'Speechiness', value: this.props.features.speechiness * 100 },
         { feature: 'Liveness', value: this.props.features.liveness * 100 },
         { feature: 'Valence', value: this.props.features.valence * 100 },
         { feature: 'Popularity', value: this.props.song.popularity } ]
      
      const margins = { top: 5, right: 5, bottom: 85, left: 33 };

      const svgDimensions = {
         width: Math.max(this.props.parentWidth, 230),
         height: Math.min(this.props.parentWidth, 380)
      }

      const maxValue = 100;
      
      // scaleBand type
      const xScale = this.xScale
         .padding(0.5)
         // scaleBand domain should be an array of specific values
         // in our case, we want to use movie titles
         .domain(data.map(d => d.feature))
         .range([margins.left, svgDimensions.width - margins.right])
   
      // scaleLinear type
      const yScale = this.yScale
         // scaleLinear domain required at least two values, min and max       
         .domain([0, maxValue])
         .range([svgDimensions.height - margins.bottom, margins.top])

      return (
         <Svg width={svgDimensions.width} height={svgDimensions.height}>
            <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            svgDimensions={svgDimensions}
         />
            <Bars
            scales={{ xScale, yScale }}
            margins={margins}
            data={data}
            maxValue={maxValue}
            svgDimensions={svgDimensions}
         />
         </Svg>
      )
   }
}

export default Chart;