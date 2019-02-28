import React, {
    Component
} from 'react';
import * as d3 from "d3";
import svg from 'react-svg'
import './stackchart.scss';


class StackChart extends Component {    

    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate(){
        this.drawChart();
    }
    drawChart() {
        const {width, height, data} = this.props;        
        let margin = {top: 80, right: 20, bottom: 100, left: 60},
            x = d3.scaleBand().range([0, width]).padding([0.59]),
            y = d3.scaleLinear().range([height, 0]),
            colors = ["#929292", "#df072c"],
            colorScale = d3.scaleOrdinal().range(colors),
            xAxis = d3.axisBottom(x).tickSize(0).tickPadding(15),
            yAxis = d3.axisLeft(y).tickSize(10),
            node = this.node;

        d3.select(node).selectAll("*").remove();

        let svg = d3.select(node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        colorScale.domain(d3.keys(data[0]).filter(function (key) {
                return key !== "label";
            }));
        data.forEach(function (d) {
            let y0 = 0;
            d.values = colorScale.domain().map(function (name) {
                return {
                    name: name,
                    y0: y0,
                    y1: y0 += +d[name]
                };
            });
            d.total = d.values[d.values.length - 1].y1;
        });
        x.domain(data.map(function (d) {
            return d.label;
        }));
        y.domain([0, 100]); //d3.max(data, function(d) { return d.total; })
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        svg.append("g")
            .append("text")
            .attr("x", -12)
            .attr("y", -30)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "grey")
            .text("%");
        let bar = svg.selectAll(".label")
                .data(data)
                .enter().append("g")
                .attr("class", "g")                
                .attr("transform", function(d) { return "translate(" + x(d.label) + ",0)"; });

        let bar_enter = bar.selectAll("rect")
            .data(d => d.values)
            .enter();

        let r = 10;
        bar_enter.append("rect")
            .attr("rx", (d, i) => i === 1 ? r : 0)
            .attr("ry", (d, i) => i === 1 ? r : 0)
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.y1))
            .attr("height", d => y(d.y0) - y(d.y1))
            .style("fill", d => colorScale(d.name));
        bar_enter.append("rect")
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.y1) + r)
            .attr("height", (d, i) => i === 1 ? y(d.y0) - y(d.y1) - r : 0)
            .style("fill", d => colorScale(d.name));
        bar_enter.append("line")          // attach a line
            .style("stroke-width", 3)
            .style("stroke", "black")  // colour the line
            .attr("x1", x.bandwidth()/2)     // x position of the first end of the line
            .attr("y1", d => y(d.y1) + 20)      // y position of the first end of the line
            .attr("x2", x.bandwidth()/2)     // x position of the second end of the line
            .attr("y2", d => y(d.y1) - 20); 
        bar_enter.append("text")
            .text((d, i) => i === 1 ? '' : d3.format(".2s")(d.y1-d.y0)+"%")
            .attr("y", d => y(d.y1))
            .attr("x", x.bandwidth() + 15)
            .style("fill", (d, i) => i === 1 ? "white" : "grey");
        // add top legend
        svg.append("g")
            .append("text")
            .attr("x", width / 2 - 92)
            .attr("y", -50)
            .style("text-anchor", "middle")
            .style("fill", "#df072c")
            .style("font-size", 32)
            .text("*");
        svg.append("g")
            .append("text")
            .attr("x", width / 2)
            .attr("y", -50)
            .style("text-anchor", "middle")
            .style("fill", "grey")
            .style("font-size", 32)
            .text("Net Income");
        //add bottom legend        
        svg.append("g")
            .append("circle")
            .attr("cx", 0)
            .attr("cy", height + 50)
            .attr("r", 8)
            .attr("fill", "#df072c");
        svg.append("g")
            .append("text")
            .attr("x", 15)
            .attr("y", height + 55)
            .style("text-anchor", "start")
            .style("fill", "grey")
            .style("font-size", 16)
            .text("Dividend");
        svg.append("g")
            .append("circle")
            .attr("cx", width / 3 - 15)
            .attr("cy", height + 50)
            .attr("r", 8)
            .attr("fill", "grey");
        svg.append("g")
            .append("text")
            .attr("x", width / 3)
            .attr("y", height + 55)
            .style("text-anchor", "start")
            .style("fill", "grey")
            .style("font-size", 16)
            .text("Retaining earnings");
        svg.append("g")
            .append("circle")
            .attr("cx", width * 2 / 3)
            .attr("cy", height + 50)
            .attr("r", 8)
            .attr("fill", "grey");
        svg.append("g")
            .append("text")
            .attr("x", width * 2 / 3 + 15)
            .attr("y", height + 55)
            .style("text-anchor", "start")
            .style("fill", "grey")
            .style("font-size", 16)
            .text("Pay-out ratio");
    }

    render() {        
        return  <svg ref={node => this.node = node}>
                </svg>
    }
}

export default StackChart;