import React from 'react';
import d3 from 'd3';
import { arctic_scroll } from '../../assets/utils/scrolling';

require('../../assets/style/component/voronoi.css')

export default class Voronoi extends React.Component{
  componentDidMount(){
    const w = this.chart.offsetWidth
        , h = this.chart.offsetHeight;

    let vertices = d3.range(200).map(d =>[Math.random() * w, Math.random() * h]);

    const voronoi = d3.geom.voronoi().clipExtent([[0, 0], [w, h]]);
    const svg = d3.select('#voronoi').append('svg')
                  .attr('width', w)
                  .attr('height', h)
                  .on('mousemove', function(){
                    //vertices[0] = d3.mouse(this);
                    //redraw();
                    drawLine(d3.mouse(this));
                  });

    let path = svg.append('g').attr('class', 'voronoi--container').selectAll('.voronoi--path');
    let delaunay = svg.append('g').attr('class', 'delaunay--container').selectAll('.delaunay--path')
                      .data(d3.geom.delaunay(vertices).map(d => "M" + d.join("L") + "Z"))
                      .enter().append('path')
                      .attr('class', 'delaunay--path')
                      .attr('d', String);

    svg.selectAll('circle')
        .data(vertices)
        .enter().append('circle')
        .attr('transform', (d) => "translate(" + d + ")" )
        .attr('r', 2);

    draw();

    function draw(){
      path = path.data(voronoi(vertices), (d) => "M" + d.join("L") + "Z");
      path.exit().remove();
      path.enter().append('path')
          .attr('class', 'voronoi--path')
          .attr('class', (d, i) => 'q' + ( i % 9 ) + '-color')
          .attr('d', (d) => "M" + d.join("L") + "Z");
      path.order();
    };
    function drawLine(currPos){
      function euclidean(a, b){
        return Math.sqrt(Math.pow(a[0]- b[0], 2) + Math.pow(a[1]-b[1], 2));
      };

      const _min = vertices.map(d => euclidean(currPos, d))
      const index = _min.indexOf(d3.min(_min));

      let closest = svg.selectAll('.closest').data([currPos[0]], d=>d);
      closest.enter().append('line')
              .attr('class', 'closest')
              .attr('x1', currPos[0])
              .attr('x2', vertices[index][0])
              .attr('y1', currPos[1])
              .attr('y2', vertices[index][1])
              .attr("stroke-width", 4)
              .attr('stroke-dasharray', '2, 2')
              .attr("stroke", 'black');
      closest.exit().remove();
    };
  }
  render(){
    return (
      <div id="voronoi" ref={ref => this.chart = ref}>
        <div className="voronoi--button--next">
          <a className='button'
                  href="#healthcoverage--container"
                  onClick={arctic_scroll}>Next</a>
        </div>
      </div>
    )
  }
}
