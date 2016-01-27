import React from 'react';
import d3 from 'd3';
require('../../assets/style/component/growthchart.css');

import { arctic_scroll } from '../../assets/utils/scrolling';

//Helper Functions
function poisson(lambda){
  //Generate random poisson variable
  var n = 0,
      l = Math.exp(-lambda),
      p = 1;
  while(p > l){
    n++;
    p *= Math.random();
  }
  return n-1;
};

export default class GrowthChart extends React.Component{
  componentDidMount(){
    const m = {top: 50, right: 50, bottom: 50, left: 50};
    const w = this.chart.offsetWidth - m.left - m.right;
    const h = this.chart.offsetHeight - m.top - m.bottom;

    //Scales
    let xScale = d3.time.scale().range([0, w])
      , yScale = d3.scale.linear().range([h, 0])
      , xAxis = d3.svg.axis().orient('bottom')
      , yAxis = d3.svg.axis().orient('left');

    const duration = 1000;
    const limit = 60;
    const colors = ['#2D292C', '#474246', '#625B61', '#7D737B'];

    //Generate data
    const lambdas = [2.2, 4.3, 1.3, 6.2];
    let data = lambdas.map(lambda => {
      let lineData = d3.range(limit).map(() => poisson(lambda));
      return {data: lineData};
    });

    let svg = d3.select('#growth').append('svg')
                .attr('width', w + m.left + m.right)
                .attr('height', h + m.top + m.bottom)
                .append('g')
                .attr('transform', 'translate(' + [m.left, m.top] + ')');

    //Set scale domains
    let now = new Date(Date.now() - duration);
    xScale.domain([now - (limit - 1) * duration, now - duration]);
    yScale.domain([0, d3.max(data, (lineData) => d3.max(lineData.data))]);
    xAxis.scale(xScale.range([0, w-m.left]));
    yAxis.scale(yScale);

    let line = d3.svg.line()
              .x((d, i) => xScale(now - (limit-1-i)*duration))
              .y(d => yScale(+d))
              .interpolate('cardinal');

    //make clip path
    svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('y', -m.top)
        .attr('width', w - m.left)
        .attr('height', h + m.top + m.bottom);

    //Create axes
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis)

    svg.append('g')
        .call(yAxis)
        .attr('class', 'y axis')

    let paths_clip = svg.append('g')
                        .attr('clip-path', 'url(#clip)');
    let paths = paths_clip.append('g');

    //create lines
    data.map((lineData, i) =>
      lineData.path = paths.append('path')
                            .data([lineData.data])
                            .attr('class', 'line')
                            .style('stroke', colors[i])
    )

    function update(){
      //Add new data and display lines
      data.map((lineData, i) => {
        lineData.data.push(poisson(lambdas[i]));
        lineData.path.attr('d', line);
      })

      //Update x-axis
      now = Date.now();
      xScale.domain([now - (limit-1)*duration, now - duration]);
      svg.select('.x.axis')
          .transition().ease('linear').duration(duration)
          .call(xAxis);

      //Update y-axis
      yScale.domain([0, d3.max(data, (c) => d3.max(c.data))]);
      svg.select('.y.axis')
          .transition().ease('linear').duration(duration)
          .call(yAxis);

      //Update line
      paths.attr('transform', '')
            .transition().ease('linear').duration(duration)
            .attr('transform', 'translate(' + xScale(now - limit * duration) + ')')
            .each('end', update);

      data.map(lineData => lineData.data.shift());
    }

    update();
  }
  render(){
    return (
      <div id="growth" ref={ref => this.chart = ref}>
        <div className="growth-title--container">
          <h2 className="growth-title">Data Streaming</h2>
          <a className='growth--button button'
                  href="#voronoi"
                  onClick={arctic_scroll}>Next</a>
        </div>
      </div>
    )
  }
}
