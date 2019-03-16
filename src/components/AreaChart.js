import React, {
    Component
} from 'react';
import * as d3 from "d3";
import svg from 'react-svg'
import './areachart.scss';

class Chart extends Component {
    constructor(props){
        super(props);        
        this.state = {
            margins: this.props.margins,
            svgDimen: this.props.svgDimen,
            partial: this.props.partial,
            columns: this.props.columns
        }
    }
    componentWillReceiveProps(nextProps){
        // console.log(nextProps,"chart")
        this.setState({
            svgDimen: nextProps.svgDimen,
            partial: nextProps.partial,
            columns: nextProps.columns
        });        
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextProps !== this.props;        
    }
    componentDidMount(){
        this.drawGraph();
    }
    componentDidUpdate(){
        this.drawGraph();
    }
    drawGraph(){
        const {svgDimen, margins, partial, columns} = this.state;        
        // console.log(partial,"chart")
        if(partial.columns === undefined) partial.columns = columns;

        let data = partial.columns.slice(1, 3).map(function(id){
            return {
                id: id,
                values: partial.map(function(d){
                    return{
                        year: d.year,
                        value: d[id]
                    }
                })
            };
        });        
        let start = data[0].values[0].year, end = data[0].values[data[0].values.length - 1].year;
        var color = d3.scaleOrdinal()
            .domain(["grey", "red"])
            .range(["rgba(189, 187, 188, 0.7)", "rgba(223, 7, 44, 0.7)"]);
        let x = d3.scaleLinear()
            .range([margins.left, svgDimen.width - margins.right])
            .domain([start, end]);
        let y = d3.scaleLinear()
            .range([svgDimen.height - margins.bottom , margins.top])
            .domain([0, 100]);
        
        color.domain(data.map(function(c) { return c.id; }));
        
        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d=> x(d.year))
            .y0(y(0))
            .y1(d => y(d.value));

        let graph = d3.select(this.el);
        graph.selectAll("*").remove();

        graph.append("g")
            .attr("transform", "translate(0," + (svgDimen.height - margins.bottom) + ")")
            .call(d3.axisBottom()
                .scale(x)
                .ticks(data[0].values.length)
                .tickSize(0)
                .tickFormat(d3.format(""))
            )                        
            .selectAll("text")        
            .style("font-size","10px")
            .style("fill","black");
        graph
            .append("g")
            .call(d3.axisLeft()
                .scale(y)
                .ticks(10)
                .tickSize(0)                
            )
            .select(".domain").style('opacity', 0);
        
        graph.selectAll(".area")
            .data(data)
            .enter().append("path")
                .attr("d", (d) => area(d.values))
                .style("fill", (d) => color(d.id));
        // graph.selectAll("line").attr("stroke","white");//set black when shows GraphAxis
        // graph.select("path").style("d","none");
    }
    render(){
        console.log("render in chart")
        const {svgDimen} = this.state;
        return  <svg className="graphSvg" width={svgDimen.width} height={svgDimen.height}>
                    <g className="graphPane" ref={el => this.el = el}></g>
                </svg>;
    }
    
}

class Handle extends React.Component {    
    constructor(props){
        super(props);
        this.state = {            
            handle: this.props.handle,
            svgDimen: this.props.svgDimen,
            margins: this.props.margins,
            years: this.props.years,
            initValue: this.props.initValue,
            xScale: this.props.xScale,
            rangeValues: this.props.rangeValues
        }
    }

    componentWillReceiveProps(nextProps){        
        this.setState({
            svgDimen: nextProps.svgDimen,
            years: nextProps.years,
            handle: nextProps.handle
        });
    }
    onMouseOver(){
        this.setState({
            handle: this.props.handle
        });
    }
    render() {        
        const {svgDimen, margins, initValue, xScale, handle} = this.state;        
        const rect = <rect rx="3" ry="3" width="10" height={svgDimen.height - margins.bottom} transform={`translate(-5,0)`} fill="#df072c"/>;
        return <g className={handle} transform={`translate(${xScale(initValue)},0)`}
            onMouseOver={this.onMouseOver.bind(this)}>{rect}</g>
    }

