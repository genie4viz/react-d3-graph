import React, {
    Component
} from 'react';
import * as d3 from "d3";
import './guagechart.scss';

class GuageChart extends Component {

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate(prevProps, prevState){
        this.drawChart();
    }

    drawChart() {
        const {width, height, data} = this.props;
        let margin = 40,
            n = 100,
            radius = width / 2 - (margin * 2),
            needleRad = radius - (radius * 2 / 5),
            needleCenterRad = 25,
            pi = Math.PI,
            halfPi = pi / 2,
            endAngle = pi / 2,
            startAngle = -endAngle,
            field = d3.range(startAngle, endAngle, pi / n),
            tt = 3000,            
            scale = d3.scaleLinear().domain([0, 100]).range([startAngle, endAngle]),            
            cur_data = d3.range(startAngle, scale(data.current), pi / n),
            node = this.node;

        d3.select(node).selectAll("*").remove();
        let svg = d3.select(node)
                .attr("width", width + margin)
                .attr("height", height + margin)
                .append("g")
                .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')');

        let arc = d3.arc()
            .innerRadius(radius - (radius / 5))
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(endAngle);

        let slice = svg.append('g').selectAll('path.slice').data(field);

        slice
            .enter()
            .append('path')
            .attr('class', 'slice')
            .attr('d', arc)
            .attr('fill', "#929292");
        
        let arc_cur = d3.arc()
            .innerRadius(radius - (radius / 5))
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(scale(data.current));
        let cur_slice = svg.append('g').selectAll('path.cur_slice').data(cur_data);
        cur_slice
            .enter()
            .append('path')
            .attr('class', 'cur_slice')
            .attr('d', arc_cur)
            .attr('fill', "#df072c");

        let needle = svg
            .append('path')
            .attr('class', 'needle')
            .attr('fill-opacity', .7)
            .attr('stroke', 'black');

        let text = svg
            .append('text')
            .attr('class', 'text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 70)
            .classed('monospace', true);

        function update(oldValue, newValue) {            
            needle
                .datum({
                    oldValue: oldValue
                })
                .transition().duration(tt)
                .attrTween('d', lineTween(newValue));                

            text
                .datum({
                    oldValue: oldValue
                })
                .transition().duration(tt)
                // .attrTween('transform', transformTween(newValue))
                .tween('text', textTween(newValue));
        }

        function textTween(newValue) {
            return function (d) {                
                let that = d3.select(this),
                    i = d3.interpolate(d.oldValue, newValue);
                return function (t) {                    
                    that.text(scale.invert(i(t)).toFixed(0) + "%");
                };
            };
        }
        function lineTween(newValue) {
            return function (d) {
                let interpolate = d3.interpolate(d.oldValue, newValue);
                return function (t) {
                    let _in = interpolate(t) - halfPi,
                        _im = _in - halfPi,
                        _ip = _in + halfPi;

                    let topX = needleRad * Math.cos(_in),
                        topY = needleRad * Math.sin(_in);

                    let leftX = needleCenterRad * Math.cos(_im),
                        leftY = needleCenterRad * Math.sin(_im);

                    let rightX = needleCenterRad * Math.cos(_ip),
                        rightY = needleCenterRad * Math.sin(_ip);

                    return "M " + topX + " " + topY + " L " + leftX + " " + leftY + " A " + leftX + " " + leftX + " 1 0 0 " + rightX + " " + rightY + " Z";

                };
            };
        }        
        update(scale(0), scale(data.current));
    }

    render() {
        return  <svg ref={node => this.node = node}>
                </svg>;
    }
}


export default GuageChart;