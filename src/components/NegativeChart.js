import React, {
    Component
} from 'react';
import * as d3 from "d3";


class BarGroup extends React.Component {
    constructor(props){
        super(props);
        const {data, band, xScale, yScale} = this.props;        
        this.state = {
            data: data,
            band: band,
            xScale: xScale,
            yScale: yScale
        }
    }
    componentDidMount() {
        this.drawBars();
    }
    componentDidUpdate(){
        this.drawBars();
    }
    componentWillReceiveProps(nextProps){
        const {data, xScale, yScale} = nextProps;
        this.setState({
            data: data,            
            xScale: xScale,
            yScale: yScale
        });
    }
    shouldComponentUpdate(nextProps, nextState){        
        return this.props.data !== nextProps.data;
    }
    drawBars(){
        const {data, xScale, yScale} = this.state;
        let bar_data = data.values.map((d) => {
            d.label = d.label;
            d.value = +d.value;
            return d;
        });

        let color = d3.scaleOrdinal().range(["#bdbbbc", "#63ae2d", "#929292", "#000700"]);        

        d3.select(this.el).selectAll("*").remove();
        d3.select(this.el)
            .selectAll("rect")
            .data(bar_data)
            .enter().append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", d => d.value > 0 ? xScale(0) : xScale(d.value))
            .attr("width", d => d.value > 0 ? xScale(d.value - 100) : xScale(0) - xScale(d.value))
            .attr("height", yScale.bandwidth())
            .attr("y", d => yScale(d.label))
            .style("fill", d => color(d.label))
            .style("opacity", d => d.label === "EBITDA" ? 0 : 1);
        // //add percent
        d3.select(this.el)
            .selectAll("text")
            .data(bar_data)
            .enter().append("text")
            .attr("x", d => d.value > 0 ? xScale(d.value): xScale(d.value))
            .attr("y", d => d.label !== 'EBITDA' ? yScale(d.label) + yScale.bandwidth()/2 : 0)
            .text(d => d.label === "EBITDA" ? '' : d.value + "%")
            .attr('text-anchor', d => d.value > 0 ? 'end' : 'start')
            .attr('alignment-baseline', 'central')
            .style("font-size", 12)
            .style("fill", "white")

        // // //add EBITDA        
        d3.select(this.el)
            .selectAll("path")
            .data(bar_data)
            .enter().append("path")
            .attr("d", d => "M" + xScale(d.value) + " -1 L" + xScale(d.value) + " " + (yScale.bandwidth() + 2) +" Z")
            .style("stroke","#de0730")
            .style("stroke-width", 3)
            .style("opacity", d => d.label === "EBITDA" ? 1 : 0);
    }
    render(){        
        return <g ref={el => this.el = el} />;
    }
}
class Axis extends React.Component {
    constructor(props){
        super(props);        
        const {svgDimen, margins, data} = this.props;
        let xScale = d3.scaleLinear().range([0, svgDimen.width - margins.left - margins.right]).domain([-100, 100]);
        
        let y0Scale = d3.scaleBand()
            .rangeRound([svgDimen.height - margins.bottom, 0]).padding(0.01)
            .domain(data.map(d => d.year));
        let y1Scale = d3.scaleBand()
            .domain(data[0].values.slice(0 ,4).map(d => d.label))
            .rangeRound([0, y0Scale.bandwidth()]);
        
        this.state = {
            svgDimen: svgDimen,
            margins: margins,
            xScale: xScale,
            y0Scale: y0Scale,
            y1Scale: y1Scale,
            data: data
        };
    }
    componentDidMount(){
      this.renderAxis();
    }
    componentWillReceiveProps(nextProps){
        const {svgDimen, margins, data} = nextProps;        
        let xScale = d3.scaleLinear().range([0, svgDimen.width - margins.left - margins.right]).domain([-100, 100]);
        
        let y0Scale = d3.scaleBand()
            .rangeRound([svgDimen.height - margins.bottom, 0]).padding(0.01)
            .domain(data.map(d => d.year));
        let y1Scale = d3.scaleBand()
            .domain(data[0].values.slice(0 ,4).map(d => d.label))
            .rangeRound([0, y0Scale.bandwidth()]);      
        this.setState({
            svgDimen: svgDimen,
            margins: margins,
            xScale: xScale,
            y0Scale: y0Scale,
            y1Scale: y1Scale,
            data: data
        });
    }
    componentDidUpdate(){
        this.renderAxis();
    }
    renderAxis(){
        const {xScale, y0Scale, svgDimen, margins} = this.state;
        let xAxis = d3.axisBottom(xScale).tickSize(svgDimen.height - margins.bottom).ticks(10);
        let yAxis = d3.axisLeft(y0Scale).tickSize(0);

        d3.select(this.xAxisElement).selectAll("*").remove();
        d3.select(this.yAxisElement).selectAll("*").remove();

        d3.select(this.xAxisElement)
            .attr("class", "x axis")
            .call(xAxis)
            .select(".domain").remove();

        d3.select(this.xAxisElement)
            .selectAll(".tick line").attr("stroke", "#777").attr("stroke-dasharray", "2,2")

        d3.select(this.yAxisElement)
            .attr("class", "y axis")
            .call(yAxis)
            .select(".domain").remove();

        d3.select(this.yAxisElement)
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style("text-anchor", "middle")
            .style('fill', 'black')            
    }
    render() {
        const {data, xScale, y0Scale, y1Scale} = this.state;        
        return (
            <g className="Axis">
                <g className="xAxis" transform={`translate(50,0)`} ref={el => this.xAxisElement = el } />                    
                <g className="yAxis" transform={`translate(40,0)`} ref={el => this.yAxisElement = el } />
                {data.map((d, i) => {
                    return  <g key={i} className={`bar-group${d.year}`} transform={`translate(50, ${y0Scale(d.year)})`}>
                                <BarGroup key={i} data={d} yScale={y1Scale} xScale={xScale}/>
                            </g>;
                })}
            </g>
        )
    }
}
class NegativeChart extends Component {
    constructor(props){
        super(props);
        const {width, height, data} = this.props;
        let margins = {top: 20, right: 20, bottom: 20, left: 60},
            svgDimen = {width: width - margins.left - margins.right, height: height - margins.top - margins.bottom};
        this.state = {
            margins: margins,
            svgDimen: svgDimen,
            data: data
        };
    }
    componentWillReceiveProps(nextProps){
        const {width, height, data} = nextProps;
        let margins = {top: 20, right: 20, bottom: 20, left: 60},
            svgDimen = {width: width - margins.left - margins.right, height: height - margins.top - margins.bottom};
        this.setState({
            data: nextProps.data,
            margins: margins,
            svgDimen: svgDimen
        });
    }
    render() {
        const {svgDimen, margins, data} = this.state;
        return  <svg className="graphSvg" width={svgDimen.width} height={svgDimen.height}>
                    <Axis svgDimen={svgDimen} margins={margins} data={data}/>
                </svg>
    }
}

export default NegativeChart;