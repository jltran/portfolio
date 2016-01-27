import React from 'react';

require('../../assets/style/component/hero.css');
const bg_img = require('../../assets/images/img-W.jpeg')
const inline_css = {
  backgroundImage: `url(${bg_img})`
}

import { r, arctic_scroll, currentYPosition, elmYPosition } from '../../assets/utils/scrolling';


//Component
export default function Hero(){
  return (
    <div className='hero' style={inline_css}>
      <div className='hero--title-container'>
        <h1 className='hero--title'>Portfolio</h1>
        <p className='hero--stub'>Jason Tran | jason.tran (at) berkeley.edu | 714|363|2625</p>
      </div>
      <a className="button button--scrollEnd hero--item" href="#heatmap" onClick={arctic_scroll}>Learn more</a>
    </div>
  )
}
