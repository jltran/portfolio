import React from 'react';
import d3 from 'd3';

import { arctic_scroll } from '../../assets/utils/scrolling';

require('../../assets/style/component/housing.css');
const attrs = {'AGE': 'proportion of owner-occupied units built prior to 1940',
                       'B': '1000(Bk - 0.63)^2 where Bk is the proportion of blacks',
                       'CHAS': 'Charles River dummy variable (1 = bounds river, 0 = otherwise)',
                       'CRIM': 'per capita crime rate by town',
                       'DIS': 'weighted distances to five Boston employment centres',
                       'INDUS': 'proportion of non-retail business acres per town',
                       'LSTAT': '% lower status of the population',
                       'NOX': 'nitric oxides concentration (parts per 10 million)',
                       'PTRATIO': 'pupil-teacher ratio by town',
                       'RAD': 'index of accessibility to radial highways',
                       'RM': 'average number of rooms per dwelling',
                       'TAX': 'full-value property-tax rate per $10,000',
                       'ZN': 'proportion of residential land zoned for lots over',
                       'bias': 'bias unit introduced for regression'};
const housing_data = parse_data(require('dsv!../../assets/data/boston_theta.csv'));

 //Clean data helper f
 function parse_data(data){
   var keys = d3.keys(data[0]);
   var parsedData = [];
   for(var i in data){
     for(var j in keys){
       if(keys[j] !== ""){
         data[i][keys[j]] = parseFloat(data[i][keys[j]]);
       }
     }
   }
   return data.sort(function(a, b){return d3.ascending(a["gradient descent"], b["gradient descent"])})
 };

export default class Housing extends React.Component{
  constructor(props){
    super(props);

    this.state = {};
  }
  componentDidMount(){
    this.renderSideBar();
    this.renderResiduals();
  }
  renderSideBar(){
    const m = {top: 10, right: 10, bottom: 40, left: 60}
      , w = 300 - m.left - m.right
      , h = 400 - m.top - m.bottom;

    //Scales
    let x = d3.scale.linear().range([0, w])
      , y = d3.scale.ordinal().rangeRoundBands([h, 0]);

    let xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-h).outerTickSize(0)
      , yAxis = d3.svg.axis().scale(y).orient('left').outerTickSize(0);

    const svg = d3.select('.housing--graph-right').append('svg')
                .attr('width', w + m.left + m.right)
                .attr('height', h + m.top + m.bottom)
                .append('g')
                .attr('transform', 'translate(' +[m.left, m.top] + ')' );

    const titles = housing_data.map(function(d){return d['']});

    x.domain([d3.min(housing_data, function(d){return d.left}), d3.max(housing_data, function(d){return d.right})]).nice()
    y.domain(housing_data.map(function(d){return d[""]}));

    var lines = svg.selectAll('line')
        .data(housing_data)
        .enter()
        .append('line')
        .style('stroke', 'black')
        .attr('x1', function(d){return x(d['left'])})
        .attr('y1', function(d){return y(d['']) + y.rangeBand()/2})
        .attr('x2', function(d){return x(d['right'])})
        .attr('y2', function(d){return y(d['']) + y.rangeBand()/2});

    var centers = svg.selectAll('.center')
        .data(housing_data)
        .enter()
        .append('circle')
        .attr('class', 'center')
        .attr('cx', function(d){return x(d['matrix'])})
        .attr('cy', function(d){return y(d['']) + y.rangeBand()/2})
        .attr('r', 2);

