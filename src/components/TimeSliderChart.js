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
        const {width, height, balanceChartData} = this.props;
        let margin = {top: 20, right: 20, bottom: 20, left: 20},
            svgDimen = {width: width - margin.left - margin.right, height: height * 5/6 - margin.bottom - margin.top},
            o_imgW = 514, o_imgH = 64,
            s_imgW = svgDimen.width * 0.6,            
            s_imgH = s_imgW / o_imgW * o_imgH,
            top_legend_height = svgDimen.height * 0.08,
            legend_label_height = svgDimen.height * 0.1;

        this.state = {
            balanceChartData: balanceChartData,
            svgDimen: svgDimen,            
            s_imgW: s_imgW,
            s_imgH: s_imgH,
            top_legend_height: top_legend_height,
            legend_label_height: legend_label_height 
        };
    }    
    componentWillReceiveProps(nextProps){
        console.log("barchart receive props");        
        const {width, height} = nextProps;
        let margin = {top: 20, right: 20, bottom: 20, left: 20},
            svgDimen = {width: width - margin.left - margin.right, height: height * 5/6 - margin.bottom - margin.top},
            o_imgW = 514, o_imgH = 64,
            s_imgW = svgDimen.width * 0.6,            
            s_imgH = s_imgW / o_imgW * o_imgH,
            top_legend_height = svgDimen.height * 0.08,
            legend_label_height = svgDimen.height * 0.1;

        this.setState({
            balanceChartData: nextProps.balanceChartData,
            svgDimen: svgDimen,           
            s_imgW: s_imgW,
            s_imgH: s_imgH,
            top_legend_height: top_legend_height,
            legend_label_height: legend_label_height 
        });
        console.log(this.state, "barchart componentwillreceiveprops")
    }
    componentDidMount(){
        console.log("barchart did mount")
    }   
    shouldComponentUpdate(nextProps, nextState){
        console.log("barchart should update", this.props.balanceChartData !== nextProps.balanceChartData);        
        return this.props.balanceChartData !== nextProps.balanceChartData;
    }
    
    render() {
        console.log("barchart render", this.state);

        const {svgDimen, s_imgW, s_imgH, top_legend_height, legend_label_height, balanceChartData} = this.state;

        let left_data = [balanceChartData[0], balanceChartData[1], balanceChartData[2]];
        let right_data = [balanceChartData[3], {label:"empty", value: 0}, balanceChartData[4]];
        
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
        console.log("bar receive props");        
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
        console.log(this.state,"bar data")
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
                    if(data[i].value == 0){
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
        console.log("bar render", this.state)
        const {transX, transY} = this.state;
        return <g className="Bar"  transform={`translate(${transX} , ${transY})`} ref={el => this.el = el}></g>;
                
    }
}
class Handle extends Component {
  constructor(props){
    super(props);
    const {years, svgDimensions, margins} = this.props;
    let first = years[0];
    let last = years[years.length - 1];
    let xScale = d3.scaleLinear()
        .domain([first, last])
        .range([margins.left, svgDimensions.width - margins.right])
        .clamp(true);

    this.state = {
      handle: '',
      xScale: xScale,
      initialValue: first
    }
  }
  onMouseOver(){
    this.setState({
      handle: this.props.handle
    });    
  }
  render() {
    const {handle} = this.props;
    const {xScale, initialValue} = this.state;
    const circle = <circle r="10px" fill="#de0730"/>;
    const text = <text style={{opacity: 1, fontSize: 14, fill: '#de0730'}}/>;
    return <g className={handle} transform={`translate(${xScale(initialValue)},20)`}
     onMouseOver={this.onMouseOver.bind(this)}>{text}{circle}</g>
  }

  componentDidUpdate(prevProps, prevState){
    let {margins,svgDimensions, onChangeYear} = prevProps;
    let {xScale} = this.state;
    let mouseValue, trueMouseValue, self = this;

    const drag = d3.drag()
        .on("drag",draged).on("end", dragend);

    d3.select(".rangeSliderGroup").call(drag);

    function draged(){        
        mouseValue = d3.mouse(this)[0];        
        trueMouseValue = getTrueMouseValue(mouseValue);
        if (mouseValue > margins.left && mouseValue < (svgDimensions.width - margins.right)){
            d3.select("." + self.state.handle).attr("transform","translate(" + mouseValue + ", 20)");
            d3.select("." + self.state.handle).select("text")
                .attr('alignment-baseline', 'middle')
                .attr('dy', -15)
                .style("text-anchor", "middle")                
                .text(trueMouseValue);
        }
    }
    function dragend() {
        d3.select("." + self.state.handle).attr("transform","translate("+xScale(trueMouseValue)+", 20)");
        onChangeYear(trueMouseValue);
    }
    function getTrueMouseValue(mouseValue){
        return Math.round(xScale.invert(mouseValue));
      }
  }
}

class Axis extends React.Component {
  componentDidMount(){
    this.renderAxis();
  }
  renderAxis(){
    const {svgDimensions, margins, years} = this.props;
    let first = years[0];
    let last = years[years.length - 1];
    let xScale = d3.scaleLinear()
        .domain([first, last])
        .range([margins.left, svgDimensions.width - margins.right])
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
      .style("fill","black")      

    d3.select(this.axisElement).selectAll("line").attr("stroke","white");//set black when shows axis
    d3.select(this.axisElement).select("path").style("d","none")
  }
  render() {
    return (
      <g className="sliderAxis" transform="translate(0,30)" ref={el => this.axisElement = el } />
    )
  }
}
class RangeSlider extends Component {
    constructor(props){
        super(props);        
    }
    componentWillMount(){        
        this.setState({
            data: this.props.data
        });
    }
    componentWillReceiveProps(nextProps){        
        this.setState({
            data: nextProps.sliderData
        });
    }
    render(){
        const {width, height, onChangeYear} = this.props;        
        const margins = {top: 20, right: 50, bottom: 20, left: 50},
            svgDimensions = {width: width, height: height/6 };        
            const RangeBar = <line x1={margins.left} y1="20" x2={svgDimensions.width - margins.right} y2="20" className="rangeBar" />

        return  <svg className="rangeSliderSvg" width={svgDimensions.width} height={svgDimensions.height}>
                    <g className="rangeSliderGroup" transform={`translate(0,${svgDimensions.height - margins.bottom - 40})`}>
                        {RangeBar}
                        <Axis margins={margins} svgDimensions={svgDimensions} years={this.state.data} />
                        <Handle onChangeYear={onChangeYear} handle="handle" years={this.state.data} margins={margins} svgDimensions={svgDimensions} />
                    </g>
                </svg>;
    }
    
}

class TimeSliderChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            sliderData: '',
            balanceChartData: []
        }
    }
    componentWillMount(){
        const {data} = this.props;        
        let years = data.map(d => d.year);
        this.setState({
            sliderData: years,
            balanceChartData: data[0].values
        });        
    }
    handleChangeYear = (curYear) => {
        const {data} = this.props;
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
                        <RangeSlider onChangeYear={this.handleChangeYear} width={this.props.width} height={this.props.height} data={this.state.sliderData}/>
                    </div>
                    <div className="balanceChart">
                        <BalanceChart width={this.props.width} height={this.props.height} balanceChartData={this.state.balanceChartData}/>
                    </div>
                </div>;
    }
}

export default TimeSliderChart;