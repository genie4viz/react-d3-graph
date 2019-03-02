import React, {
    Component
} from 'react';
import * as d3 from "d3";
import svg from 'react-svg'
import './negativechart.scss';


class NegativeChart extends Component {

    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate() {
        this.drawChart();
    }
    drawChart() {        
        const {width, height, data} = this.props;
        var margin = {top: 20, right: 20, bottom: 30, left: 50};           

        var x = d3.scaleLinear()
            .range([0, width]);

        var y0 = d3.scaleBand()
            .rangeRound([height, 0]).padding(0.1);
        var y1 = d3.scaleBand();

        var xAxis = d3.axisBottom(x).tickSize(height).ticks(10);

        var yAxis = d3.axisLeft(y0).tickSize(0)

        var color = d3.scaleOrdinal()
            .range(["#bdbbbc", "#63ae2d", "#929292", "#000700"]);
        
        var node = this.node;
        d3.select(node).selectAll("*").remove();
        var svg = d3.select(node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yearsNames = data.map(d => d.year);
        var labelNames = data[0].values.map(d => d.label);
        
        //remove EBITDA
        labelNames = labelNames.slice(0, 4);
        
        x.domain([-100, 100]);
        y0.domain(yearsNames);
        y1.domain(labelNames).rangeRound([0, y0.bandwidth()]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, 0)")
            .call(xAxis)            
            .select(".domain").remove();
        
        svg
            .selectAll(".tick line").attr("stroke", "#777").attr("stroke-dasharray", "2,2")

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '1')
            .call(yAxis)            
            .select(".domain").remove()
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", d => "translate(0, " + y0(d.year) + ")");            
 
        slice.selectAll("rect")
            .data(d => d.values)
            .enter().append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", d => d.value > 0 ? x(0) : x(d.value))
            .attr("width", d => d.value > 0 ? x(d.value - 100) : x(0) - x(d.value))
            .attr("height", y1.bandwidth())
            .attr("y", d => y1(d.label))
            .style("fill", d => color(d.label))
            .style("opacity", d => d.label === "EBITDA" ? 0 : 1);
        // //add percent
        slice.selectAll("text")
            .data(d => d.values)
            .enter().append("text")
            .attr("x", d => d.value > 0 ? x(d.value) + 5 : x(d.value) - 35)
            .attr("y", d => d.label !== 'EBITDA' ? y1(d.label) + y1.bandwidth() - 4 : 0)
            .text(d => d.label === "EBITDA" ? '' : d.value + "%")
            .style("font-size", 12)
            .style("fill", "#bdbbbc")

        // //add EBITDA        
        slice.selectAll("path")
            .data(d => d.values)
            .enter().append("path")
            .attr("d", d => "M" + x(d.value) + " -1 L" + x(d.value) + " " + (y1.bandwidth() + 2) +" Z")
            .style("stroke","#de0730")
            .style("stroke-width", 3)
            .style("opacity", d => d.label === "EBITDA" ? 1 : 0);

        //Legend
        // var legend = svg.selectAll(".legend")
        //     .data(data[0].values.map(function (d) {
        //         return d.label;
        //     }).reverse())
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function (d, i) {
        //         return "translate(0," + i * 20 + ")";
        //     })
        //     .style("opacity", "0");

        // legend.append("rect")
        //     .attr("x", width - 18)
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     .style("fill", function (d) {
        //         return color(d);
        //     });

        // legend.append("text")
        //     .attr("x", width - 24)
        //     .attr("y", 9)
        //     .attr("dy", ".35em")
        //     .style("text-anchor", "end")
        //     .text(function (d) {
        //         return d;
        //     });

        // legend.transition().duration(500).delay(function (d, i) {
        //     return 1300 + 100 * i;
        // }).style("opacity", "1");
    }

    render() {
        return <svg ref = {node => this.node = node}></svg>
    }
}

export default NegativeChart;