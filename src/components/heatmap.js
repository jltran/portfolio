import React from 'react';
import d3 from 'd3';
require('../../assets/style/component/heatmap.css');

import { arctic_scroll } from '../../assets/utils/scrolling';

export default class HeatMap extends React.Component {
  constructor(props){
    super(props);

    //Props in class scope: svg, w, h, xScale, yScale
    this.state = {city:'', saved:['Baltimore', 'Los Angeles', 'Miami', 'Oakland', 'San Antonio'], current: 'Oakland'};
  }
  componentDidMount(){
    const API_KEY = '2855cd5362de799aea270073b20b537b';
    this.ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

    //Chart specs
    const m = { top: 50, right: 0, bottom: 50, left: 60 };
    this.w = this.chart.offsetWidth - m.left - m.right;
    this.h = this.chart.offsetHeight - m.top - m.bottom;

    this.xScale = d3.scale.ordinal().rangeRoundBands([0, this.w * .60], .15, 0);
    this.yScale = d3.scale.ordinal().rangeRoundBands([0, this.h], .15, 0);

    this.svg = d3.select('#heatmap').append('svg')
                .attr('class', 'heatmap--svg')
                .attr('width', this.w + m.left + m.right)
                .attr('height', this.h + m.top + m.bottom)
                .append('g')
                .attr('transform', 'translate(' + [m.left, m.top] + ')');

    this.renderChart(`${this.ROOT_URL}&q=Oakland,us`, this.svg);
  }
  renderChart(url, svg){
    let fontSize = (this.w > 700) ? '24px' : '14px';
    const colors = ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"].reverse();
    const colorScale = d3.scale.quantile().range(colors);

    d3.json(url, (d) => {
      //Save City Name (should probably be moved out)
      const current = d.city.name;
      this.setState({current});
      if(this.state.saved.indexOf(current) < 0){
        let saved = this.state.saved;
        saved.shift();
        saved.push(current);
        this.setState({saved});
      }

      //Clean Data
      let data = d.list.map((d2, i) => {
        let dt = new Date(d2.dt * 1000);
        return {
          id: i,
          date: (dt.getMonth() + 1) + '/' + dt.getDate(),
          hour: dt.getHours(),
          temp: Math.round((d2.main.temp - 273) * 9. / 5 + 32)
        }
      });

      //Define domain
      this.xScale.domain(d3.map(data, (d) => d.hour).keys());
      this.yScale.domain(d3.map(data, (d) => d.date).keys());
      //colorScale.domain(d3.extent(data, (d) => d.temp));
      colorScale.domain([40, 80])

      //Display axes
      var xLabels = svg.selectAll('.xLabels')
                          .data(this.xScale.domain(), (d, i) => i)
                          .enter()
                          .append('text')
                          .attr('class', 'xLabels')
                          .text((d) => (this.w > 700) ? d + ':00' : d)
                          .attr('x', (d) => this.xScale(d))
                          .attr('y', 0)
                          .attr('font-family', 'Arvo')
                          .attr('fill', 'rgb(205,205,203)')
                          .style('text-anchor', 'middle')
                          .attr('transform', 'translate(' + [this.xScale.rangeBand() / 2, this.h + 25] + ')');

      var yLabels = svg.selectAll('.yLabels')
                        .data(this.yScale.domain(), (d, i) => i)
                        .enter()
                        .append('text')
                        .attr('class', 'yLabels')
                        .text(d => d.split('/')[0] + '/' + d.split('/')[1])
                        .attr('x', 0)
                        .attr('y', (d) => this.yScale(d))
                        .attr('font-family', 'Arvo')
                        .attr('fill', 'rgb(205,205,203)')
                        .attr('transform', 'translate(' + [- 50, this.yScale.rangeBand() / 2] + ')');

      var cards = svg.selectAll('.card')
                      .data(data, (d) => d.id);

      cards.enter()
            .append('g')
            .attr('class', 'card');

      cards.append('rect')
              .attr('x', (d) => this.xScale(d.hour))
              .attr('y', (d) => this.yScale(d.date))
              .attr('rx', 4)
              .attr('ry', 4)
              .attr('width', this.xScale.rangeBand())
              .attr('height', this.yScale.rangeBand());
      cards.transition().duration(1000).style('fill', (d) => colorScale(d.temp));

      cards.on('mouseover', function(){
        d3.select(this)
          .attr('stroke', 'rgb(16, 14, 19)')
          .transition().duration(250)
          .attr('stroke-width', '2');
      }).on('mouseout', function(){
        d3.select(this)
          .transition().duration(250)
          .attr('stroke-width', '0');
      })

      cards.append('text')
            .attr('opacity', 0)
            .transition().duration(1500)
            .attr('x', (d) => (this.w > 500) ? this.xScale(d.hour) + this.xScale.rangeBand()/3 : this.xScale(d.hour))
            .attr('y', (d) => this.yScale(d.date) + this.yScale.rangeBand()/1.8)
            .attr('font-family', 'Arvo')
            .attr('font-size', fontSize)
            .attr('fill', 'rgb(16, 14, 19)')
            .attr('opacity', 1)
            .text((d) => d.temp);

      //Clean up
      cards.exit().remove();
      // d3.selectAll('.card-rect')
      //   .data(data, d => d.id).exit().remove();
      // d3.selectAll('.card-text')
      //   .data(data, d => d.id).exit().remove();

    });
  }
  onInputChange(e){
    this.setState({city: e.target.value});
  }
  onFormSubmit(e){
    e.preventDefault();

    if(this.state.city){
      this.updateCity(this.state.city);
    }
  }
  updateCity(current){
    if(current !== this.state.current){
      this.setState({current});

      this.renderChart(`${this.ROOT_URL}&q=${current}`, this.svg);
    }
  }
  render(){
    return (
      <div id='heatmap' ref={ref => this.chart = ref}>
        <div className='heatmap--input'>
          <h5>{this.state.current} Temperature Forecast (F)</h5>
          <form onSubmit={this.onFormSubmit.bind(this)}>
            <label>Enter city here to update:</label>
            <input
              id="searchBar"
              type="text"
              value={this.state.city}
              onChange={this.onInputChange.bind(this)}
              placeholder='Houston'
              ref={ref => this.enteredCity = ref}/>
              <input className="heatmap--form-button" type="submit" value="Submit" />
              <p className="heatmap--disclaimer">We'll try to find the closest match</p>
          </form>
          <label>Or choose on one of these:</label>
          {this.state.saved.map(d => {
            return (
              <button className='city--button'
                      key = {d}
                      onClick={e => this.updateCity(d)}>{d}</button>
            )
          })}
          <a className='button heatmap--next-button'
                  href="#housing"
                  onClick={arctic_scroll}>Next</a>
        </div>
      </div>
    )
  }
}