    componentDidUpdate(prevProps, prevState){
        const {margins, svgDimen, xScale, years, handle, rangeValues} = this.state;
        const {onChangePeriod} = this.props;
        
        var mouseValue, trueMouseValue, self = this;        
        let minWidth = (svgDimen.width - margins.left - margins.right) / years.length;        

        const drag = d3.drag().on("start", dragstart).on("drag",draged).on("end",dragend);

        d3.select(".graphSliderGroup").call(drag);
        function dragstart(){
            mouseValue = d3.mouse(this)[0];
            trueMouseValue = getTrueMouseValue(mouseValue);
        }
        function draged(){
            mouseValue = d3.mouse(this)[0];
            trueMouseValue = getTrueMouseValue(mouseValue);
            
            handle === "handleLeft" ? rangeValues.h1 = mouseValue : rangeValues.h2 = mouseValue;
            
            if ((rangeValues.h2 - rangeValues.h1) > minWidth && mouseValue > margins.left && mouseValue < (svgDimen.width - margins.right)){                
                d3.select("." + self.state.handle).attr("transform","translate("+ mouseValue + ",0)");
                if (handle === "handleLeft") {
                    rangeValues.tempH1 = mouseValue;
                    rangeValues.trueYear1 = trueMouseValue;
                } else {
                    rangeValues.tempH2 = mouseValue
                    rangeValues.trueYear2 = trueMouseValue;
                }
            } else {                
                rangeValues.h1 = rangeValues.tempH1;
                rangeValues.h2 = rangeValues.tempH2;
                handle === "handleLeft" ? trueMouseValue = rangeValues.trueYear1 : trueMouseValue = rangeValues.trueYear2;
            }
            
            d3.select(".rangeBarFilled")
                .attr("x", rangeValues.h1)
                .attr("y",0)
                .attr("width", rangeValues.h2 - rangeValues.h1)
                .attr("height",svgDimen.height - margins.bottom)            
        }
        function dragend() {
            rangeValues.h1 = xScale(getTrueMouseValue(rangeValues.tempH1));
            rangeValues.h2 = xScale(getTrueMouseValue(rangeValues.tempH2));
            console.log(rangeValues.trueYear1 + ":" + rangeValues.trueYear2)
            d3.select("." + self.state.handle).attr("transform","translate(" + xScale(trueMouseValue) + ",0)");
            d3.select(".rangeBarFilled")                
                .attr("x", xScale(rangeValues.trueYear1))
                .attr("y", 0)
                .attr("width", xScale(rangeValues.trueYear2) - xScale(rangeValues.trueYear1))
                .attr("height",svgDimen.height - margins.bottom)              

            onChangePeriod(rangeValues.trueYear1, rangeValues.trueYear2);
        }
        function getTrueMouseValue(mouseValue){
            return Math.round(xScale.invert(mouseValue));
        }
    }
}

