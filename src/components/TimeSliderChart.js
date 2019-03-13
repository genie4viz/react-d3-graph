import React, {
    Component
} from 'react';
import * as d3 from "d3";
import svg from 'react-svg'
import './timesliderchart.scss';
import balance_img from './balance.png';

class BalanceChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            width: 0,
            height: 0
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {        
        const {width, height, data} = nextProps;        
        let newProps = {
            width: width,
            height: height,
            data: data
        }
        if(prevState !== newProps)
            return newProps; //set newProps to state
        return null;// no changes
    }    
    componentDidMount(){     
    }   
    shouldComponentUpdate(nextProps, nextState){        
        return this.props.data !== nextProps.data;
    }    
    render() {
        const {width, height, data} = this.state;
        let margin = {top: 20, right: 20, bottom: 20, left: 20},
            svgDimen = {width: width - margin.left - margin.right, height: height * 5/6 - margin.bottom - margin.top},
            o_imgW = 514, o_imgH = 64,
            s_imgW = svgDimen.width * 0.6,            
            s_imgH = s_imgW / o_imgW * o_imgH,
            top_legend_height = svgDimen.height * 0.08,
            legend_label_height = svgDimen.height * 0.1;
        let left_data = [data[0], data[1], data[2]];
        let right_data = [data[3], {label:"empty", value: 0}, data[4]];
        
        return  <svg width={svgDimen.width} height={svgDimen.height}>
                    <g className="chartBase" transform={`translate(${svgDimen.width / 2} , 0)`}>
                        <g className="topLegend">
                            <text x={-s_imgW/4} y={top_legend_height} alignmentBaseline="ideographic" textAnchor="middle" style={{fontSize: 16, fill: '#bdbbbc', fontWeight: 'bold'}}>
                                Assets
                            </text>
                            <text x={s_imgW/4} y={top_legend_height} alignmentBaseline="ideographic" textAnchor="middle" style={{fontSize: 16, fill: '#bdbbbc', fontWeight: 'bold'}}>
                                Total Liabilities
                            </text>
                        </g>
                        <g className="leftLegend" transform={`translate(${-svgDimen.width / 2} , ${top_legend_height + legend_label_height})`}>
                            <circle r="5" cx="5" cy="0" fill="#63ae2d"/>
                            <text x="20" y="0" textAnchor="start" alignmentBaseline="middle" style={{fontSize: 14, fill: '#bdbbbc'}}>
                                Cash
                            </text>
                            <circle r="5" cx="5" cy={legend_label_height} fill="#ef7d00"/>
                            <text x="20" y={legend_label_height} textAnchor="start" alignmentBaseline="middle" style={{fontSize: 14, fill: '#bdbbbc'}}>
                                Fixed
                            </text>
                            <circle r="5" cx="5" cy={legend_label_height * 2} fill="#de0730"/>
                            <text x="20" y={legend_label_height * 2} textAnchor="start" alignmentBaseline="middle" style={{fontSize: 14, fill: '#bdbbbc'}}>
                                Goodwill
                            </text>
                        </g>
                        <g className="rightLegend" transform={`translate(${svgDimen.width * 0.3} , ${top_legend_height + legend_label_height})`}>
                            <circle r="5" cx="10" cy="0" fill="#63ae2d"/>
                            <text x="30" y="0" textAnchor="start" alignmentBaseline="middle" style={{fontSize: 14, fill: '#bdbbbc'}}>
                                Equity
                            </text>
                            <circle r="5" cx="10" cy={legend_label_height} fill="#de0730"/>
                            <text x="30" y={legend_label_height} textAnchor="start" alignmentBaseline="middle" style={{fontSize: 14, fill: '#bdbbbc'}}>
                                Debt
                            </text>
                        </g>                        
                        <g className="chartBoard" transform={`translate(0 , ${top_legend_height})`}>
                            <Bar transX={-s_imgW / 4} transY={top_legend_height} svgDimen={svgDimen} data={left_data} />
                            <Bar transX={s_imgW / 4} transY={top_legend_height} svgDimen={svgDimen} data={right_data} />                            
                        </g>
                        <image href={balance_img} width={s_imgW} height={s_imgH} x={-s_imgW/2} y={svgDimen.height - s_imgH - legend_label_height}></image>
                        <g className="bottomLegend" transform={`translate(0 , ${svgDimen.height})`}>
                            <text alignmentBaseline="ideographic" textAnchor="middle" style={{fontSize: 16, fill: '#bdbbbc', fontWeight: 'bold'}}>
                                € 12,2 mld
                            </text>
                        </g>
                    </g>                    
                </svg>;
    }
}
class Bar extends Component {
    constructor(props){
        super(props);
        const {transX, transY, svgDimen, data} = this.props;
        this.state = {
            transX: transX,
            transY: transY,
            svgDimen: svgDimen,
            data: data
        };
    }
    componentDidMount(){
        this.drawBar();
    }
    componentWillReceiveProps(nextProps){        
        const {transX, transY, svgDimen, data} = nextProps;        
        this.setState({
            transX: transX,
            transY: transY,
            svgDimen: svgDimen,
            data: data
        }, function(){
            this.drawBar()
        });
    }
    drawBar(){        
        const {svgDimen, data} = this.state;
        let bar_width = svgDimen.width * 0.25,
            bar_height = svgDimen.height * 0.63,
            rate = bar_height / 100;

        let barArea = d3.select(this.el);        
        let colors = ["#63ae2d", "#ef7d00", "#de0730"];        
        barArea.selectAll("*").remove();
        for(let i = 0; i < data.length; i++){
            barArea
                .append("rect")
                .attr("x", -bar_width/2)
                .attr("y", function(){
                    let sh = 0;
                    for(let k = 0; k < i; k++){
                        sh += data[k].value * rate;
                    }                    
                    return sh;
                })
                .attr("width", bar_width)
                .attr("height", data[i].value * rate)
                .style("fill", colors[i]);
            barArea
                .append('text')
                .attr("x", 0)
                .attr("y", function(){
                    let sh = 0;
                    for(let k = 0; k < i; k++){
                        sh += data[k].value * rate;
                    }
                    return data[i].value * rate/2 + sh;
                })
                .attr('alignment-baseline', 'middle')
                .style("fill","white")
                .style("opacity", function(){
                    if(data[i].value === 0){
                        return 0;
                    }else{
                        return 1;
                    }
                })
                .style("text-anchor", "middle")
                .style("font-size", 16)
                .text(data[i].value + "%")
        }       
    }
    render(){
        //console.log("bar render", this.state)
        const {transX, transY} = this.state;
        return <g className="Bar"  transform={`translate(${transX} , ${transY})`} ref={el => this.el = el}></g>;
                
    }
}
class Handle extends Component {
    constructor(props){
        super(props);
        this.state = {
            svgDimen: null,
            years: [],
            margins: null,
            onChangeYear: null,
            initialValue: 0,
            handle: ''
        }
    }
    onMouseOver(){
        this.setState({
            handle: this.props.handle            
        });        
    }
    render() {        
        const {margins, years, svgDimen, handle, initialValue} = this.state;
        let first = years[0];
        let last = years[years.length - 1];
        let xScale = d3.scaleLinear()
            .domain([first, last])
            .range([margins.left, svgDimen.width - margins.right])
            .clamp(true);        
        
        const circle = <circle r="10px" fill="#de0730"/>;
        const text = <text style={{opacity: 1, fontSize: 14, fill: '#de0730'}}/>;
        return <g className={handle} transform={`translate(${xScale(initialValue)},20)`}
            onMouseOver={this.onMouseOver.bind(this)}>{text}{circle}</g>
    }
    static getDerivedStateFromProps(nextProps, prevState) {        
        const {margins, svgDimen, years, handle, initialValue, onChangeYear} = nextProps;        
        let newProps = {
            years: years,            
            margins: margins,
            svgDimen: svgDimen,
            onChangeYear: onChangeYear,
            initialValue: initialValue,
            handle: handle
        }
        if(prevState !== newProps)
            return newProps; //set newProps to state
        return null;// no changes
    }
    componentDidUpdate(){        
        const {margins, years, svgDimen, onChangeYear, handle} = this.state;
        let first = years[0];
        let last = years[years.length - 1];
        let xScale = d3.scaleLinear()
            .domain([first, last])
            .range([margins.left, svgDimen.width - margins.right])
            .clamp(true);
        let mouseValue, trueMouseValue;        
        
        const drag = d3.drag()
            .on("start", dragstart).on("drag",dragged).on("end", dragend);

        d3.select(".rangeSliderGroup").call(drag);
        function dragstart(){
            mouseValue = d3.mouse(this)[0];
            trueMouseValue = getTrueMouseValue(mouseValue);
            d3.select("." + handle).attr("transform","translate(" + mouseValue + ", 20)");
            d3.select("." + handle).select("text")
                    .attr('alignment-baseline', 'middle')
                    .attr('dy', -15)
                    .style("text-anchor", "middle")                
                    .text(trueMouseValue);
        }
        function dragged(){            
            mouseValue = d3.mouse(this)[0];        
            trueMouseValue = getTrueMouseValue(mouseValue);
            if (mouseValue > margins.left && mouseValue < (svgDimen.width - margins.right)){
                d3.select("." + handle).attr("transform","translate(" + mouseValue + ", 20)");
                d3.select("." + handle).select("text")
                    .attr('alignment-baseline', 'middle')
                    .attr('dy', -15)
                    .style("text-anchor", "middle")                
                    .text(trueMouseValue);
            }
        }
        function dragend() {            
            d3.select("." + handle).attr("transform","translate("+xScale(trueMouseValue)+", 20)");            
            onChangeYear(trueMouseValue);
        }
        function getTrueMouseValue(mouseValue){
            return Math.round(xScale.invert(mouseValue));
        }
    }
}

