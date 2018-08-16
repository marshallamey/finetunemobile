import React, { Component } from 'react';
import { View } from 'react-native';

export default ChartComponent => (
  class ResponsiveChart extends Component {
    constructor(props) {
      super(props)

      this.state = {
        containerWidth: null,
      }

      this.fitParentContainer = this.fitParentContainer.bind(this)
    }

    componentDidMount() {
      this.fitParentContainer()
      window.addEventListener('resize', this.fitParentContainer)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.fitParentContainer)
    }

    fitParentContainer() {
      const { containerWidth } = this.state
      const currentContainerWidth = this.chartContainer
        .getBoundingClientRect().width

      const shouldResize = containerWidth !== currentContainerWidth

      if (shouldResize) {
        this.setState({
          containerWidth: currentContainerWidth,
        })
      }
    }

    renderChart() {
      const parentWidth = this.state.containerWidth

      return (
        <ChartComponent {...this.props} parentWidth={parentWidth} />
      )
    }

    render() {
      const { containerWidth } = this.state
      const shouldRenderChart = containerWidth !== null

      return (
        <View
         
          className="Responsive-wrapper"
        >
          {shouldRenderChart && this.renderChart()}
        </View>
      )
    }
  }
)