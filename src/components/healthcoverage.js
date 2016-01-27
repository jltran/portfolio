import React from 'react';
import d3 from 'd3';

require('../../assets/style/component/healthcoverage.css');
const data = require('dsv!../../assets/data/NewBRFSS.csv');
import { arctic_scroll } from '../../assets/utils/scrolling';

export default class HealthCoverage extends React.Component{
  componentDidMount(){

    const margin = {top: 0, right: 60, bottom: 10, left: 10}
        , w = 100
        , h = 75;
    let xScale = d3.time.scale().range([0, w])
      , yScale = d3.scale.linear().range([h, 0])
      , xValue , yValue
      , format = d3.time.format("%Y");

    // Data accessor functions.
    xValue = function(d) {return d.date;};
    yValue = function(d) {
      var t = null
      try {t = d.yes;}
      catch (e){}
      finally {return t}
    };

    var line = d3.svg.line()
                  .x(function(d){return xScale(xValue(d))})
                  .y(function(d){return yScale(yValue(d))});

    // Transform Data
    var allData = transform(data)
      , adults = allData[0].values;

    // Create charts
    var chart = function(dat){
      var div = d3.select("#healthcoverage").selectAll('.chart').data(dat);
      setUpScales(dat)

      div.enter().append('div').attr("class", "chart")
          .append("svg").append("g")

      var svg = div.select("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom);

      var g = svg.select("g")
                  .attr("transform", "translate(" + [margin.left, margin.top] + ")");

      // Create lines
      var lines = g.append("g")
      lines.append("path")
            .classed("line", true)
            .style("pointer-events", "none")
            .attr("d", function(c){return line(c.values)});

            // Add state label
          lines.append("text")
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .attr("y", h * 4 / 5)
            .attr("dx", margin.right / 2 + 5)
            .attr("x", w)
            .text(function(c){return c.key})

          // Create circles and captions
          var circle = lines.append('circle')
                            .attr('r', 2.2)
                            .attr('fill', 'red')
                            .attr('opacity', 1.0)
                            .style('pointer-events', 'none')
                            .attr('cx', xScale(format.parse('' + 2010)))
                            .attr('cy', function(c){
                              return yScale(c.values[c.values.length-1].yes)
                            });
          var caption = lines.append('text')
                            .attr('class', 'caption')
                            .attr('text-anchor', 'middle')
                            .attr('pointer-events', 'none')
                            .attr('dy', -8);
          var curYear = lines.append('text')
                            .attr("class", "year")
                            .attr('text-anchor', 'middle')
                            .attr('pointer-events', 'none')
                            .attr('dy', 5)
                            .attr('y', h);

          // Mouseover events
          var bisect = d3.bisector(function(d){return d.date}).left;
          var mouseover = function(){
            circle.attr('fill', "black");
            mousemove.call(this);
          };
          var mouseout = function(){
            circle.attr('fill', "red");
            caption.text("")
            curYear.text("")
          };
          var mousemove = function(){
            var format = d3.time.format("%Y");
            var year = xScale.invert(d3.mouse(this)[0]).getFullYear();
            var date = format.parse('' + year);

            var index = 0;
            circle.attr("cx", xScale(date))
                  .attr("cy", function(c){
                    index = bisect(c.values, date, 0, c.values.length - 1);
                    return yScale(yValue(c.values[index]));
                  });
            caption.attr("x", xScale(date))
                    .attr("y", function(c){return yScale(yValue(c.values[index]))})
                    .text(function(c){return yValue(c.values[index])});
            curYear.attr("x", xScale(date)).text(year);
          }

          g.append('rect')
            .classed('background', true)
            .style('pointer-events', 'all')
            .attr('width', w)
            .attr('height', h)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout)

        }(adults);

        d3.select("#healthcoverage")
          .append('div')
          .append("svg")
          .attr('height', h)
          .attr('width', 4*w)
          .append("text")
          .classed("graphtitle", true)
          .text("U.S. Health Coverage by State between 1995 and 2010 (%)")
          .attr('y', h * 4 / 5)
          .attr('x', margin.left)
          .attr("text-anchor", "left");

      // HELPER FUNCTIONS
      // Nest and transform raw data, formatting dates and values
      function transform(rawData){
        var format = d3.time.format("%Y")
        rawData.forEach(function(d){
          d.date = format.parse(d.Year);
          d.yes = +(/\d+/.exec(d.Yes)[0])
        })
        var nest = d3.nest()
                      .key(function(d){return d.Condition})
                      .key(function(d){return d.State})
                      .sortValues(function(a, b){return d3.ascending(a.date, b.date)})
                      .entries(rawData);
        return nest
      };

      // Takes data and normalizes scales across graphs
      function setUpScales(data){
        // Looks in each STATE array, finds MAX of each. Then takes MAX of those MAXes.
        // data -> Larger array of objects ... [{key: state, values: {obj}}, {....}]
        // c -> Single state object ... {key: state, values: {obj}}
        // d -> Datum {date: 2010, yes: 80}
        var minY = d3.min(data, function(c){
                          return d3.min(c.values, function(d){return yValue(d)})});
        var maxY = d3.max(data, function(c){
                          return d3.max(c.values, function(d){return yValue(d)})});
        maxY = maxY * 1.1;
        yScale.domain([minY, maxY]);

        //Assume xrange the same across all states
        var extentX = d3.extent(data[0].values, function(d){return xValue(d)});
        xScale.domain(extentX);
      };

  }
  render(){
    return (
      <div id='healthcoverage--container'>
        <a className='button healthcoverage--button'
              href="#contact"
              onClick={arctic_scroll}>Next</a>
        <div id='healthcoverage'></div>
      </div>
    )
  }
}