class Axis extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            margins: null,
            svgDimen: null,
            years: []
        }
    }
    componentDidMount(){
        this.renderAxis();
    }
    componentDidUpdate(){
        this.renderAxis();
    }
    static getDerivedStateFromProps(nextProps, prevState) {        
        const {margins, svgDimen, years} = nextProps;        
        let newProps = {
            years: years,            
            margins: margins,
            svgDimen: svgDimen
        }
        if(prevState !== newProps)
            return newProps; //set newProps to state
        return null;// no changes
    }
    renderAxis(){        
        const {svgDimen, margins, years} = this.state;
        let first = years[0];
        let last = years[years.length - 1];
        let xScale = d3.scaleLinear()
            .domain([first, last])
            .range([margins.left, svgDimen.width - margins.right])
            .clamp(true);
        
        d3.select(this.axisElement)
        .call(d3.axisBottom()
            .scale(xScale)
            .ticks(years.length)
            .tickFormat(d3.format(""))
        )
        .selectAll("text")
        .style('opacity', d => d === first || d === last ? 1 : 0)
        .style("font-size","14px")
        .style("fill","black");

        d3.select(this.axisElement).selectAll("line").attr("stroke","white");//set black when shows axis
        d3.select(this.axisElement).select("path").style("d","none")
    }
    render() {        
        return <g className="sliderAxis" transform="translate(0,30)" ref={el => this.axisElement = el } />;
    }
}
class RangeSlider extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            height: 0,
            years: []
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {        
        const {years, width, height, onChangeYear} = nextProps;        
        let newProps = {
            years: years,            
            width: width,
            height: height,
            onChangeYear: onChangeYear,
        }
        if(prevState !== newProps)
            return newProps; //set newProps to state
        return null;// no changes
    }    
    render(){
        const {width, height, years, onChangeYear} = this.state;
        const margins = {top: 20, right: 50, bottom: 20, left: 50},
            svgDimen = {width: width - margins.left - margins.right, height: height/6 };        
        
        const RangeBar = <line x1={margins.left} y1="20" x2={svgDimen.width - margins.right} y2="20" className="rangeBar" />;
        let first = years[0];        

        return  <svg className="rangeSliderSvg" width={svgDimen.width} height={svgDimen.height}>
                    <g className="rangeSliderGroup" transform={`translate(0,${svgDimen.height - margins.bottom - 40})`}>
                        {RangeBar}
                        <Axis margins={margins} svgDimen={svgDimen} years={years} />
                        <Handle onChangeYear={onChangeYear} handle="handle" initialValue={first} years={years} margins={margins} svgDimen={svgDimen} />
                    </g>
                </svg>;
    }
    
}

