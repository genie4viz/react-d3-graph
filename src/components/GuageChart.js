import React, {
    Component
} from 'react';
import * as d3 from "d3";
import './guagechart.scss';


class GuageChart extends Component {

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate(){
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
            scale = d3.scaleLinear().domain([0, 100]).range([startAngle, endAngle]),
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
            .startAngle((d, i) => scale(i))
            .endAngle((d, i) => scale(i + 1));

        svg.append('g')
            .selectAll('path')
            .data(field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) => (i + 1) <= data.current ? data.color : '#929292')
            .attr('fill', (d, i) => (i + 1) <= data.current ? data.color : '#929292')
            .attr('d', arc);
        
        //draw needle
        svg
            .append('path')
            .attr('class', 'needle')
            .attr('d', function(d){                
                let _in = scale(data.current) - halfPi,
                    _im = _in - halfPi,
                    _ip = _in + halfPi;

                let topX = needleRad * Math.cos(_in),
                    topY = needleRad * Math.sin(_in);

                let leftX = needleCenterRad * Math.cos(_im),
                    leftY = needleCenterRad * Math.sin(_im);

                let rightX = needleCenterRad * Math.cos(_ip),
                    rightY = needleCenterRad * Math.sin(_ip);                
                return "M " + topX + " " + topY + " L " + leftX + " " + leftY + " A " + leftX + " " + leftX + " 1 0 0 " + rightX + " " + rightY + " Z";
            })
            .attr('fill', data.color);

        //add percent text
        svg
            .append('text')
            .attr('class', 'text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 130)
            .attr('class', 'text-main')
            .attr('fill','#929292')
            .text(data.current + "%");
        //add description
        svg
            .append('text')
            .attr('class', 'text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 180)
            .attr('class', 'text-description')
            .text(data.description)
            .attr('fill','#929292');

        // add branche, market label
        let ticks = scale.ticks(100);		
        svg
            .append('g')
            .attr('class', 'label')
            .selectAll('text.label')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function(d) {
                let _in = scale(d) - halfPi;
                let topX = (needleRad + 80) * Math.cos(_in),
                    topY = (needleRad + 80) * Math.sin(_in);
                return 'translate(' + (topX - 7) + ',' + topY +')';
            })
            .style("text-anchor", d => d < 50 ? "end" : "start")
            .attr('fill','#929292')
            .text(function(d){
                if(d == data.branche){
                    return 'Branche';
                }
                if(d == data.market){
                    return 'Market';
                }
                return '';
            });

        // add marker        
        svg
            .append('g')
            .attr('class', 'marker')
            .selectAll('path.marker')
            .data(ticks)
            .enter().append('path')
            .style('stroke','#929292')
            .style('stroke-width', function(d){
                if(d == data.branche){
                    return 6;
                }
                if(d == data.market){
                    return 6;
                }
                return 0;
            })
            .attr('d', function(d) {
                let _in = scale(d) - halfPi;
                let farX = (needleRad + 75) * Math.cos(_in),
                    farY = (needleRad + 75) * Math.sin(_in),
                    nearX = (needleRad + 27) * Math.cos(_in),
                    nearY = (needleRad + 27) * Math.sin(_in);

                return 'M ' + farX + ' ' + farY + ' L ' + nearX + ' ' + nearY + ' Z';
            });
    }
    render() {
        return  <svg ref={node => this.node = node}>
                </svg>;
    }
}


export default GuageChart;