    var grads = svg.selectAll('.grad')
        .data(housing_data)
        .enter()
        .append('circle')
        .attr('class', 'grad')
        .attr('cx', function(d){return x(d['gradient descent'])})
        .attr('cy', function(d){return y(d['']) + y.rangeBand()/2})
        .attr('r', 2)
        .attr('fill', 'red');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Regression Variables");

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + [0, h] + ')')
      .call(xAxis)
      .append('text')
      .attr("x", x(0))
      .attr("dy", "2.5em")
      .style('text-anchor', 'middle')
      .text("Regression Slope (Standardized)")
  }
  renderResiduals(){
    const data = parse_data(require('dsv!../../assets/data/partialRegData.csv'));
    var m = {top: 10, right: 10, bottom: 40, left: 40}
    , w = 700 - m.left - m.right
    , h = 400 - m.top - m.bottom;

    var x = d3.scale.linear().range([0, w])
      , y = d3.scale.linear().range([h, 0])
      , xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-h).outerTickSize(0)
      , yAxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-w).outerTickSize(0);

    var svg = d3.select('.housing--graph-left').append('svg')
                .attr('width', w + m.left + m.right)
                .attr('height', h + m.top + m.bottom)
                .append('g')
                .attr('transform', 'translate(' + [m.left, m.top] + ')');

    //Make select
    var initialVar = 'RM';
    var dropdown = make_select_button(initialVar);
    display_attrs();

    //On Select
    dropdown.on('change', function(){
        var newVar = d3.select(this).property('value');
        updateDomains(x, y, data, newVar);
        updateData(svg, data, newVar);
        updateAxes(svg, xAxis, yAxis, newVar);
        graph_trendline(svg, x, newVar);
    });

    //Chart Data
    updateDomains(x, y, data, initialVar);
    updateData(svg, data, initialVar);

    // Create Axes
    svg.append('g')
        .call(xAxis)
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .append('text')
        .attr("dy", "2.5em")
        .attr('x', x(d3.mean(x.domain())))
        .style('text-anchor', 'middle')
        .text("X | other variables");
    svg.append('g')
        .call(yAxis)
        .attr('class', 'y axis')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .style("text-anchor", "end")
        .text("Y | other variables");

    // Graph trendline
    graph_trendline(svg, x, initialVar);

    // Helper Functions
    function make_select_button(selectedVar){
      var dropdowndiv = d3.select('.housing--graph-right').append('span')
                          .attr('id', 'sidebar')
                          .style('position', 'absolute')
                          .style('top', 18);
      var dropdown = dropdowndiv.append('select')
                          .attr('id', 'varSelect')
                          .attr('transform', 'translate(' + [w-50, 25] + ')');
      var options = dropdown.selectAll('option')
                            .data(Object.keys(attrs).sort(d3.ascending).slice(0, Object.keys(attrs).length - 1))
                            .enter()
                            .append('option')
                            .attr('value', function(d){return d;})
                            .attr('selected', function(d){if(d==selectedVar) return 'selected'})
                            .text(function(d){return d;});
      return dropdown;
    }
    function display_attrs(){
      var sidebar = d3.select('#sidebar');
      for(var i in attrs){
        if(i !== 'bias'){
          sidebar.append('p')
                  .text(i)
                  .style('font-weight', 'bold')
                  .append('span')
                  .text(' - ' + attrs[i])
                  .style('font-weight', 'normal')
        }
      }
    }
    function updateData(svg, data, selectedVar){
      let circles = svg.selectAll('circle')
                  .data(data)

      circles.enter()
            .append('circle');

      circles.transition().duration(500)
            .attr('cx', function(d){return x(d[selectedVar + 'X'])})
            .attr('cy', function(d){return y(d[selectedVar + 'Y'])})
            .attr('r', 2)
            .attr('fill-opacity', 0.6)
    }
    function updateDomains(x, y, data, selectedVar){
      x.domain([d3.min(data, function(d){return +d[selectedVar + 'X']}), d3.max(data, function(d){return +d[selectedVar + 'X']})]).nice();
      y.domain([d3.min(data, function(d){return +d[selectedVar + 'Y']}), d3.max(data, function(d){return +d[selectedVar + 'Y']})]).nice();
    }
    function updateAxes(svg, xAxis, yAxis, newVar){
      svg.select('.x.axis')
        .transition().duration(500).ease('linear')
        .call(xAxis)
      svg.select('.y.axis')
        .transition().duration(500).ease('linear')
        .call(yAxis)
    }
    function graph_trendline(svg, x, selectedVar){
      var slope = getSlope(selectedVar);
      var trendData = [[x.domain()[0], x.domain()[1], slope*x.domain()[0], slope*x.domain()[1]]];
      var trendline = svg.selectAll('.trendline')
                          .data(trendData);
      trendline.enter().append('line').attr('stroke', 'red');

      trendline.transition().duration(500)
                .attr('class', 'trendline')
                .attr('x1', function(d){return x(d[0])})
                .attr('x2', function(d){return x(d[1])})
                .attr('y1', function(d){return y(d[2])})
                .attr('y2', function(d){return y(d[3])})
                .attr('stroke', 'red')
                .attr('stroke-width', 1);

      function getSlope(chosenVar){
        for(var i in housing_data){
          if(housing_data[i][""] == chosenVar){
            return housing_data[i]["gradient descent"]
          }
        }
        return null;
      }
    }
  }
  render(){
    return (
      <div id='housing'>
        <div className="housing--title--container">
          <h2 className="housing--name">Boston Housing Price Prediction</h2>
          <a className='button housing--button'
                  href="#growth"
                  onClick={arctic_scroll}>Next</a>
        </div>
        <div className='housing--graph u-cf'>
          <div className='housing--graph-left u-pull-left'></div>
          <div className='housing--graph-right u-pull-left'>
          </div>
        </div>
      </div>
    )
  }
}
