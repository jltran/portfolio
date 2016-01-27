import React from 'react';
import Hero from './hero';
import GrowthChart from './growthchart';
import HeatMap from './heatmap';
import Housing from './housing';
import Voronoi from './voronoi';
import HealthCoverage from './healthcoverage';
import Contact from './contact';

import { r, arctic_scroll, currentYPosition, elmYPosition, smooth_scroll } from '../../assets/utils/scrolling';

const wwhite = 'rgb(205,205,203)';
const wblack = 'rgb(16, 14, 19)';

export default class App extends React.Component {
  constructor(props){
    super(props);

    //Default icon color. Share scope with getFillColor
    this.state = {fillColor: '#DDDDDD'};
    this.getFillColor = this.getFillColor.bind(this);
  }

  getFillColor(){
    //Changes color depending on current position
    const curr = currentYPosition();
    const threshold = elmYPosition('growth') - 70; //account for svg size
    if(curr > threshold){
      this.setState({fillColor:'#111111'});
    } else {
      this.setState({fillColor: wwhite})
    }
  }

  componentDidMount(){
    //Add event listener to scroll upon component render
    window.addEventListener('scroll', this.getFillColor);
  }

  componentWillUnmount(){
    //Remove event listenre to scroll upon component render
    window.removeEventListener('scroll', this.getFillColor);
  }

  render() {
    //Renders svg, hero and boxes (note: svg can probably be componentized...)
    return (
      <div>
        <a href='#' className='logo' onClick = {(e) => {e.preventDefault(); smooth_scroll(currentYPosition(), 0)}}>
          <svg width="44" height="32" viewBox="0 0 44 32">
            <path d="M17.736 23.394h-5.397v-1.846h3.551v-13.634h-13.634v13.634h4.9v1.846h-6.746v-17.327h17.327zM26.258 31.134h-17.327v-17.327h5.326v1.775h-3.48v13.705h13.634v-13.705h-4.9v-1.775h6.746z" fill={this.state.fillColor} stroke='none' />
          </svg>
        </a>
        <Hero />
        <HeatMap />
        <Housing />
        <GrowthChart />
        <Voronoi />
        <HealthCoverage />
        <Contact />
      </div>
    );
  }
}
