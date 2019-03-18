import React, {
    Component
} from 'react';
import * as d3 from "d3";


class GuageChart extends Component {
    constructor(props){
        super(props);
        const {width, height, data} = this.props;        
        let margin = {top: 20, right: 20, bottom: 20, left: 20},
            svgDimen = {width: width - margin.left - margin.right, height: height - margin.top - margin.bottom};
        this.state = {
            svgDimen: svgDimen,
            data: data
        };
    }
    componentWillReceiveProps(nextProps){
        const {width, height, data} = nextProps;
        let margin = {top: 20, right: 20, bottom: 20, left: 20},
            svgDimen = {width: width - margin.left - margin.right, height: height - margin.top - margin.bottom};
        // console.log(nextProps, "nextProps");
        this.setState({
            svgDimen: svgDimen,
            data: data
        });
    }
    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate(){
        this.drawChart();
    }
    shouldComponentUpdate(nextProps, nextState){        
        return this.props.data !== nextProps.data;
    }
    drawChart() {
        const {svgDimen, data} = this.state;
        // console.log(data,"from guagechart receiveprops")
        let n = 100,
            padding = {top: 20, right: 20, bottom: 20, left: 20},
            radius = (svgDimen.height - padding.top - padding.bottom)/2,
            needleRad = radius - (radius * 2 / 5),
            needleCenterRad = radius * 0.15,
            pi = Math.PI,
            halfPi = pi / 2,
            endAngle = pi / 2,
            startAngle = -endAngle,
            field = d3.range(startAngle, endAngle, pi / n),            
            scale = d3.scaleLinear().domain([0, 100]).range([startAngle, endAngle]);            

        d3.select(this.el).selectAll("*").remove();
        
        let arc = d3.arc()
            .innerRadius(radius - (radius / 5))
            .outerRadius(radius)
            .startAngle((d, i) => scale(i))
            .endAngle((d, i) => scale(i + 1));

        d3.select(this.el).append('g')
            .selectAll('path')
            .data(field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) => (i + 1) <= data.current ? data.color : '#929292')
            .attr('fill', (d, i) => (i + 1) <= data.current ? data.color : '#929292')
            .attr('d', arc);
        
        //draw needle
        d3.select(this.el)
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

        // add branche, market label
        let ticks = scale.ticks(100);		
        d3.select(this.el)
            .append('g')
            .attr('class', 'label')
            .selectAll('text.label')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function(d) {
                let _in = scale(d) - halfPi;
                let topX = (radius + 15) * Math.cos(_in),
                    topY = (radius + 15) * Math.sin(_in);
                return 'translate(' + topX + ',' + topY +')';
            })
            .style("text-anchor", d => d < 50 ? "end" : "start")
            .attr('fill','#929292')
            .text(function(d){
                if(d === data.branche){
                    return 'Branche';
                }
                if(d === data.market){
                    return 'Market';
                }
                return '';
            });

        // add marker        
        d3.select(this.el)
            .append('g')
            .attr('class', 'marker')
            .selectAll('path.marker')
            .data(ticks)
            .enter().append('path')
            .style('stroke','#929292')
            .style('stroke-width', function(d){
                if(d === data.branche){
                    return 6;
                }
                if(d === data.market){
                    return 6;
                }
                return 0;
            })
            .attr('d', function(d) {
                let _in = scale(d) - halfPi;
                let farX = (radius + 10) * Math.cos(_in),
                    farY = (radius + 10) * Math.sin(_in),
                    nearX = (radius * 4/5 - 10) * Math.cos(_in),
                    nearY = (radius * 4/5 - 10) * Math.sin(_in);

                return 'M ' + farX + ' ' + farY + ' L ' + nearX + ' ' + nearY + ' Z';
            });
    }
    render() {
        const {svgDimen, data} = this.state;

        return  <svg width={svgDimen.width} height={svgDimen.height}>
                    <g className="guageChart" transform={`translate(${svgDimen.width / 2}, ${svgDimen.height * 0.6 })`} ref={el => this.el = el}></g>
                    <g className="legendBottom" transform={`translate(${svgDimen.width / 2}, ${svgDimen.height * 7 / 8})`}>
                        <text x="0" y="0" alignmentBaseline="baseline" textAnchor="middle" style={{fontSize: 64, fill: '#bdbbbc'}}>
                            {data.current}%
                        </text>
                        <text x="0" y="10" alignmentBaseline="hanging" textAnchor="middle" style={{fontSize: 18, fill: '#bdbbbc'}}>
                            {data.description}
                        </text>
                    </g>
                </svg>
    }
}


export default GuageChart;