class GraphSlider extends Component {
    constructor(props){
        super(props);
        this.state = {
            margins: this.props.margins,
            svgDimen: this.props.svgDimen,
            total: this.props.total,
            columns: this.props.columns
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            total: nextProps.total,
            svgDimen: nextProps.svgDimen
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return this.props.svgDimen !== nextProps.svgDimen ? true : false;
    }    
    componentDidMount(){
        this.renderSliderGraph();
    }
    componentDidUpdate(){
        this.renderSliderGraph();
    }
    renderSliderGraph(){
        const {svgDimen, margins, total, columns} = this.state;
        if(total.columns === undefined) total.columns = columns;
        let data = total.columns.slice(3).map(function(id){
            return {
                id: id,
                values: total.map(function(d){
                    return{
                        year: d.year,
                        slide: d[id]
                    }
                })
            };
        });
        
        let start = data[0].values[0].year, end = data[0].values[data[0].values.length - 1].year;
        let x = d3.scaleLinear()
            .range([margins.left, svgDimen.width - margins.right])
            .domain([start, end]);
        let y = d3.scaleLinear()
            .range([svgDimen.height - margins.bottom , margins.top])
            .domain([0, 100]);

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d=> x(d.year))
            .y0(y(0))
            .y1(d => y(d.slide));

        let graph = d3.select(this.GraphAxisElement);
        graph.selectAll("*").remove();

        graph.append("g")
            .attr("transform", "translate(0," + (svgDimen.height - margins.bottom) + ")")
            .call(d3.axisBottom()
                .scale(x)
                .ticks(data[0].values.length)//only slide values length
                .tickFormat(d3.format(""))
            )                        
            .selectAll("text")        
            .style("font-size","10px")
            .style("fill","black");
        graph
            .append("g")
            .call(d3.axisLeft()
                .scale(y)
                .ticks(10)
                .tickSize(0)                
            )
            .select(".domain").style('opacity', 0);
        
        graph.selectAll(".area")
            .data(data)
            .enter().append("path")
                .attr("d", (d) => area(d.values))
                .style("fill", "#ddd");
        // graph.selectAll("line").attr("stroke","white");//set black when shows GraphAxis
        // graph.select("path").style("d","none");
    }
    render(){
        const {svgDimen, total, margins} = this.state;
        const {onChangePeriod} = this.props;
        let years = total.map(d => d.year);
        
        let start = years[0], end = years[years.length - 1];
        let x = d3.scaleLinear()
            .range([margins.left, svgDimen.width - margins.right])
            .domain([start, end]);
        let rangeValues = {h1: x(start), h2: x(end), tempH1: x(start), tempH2: x(end), trueYear1: start, trueYear2: end};
        
        return  <svg className="graphSliderSvg" width={svgDimen.width} height={svgDimen.height}>
                    <g className="graphSliderGroup">                        
                        <g className="graphSliderAxis" ref={el => this.GraphAxisElement = el } />
                        <rect x={x(start)} y="0" width={x(end) - x(start)} height={svgDimen.height - margins.bottom} fill="rgba(54, 174, 175, 0.65)" className="rangeBarFilled" />
                        <Handle className="handleLeft"  onChangePeriod={onChangePeriod} transform={`translate(${x(start)},0)`} svgDimen={svgDimen} margins={margins} handle="handleLeft" years={years} rangeValues={rangeValues} xScale={x} initValue={start}/>
                        <Handle className="handleRight" onChangePeriod={onChangePeriod} transform={`translate(${x(end)},0)`} svgDimen={svgDimen} margins={margins} handle="handleRight" years={years} rangeValues={rangeValues} xScale={x} initValue={end}/>
                    </g>
                </svg>;
    }
    
}

class AreaChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            total: this.props.data,
            partial: this.props.data,
            csv_cols: this.props.data.columns,
            width: this.props.width,
            height: this.props.height
        };
    }    
    componentWillReceiveProps(nextProps){
        this.setState({
            total: nextProps.data,
            partial: nextProps.data,
            width: nextProps.width,
            height: nextProps.height
        })
    }
    
    changePeriod = (startYear, endYear) => {        
        const {total} = this.state;        
        let partialData = [];
        for(let i = 0; i < total.length; i++){
            if(total[i].year >= startYear && total[i].year <= endYear){
                partialData.push(total[i]);
            }
        }
        partialData.columns = total.columns;
        this.setState({
            partial: partialData
        });
    }
    
    render() {
        const {width, height, total, partial, csv_cols} = this.state;
        const margins = {top: 20, right: 20, bottom: 20, left: 20},
              svgDimenSlider = {width: width - margins.left - margins.right, height: height/6 },
              svgDimenChart = {width: width - margins.left - margins.right, height: height * 5/6 };
        
        return  <div className="areaChartPane">
                    <div className="areaChart">
                        <Chart margins={margins} svgDimen={svgDimenChart} partial={partial} columns={csv_cols}/>
                    </div>
                    <div className="graphSlider">
                        <GraphSlider onChangePeriod={this.changePeriod} margins={margins} svgDimen={svgDimenSlider} total={total} columns={csv_cols}/>
                    </div>                    
                </div>;
    }
}

export default AreaChart;