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
        var dataset = [{
                "year": "2015",
                "values": [{
                        "label": "OA",
                        "value": 42                        
                    },
                    {
                        "label": "IA",
                        "value": 23                        
                    },
                    {
                        "label": "FA",
                        "value": 42                        
                    },
                    {                        
                        "label": "CC",
                        "value": 23
                    },
                    {
                        "label": "EBITDA",
                        "value": 37
                    }
                ]
            },
            {
                "year": "2016",
                "values": [{
                        "label": "OA",
                        "value": 42                        
                    },
                    {
                        "label": "IA",
                        "value": 23                        
                    },
                    {
                        "label": "FA",
                        "value": 42                        
                    },
                    {                        
                        "label": "CC",
                        "value": 23
                    },
                    {
                        "label": "EBITDA",
                        "value": 57
                    }
                ]
            },
            {
                "year": "2017",
                "values": [{
                        "label": "OA",
                        "value": 42                        
                    },
                    {
                        "label": "IA",
                        "value": 23                        
                    },
                    {
                        "label": "FA",
                        "value": 42                        
                    },
                    {                        
                        "label": "CC",
                        "value": 23
                    },
                    {
                        "label": "EBITDA",
                        "value": 47
                    }
                ]
            },
            {
                "year": "2018",
                "values": [{
                        "label": "OA",
                        "value": 42                        
                    },
                    {
                        "label": "IA",
                        "value": 23                        
                    },
                    {
                        "label": "FA",
                        "value": 42                        
                    },
                    {                        
                        "label": "CC",
                        "value": 23
                    },
                    {
                        "label": "EBITDA",
                        "value": 77
                    }
                ]
            },
            {
                "year": "2019",
                "values": [{
                        "label": "OA",
                        "value": 42                        
                    },
                    {
                        "label": "IA",
                        "value": 23                        
                    },
                    {
                        "label": "FA",
                        "value": 42                        
                    },
                    {                        
                        "label": "CC",
                        "value": 23
                    },
                    {
                        "label": "EBITDA",
                        "value": 27
                    }
                ]
            }
        ];
        const {
            width,
            height
        } = this.props;
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            };           

        var x0 = d3.scaleBand()
            .rangeRound([0, width]).padding(0.1);

        var x1 = d3.scaleBand();

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x0).tickSize(0);

        var yAxis = d3.axisLeft(y).ticks(10)

        var color = d3.scaleOrdinal()
            .range(["#bdbbbc", "#63ae2d", "#929292", "#000700", "#de0730"]);
        
        var node = this.node;
        var svg = d3.select(node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yearsNames = dataset.map(function (d) {            
            return d.year;
        });
        var labelNames = dataset[0].values.map(function (d) {
            return d.label;
        });

        x0.domain(yearsNames);
        x1.domain(labelNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(dataset, function (year) {
            return d3.max(year.values, function (d) {
                return d.value;
            });
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

        var slice = svg.selectAll(".slice")
            .data(dataset)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.year) + ",0)";
            });

        slice.selectAll("rect")
            .data(function (d) {
                return d.values;
            })
            .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function (d) {
                return x1(d.label);
            })
            .style("fill", function (d) {
                return color(d.label)
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("height", function (d) {
                return height - y(0);
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", d3.rgb(color(d.label)).darker(2));
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", color(d.label));
            });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {
                return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });

        //Legend
        var legend = svg.selectAll(".legend")
            .data(dataset[0].values.map(function (d) {
                return d.label;
            }).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("opacity", "0");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) {
                return color(d);
            });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        legend.transition().duration(500).delay(function (d, i) {
            return 1300 + 100 * i;
        }).style("opacity", "1");
    }

    render() {
        return <svg ref = {node => this.node = node} ></svg>
    }
}

export default NegativeChart;