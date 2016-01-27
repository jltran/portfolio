import React from 'react';

require('../../assets/style/component/contact.css');
import { smooth_scroll, currentYPosition, arctic_scroll } from '../../assets/utils/scrolling';


export default class Contact extends React.Component{
  render(){
    return (
      <div id="contact">
        <div className="container">
          <div className="six columns">
            <h1>About Me</h1>
            <ul>
              <li>Education: B.A. in Evolutionary Bio. from UC Berkeley (GPA: 3.6)</li>
              <li>Work Experience: 5 years as Project Manager for non-profit start-up aimed at decreasing HIV prevalence in SF Bay Area. (3 years while in college)</li>
              <li>Preferred Technologies:</li>
              <ul>
                <li>Data Analysis: Python, Numpy, Pandas, Sk-Learn, Pyplot (
                  <a href="https://github.com/jltran/personal_ipython_notebooks/blob/master/Antibiotics.ipynb">1</a>,
                  <a href="https://github.com/jltran/personal_ipython_notebooks/blob/master/Breast%20Cancer.ipynb">2</a>,
                  <a href="https://github.com/jltran/personal_ipython_notebooks/blob/master/Housing.ipynb">3</a>,
                  <a href="https://github.com/jltran/personal_ipython_notebooks/blob/master/Iris%20-%20PCA.ipynb">4</a>
                )</li>
                <li>Front-End: React, ES6, Saas (Radium someday?), D3 (
                  <a href="http://www.jason.lt/blog/antibiotics.html">1</a>,
                  <a href="http://www.jason.lt/blog/breast-cancer.html">2</a>,
                  <a href="#housing" onClick={arctic_scroll}>3</a>
                )</li>
                <li>Build Tools: Webpack, Autoprefixer, Mocha</li>
              </ul>
              <li>Looking for: A place with awesome people working on awesome projects.</li>
              <li>Contact Me: jason.tran (at) berkeley.edu, 714|363|2625</li>
            </ul>
          </div>
          <div className="six columns">
          <a href='#' onClick={(e) => {e.preventDefault(); smooth_scroll(currentYPosition(), 0)}}>
            <svg x="0px" y="0px" width="400" height="400" viewBox="-10 0 44 32">
              <path d="M17.736 23.394h-5.397v-1.846h3.551v-13.634h-13.634v13.634h4.9v1.846h-6.746v-17.327h17.327zM26.258 31.134h-17.327v-17.327h5.326v1.775h-3.48v13.705h13.634v-13.705h-4.9v-1.775h6.746z" fill='rgb(205,205,203)' stroke='none' />
            </svg>
          </a>
          </div>
        </div>
      </div>
    )
  }
}