class TimeSliderChart extends Component {
    constructor(props){
        super(props);        
        const {data, width, height} = this.props;        
        let years = data.map(d => d.year);
        this.state = {
            data: data,
            sliderData: years,
            balanceChartData: data[0].values,
            width: width,
            height: height
        };
    }
    componentWillReceiveProps(nextProps) {        
        const {data, width, height} = nextProps;        
        let years = data.map(d => d.year);
        this.setState({            
            sliderData: years,            
            balanceChartData: data[0].values,
            data: data,
            width: width,
            height: height
        });        
    }
    componentDidMount(){        
    }
    handleChangeYear = (curYear) => {
        const {data} = this.state;
        for(let i = 0; i < data.length; i++){
            if(data[i].year === curYear){                
                this.setState({
                    balanceChartData: data[i].values
                });
                break;
            }
        }        
    }
    render() {        
        return  <div className="timeslidercharts" style={{width: this.props.width , margin: '0 auto'}}>
                    <div className="rangeSlider">
                        <RangeSlider onChangeYear={this.handleChangeYear} width={this.state.width} height={this.state.height} years={this.state.sliderData}/>
                    </div>
                    <div className="balanceChart">
                        <BalanceChart width={this.state.width} height={this.state.height} data={this.state.balanceChartData}/>
                    </div>
                </div>;
    }
}

export default TimeSliderChart;